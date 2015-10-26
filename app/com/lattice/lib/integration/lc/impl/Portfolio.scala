/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.impl

import java.time.ZonedDateTime
import java.util.concurrent.locks.Lock
import java.util.concurrent.locks.ReentrantLock
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.Promise
import scala.math.BigDecimal.int2bigDecimal
import com.lattice.lib.integration.lc.LendingClubConnection
import com.lattice.lib.integration.lc.LendingClubDb
import com.lattice.lib.integration.lc.model.LendingClubNote
import com.lattice.lib.integration.lc.model.Order
import com.lattice.lib.integration.lc.model.OrderPlaced
import com.lattice.lib.integration.lc.model.Transaction
import com.lattice.lib.portfolio.AccountBalance
import com.lattice.lib.integration.lc.model.PortfolioDetails

/**
 * @author ze97286
 */
class Portfolio(portfolioDetails: PortfolioDetails, db: LendingClubDb, lc: LendingClubConnection, transfers: Seq[Transaction], notes: Seq[LendingClubNote], orders: Seq[OrderPlaced]) {
  private val lock: Lock = new ReentrantLock()
  private var accountBalance: AccountBalance = reconcilePortfolio(transfers, notes, orders)

  @volatile private var currentNotes = notes
  @volatile private var reloadNotes = false
  private var analytics = portfolioAnalytics

  private def reconcilePortfolio(transfers: Seq[Transaction], notes: Seq[LendingClubNote], orders: Seq[OrderPlaced]) = {
    lock.tryLock
    try {
      reconcilePortfolioWithLock(transfers, notes, orders)
    } finally {
      lock.unlock()
    }
  }

  def ownedNotes=currentNotes
  
  def balance = accountBalance

  def portfolioAnalytics: Future[PortfolioAnalytics] = {
    val p = Promise[PortfolioAnalytics]()
    val f = p.future

    Future {
      if (!reloadNotes) {
        p.success(PortfolioAnalytics.analyse(currentNotes))
      } else {
        currentNotes = lc.ownedNotes.filter(_.portfolioName == portfolioDetails.portfolioName)
        p.success(PortfolioAnalytics.analyse(currentNotes))
      }
    }
    p.future
  }

  //TODO need to create contracts for which a note has changed state to issued
  //TODO need to send funds to contract for which payment has been made
  private def reconcilePortfolioWithLock(transfers: Seq[Transaction], notes: Seq[LendingClubNote], orders: Seq[OrderPlaced]) = {
    // calculate account balance
    val totalTransaction = (transfers map (_.amount)).sum // sigma(transferred - withdrawn)
    val totalPaymentReceived = (notes map (_.paymentsReceived)).sum // payment received from notes
    val totalInvested = (notes map (_.noteAmount)).sum // invested in notes
    val totalPendingInvestment = (orders map (_.investedAmount)).sum // invested in loans not yet initiated
    val totalPrincipalOutstanding = (notes map (_.principalPending)).sum
    val totalPrincipalReceived = (notes map (_.principalReceived)).sum
    val totalInterestReceived = (notes map (_.interestReceived)).sum

    val availableCash = totalTransaction + totalPaymentReceived - totalPendingInvestment - totalInvested

    accountBalance = AccountBalance(portfolioDetails.portfolioName, availableCash, totalInvested, totalPendingInvestment, totalPrincipalOutstanding, totalPrincipalReceived, totalInterestReceived, totalPaymentReceived, 0)

    //create contracts where needed 
    val orderIdToNote = notes.map(x => (x.orderId, x)).toMap

    val missingOrders = notes filter (x => !orderIdToNote.contains(x.orderId)) foreach (x => {
      val contract =
        if (x.loanStatus != "In Funding") {
          Some(createLoanContract)
        } else None

      val order = OrderPlaced(portfolioDetails.portfolioName, x.orderId, x.loanId, None, x.noteAmount, x.orderDate, contract, x.paymentsReceived, x.loanStatus)
      if (x.paymentsReceived > 0) {
        contract foreach (sendPayment(_, x.paymentsReceived))
      }
      // persist the order
      db.persistOrder(order)
    })

    val materialisedOrders = (orders).filter(x => orderIdToNote.contains(x.orderId))
    materialisedOrders foreach (order => {
      val note = orderIdToNote(order.orderId)
      order.contractAddress match {
        case None =>
          val address = createLoanContract
          db.persistOrder(order.copy(loanStatus = note.loanStatus, noteId = Some(note.noteId), contractAddress = Some(address)))
        case Some(address) if (order.paymentsReceived != note.paymentsReceived) =>
          val paid = note.paymentsReceived - order.paymentsReceived
          db.persistOrder(order.copy(paymentsReceived = note.paymentsReceived))
          sendPayment(address, paid)
      }
    })

    accountBalance
  }

  private def createLoanContract: String = ???
  private def sendPayment(address: String, payment: BigDecimal) = ???

  def transferFunds(amount: BigDecimal) {
    lock.tryLock
    try {
      transferFundsWithLock(amount)
    } finally {
      lock.unlock()
    }
  }

  def transferFundsWithLock(amount: BigDecimal) {
    val newAvailableCash = accountBalance.availableCash + amount
    val newBalance = accountBalance.copy(availableCash = newAvailableCash)
    db.persistTransaction(Transaction(portfolioDetails.portfolioName, ZonedDateTime.now, amount))
    lc.transferFunds(amount)
    accountBalance = newBalance
  }

  def withdrawFunds(amount: BigDecimal) {
    lock.tryLock
    try {
      withdrawFundsWithLock(amount)
    } finally {
      lock.unlock()
    }
  }

  def withdrawFundsWithLock(amount: BigDecimal) {
    val newAvailableCash = accountBalance.availableCash - amount
    val newBalance = accountBalance.copy(availableCash = newAvailableCash)
    db.persistTransaction(Transaction(portfolioDetails.portfolioName, ZonedDateTime.now, -amount))
    lc.withdrawFunds(amount)
    accountBalance = newBalance
  }

  def submitOrder(loanId: String, amount: BigDecimal) {
    lock.tryLock
    try {
      if (!earmarkAccountWithLock(amount)) {
        throw new IllegalArgumentException("insufficient funds")
      }
    } finally {
      lock.unlock()
    }

    // submit the order
    //TODO add portfolio id
    val er = lc.submitOrder(Seq(Order(loanId.toInt, portfolioDetails.portfolioId, amount)))
    val investedAmount = er.orderConfirmations.head.investedAmount
    if (investedAmount > 0) {
      reloadNotes = true
      val order = OrderPlaced(portfolioDetails.portfolioName, er.orderInstructId, loanId.toInt, None, investedAmount, ZonedDateTime.now, None, 0, "pending")
      // persist the order
      db.persistOrder(order)
    }
    lock.tryLock
    try {
      unearmarkAccountWithLock(investedAmount, amount)
    } finally {
      lock.unlock()
    }
  }

  def earmarkAccountWithLock(amount: BigDecimal): Boolean = {
    if (accountBalance.availableCash - accountBalance.earmarked - amount >= 0) {
      val newEarmarked = accountBalance.earmarked + amount
      accountBalance = accountBalance.copy(earmarked = newEarmarked)
      true
    } else {
      false
    }
  }

  def unearmarkAccountWithLock(executedAmount: BigDecimal, unearmarkedAmout: BigDecimal) {
    val newEarmarked = accountBalance.earmarked - unearmarkedAmout
    val newAvailableCash = accountBalance.availableCash - executedAmount
    val newPendingInvestment = accountBalance.pendingInvestment + executedAmount
    accountBalance = accountBalance.copy(availableCash = newAvailableCash, pendingInvestment = newPendingInvestment)
  }
}