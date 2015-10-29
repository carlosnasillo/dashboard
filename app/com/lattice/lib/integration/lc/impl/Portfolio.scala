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

import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.Promise
import scala.concurrent.TimeoutException
import scala.concurrent.duration.DurationInt
import scala.math.BigDecimal.int2bigDecimal

import com.lattice.lib.integration.lc.LendingClubConnection
import com.lattice.lib.integration.lc.LendingClubDb
import com.lattice.lib.integration.lc.model.LendingClubNote
import com.lattice.lib.integration.lc.model.LoanStatus
import com.lattice.lib.integration.lc.model.Order
import com.lattice.lib.integration.lc.model.OrderPlaced
import com.lattice.lib.integration.lc.model.PortfolioDetails
import com.lattice.lib.integration.lc.model.Transaction
import com.lattice.lib.portfolio.AccountBalance

import play.api.Logger

/**
 * @author ze97286
 */

object Portfolio {
  private[impl] def calculateAccountBalance(portfolioDetails: PortfolioDetails, transfers: Seq[Transaction], notes: Seq[LendingClubNote]): AccountBalance = {
    val totalTransaction = (transfers map (_.amount)).sum // sigma(transferred - withdrawn)
    val totalPaymentReceived = (notes map (_.paymentsReceived)).sum // payment received from notes
    val totalInvested = notes.collect { case x if LoanStatus.isIssued(x.loanStatusEnum) => x.noteAmount }.sum // invested in notes
    val totalPendingInvestment = notes.collect { case x if LoanStatus.isPending(x.loanStatusEnum) => x.noteAmount }.sum // invested in loans not yet issued
    val totalPrincipalOutstanding = (notes map (_.principalPending)).sum
    val totalPrincipalReceived = (notes map (_.principalReceived)).sum
    val totalInterestReceived = (notes map (_.interestReceived)).sum

    val availableCash = totalTransaction + totalPaymentReceived - totalPendingInvestment - totalInvested

    AccountBalance(portfolioDetails.portfolioName, availableCash, totalInvested, totalPendingInvestment, totalPrincipalOutstanding, totalPrincipalReceived, totalInterestReceived, totalPaymentReceived, 0)
  }

  private[impl] def processNotesWithMissingOrders(portfolioDetails: PortfolioDetails, notes: Seq[LendingClubNote], orders: Seq[OrderPlaced]): Seq[OrderPlaced] = {
    val orderIdToOrder = orders.map(x => (x.orderId, x)).toMap
    notes filter (x => !orderIdToOrder.contains(x.orderId)) map (x => {
      val contract =
        if (LoanStatus.isIssued(x.loanStatusEnum)) {
          Some(createLoanContract)
        } else None

      OrderPlaced(portfolioDetails.portfolioName, x.orderId, x.loanId, None, x.noteAmount, x.orderDate, contract, x.paymentsReceived, x.loanStatus)
    })
  }


  private[impl] def processNewOrders(orders: Seq[OrderPlaced], db: LendingClubDb) = {
    orders map { x =>
      if (x.paymentsReceived > 0) {
        x.contractAddress foreach (sendPayment(_, x.paymentsReceived))
      }
      // persist the order
      db.persistOrder(x)
    }
  }
  
  private[impl] def createLoanContract: String = "" //TODO create contract on blockchain

  private[impl] def sendPayment(address: String, amount: BigDecimal) {
    //TODO implement interaction with blockchain
  }

  private[impl] def processCurrentOrders(currentOrders: Seq[OrderPlaced], orderIdToNote: Map[Int, LendingClubNote], db: LendingClubDb) {
    currentOrders foreach (order => {
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
  }

  private[impl] def submitOrderWithLock(portfolioDetails: PortfolioDetails, lc: LendingClubConnection, db: LendingClubDb, loanId: String, amount: BigDecimal, balance: AccountBalance): Future[AccountBalance] = {
    var newBalance = earmarkAccountWithLock(amount, balance)

    if (balance == newBalance) {
      throw new IllegalArgumentException("insufficient funds")
    }

    // submit the order
    val er = lc.submitOrder(Seq(Order(loanId.toInt, portfolioDetails.portfolioId, amount)))
    val investedAmount = er.orderConfirmations.head.investedAmount
    if (investedAmount > 0) {
      val order = OrderPlaced(portfolioDetails.portfolioName, er.orderInstructId.get, loanId.toInt, None, investedAmount, ZonedDateTime.now, None, 0, "pending")
      // persist the order
      db.persistOrder(order).map(x => unearmarkAccountWithLock(investedAmount, amount, newBalance))
    } else {
      val p = Promise[AccountBalance]()
      val f = p.future
      Future {
        p.success(newBalance)
      }
      p.future
    }
  }

  private[impl] def earmarkAccountWithLock(amount: BigDecimal, currentBalance: AccountBalance): AccountBalance = {
    if (currentBalance.availableCash - currentBalance.earmarked - amount >= 0) {
      val newEarmarked = currentBalance.earmarked + amount
      currentBalance.copy(earmarked = newEarmarked)
    } else {
      currentBalance
    }
  }

  private[impl] def unearmarkAccountWithLock(executedAmount: BigDecimal, unearmarkedAmout: BigDecimal, currentBalance: AccountBalance): AccountBalance = {
    val newEarmarked = currentBalance.earmarked - unearmarkedAmout
    val newAvailableCash = currentBalance.availableCash - executedAmount
    val newPendingInvestment = currentBalance.pendingInvestment + executedAmount
    currentBalance.copy(availableCash = newAvailableCash, pendingInvestment = newPendingInvestment)
  }

  private[impl] def withdrawFundsWithLock(portfolioDetails: PortfolioDetails, db: LendingClubDb, lc: LendingClubConnection, amount: BigDecimal, currentBalance: AccountBalance): Future[AccountBalance] = {
    val newAvailableCash = currentBalance.availableCash - amount
    val newBalance = currentBalance.copy(availableCash = newAvailableCash)
    lc.withdrawFunds(amount)
    db.persistTransaction(Transaction(portfolioDetails.portfolioName, ZonedDateTime.now, -amount)) map (x => newBalance)
  }

  private[impl] def transferFundsWithLock(portfolioDetails: PortfolioDetails, db: LendingClubDb, lc: LendingClubConnection, amount: BigDecimal, currentBalance: AccountBalance): Future[AccountBalance] = {
    val newAvailableCash = currentBalance.availableCash + amount
    val newBalance = currentBalance.copy(availableCash = newAvailableCash)
    lc.transferFunds(amount)
    db.persistTransaction(Transaction(portfolioDetails.portfolioName, ZonedDateTime.now, amount)) map (x => newBalance)
  }

  private def reconcilePortfolio(portfolioDetails: PortfolioDetails, db: LendingClubDb, transfers: Seq[Transaction], notes: Seq[LendingClubNote], orders: Seq[OrderPlaced]) = {
    Logger.info(s"reconciling porfolio for ${portfolioDetails}")

    // process notes with missing orders
    val missingOrders = Portfolio.processNotesWithMissingOrders(portfolioDetails, notes, orders)

    Logger.info(s"found the a few notes without orders and created the following orders for them: \n${missingOrders mkString "\n"}")

    Await.ready(Future.sequence(Portfolio.processNewOrders(missingOrders, db)), 5 seconds)

    // look through all orders for which we have notes and check if any payment has been made to them
    val orderIdToNote = notes.map(x => x.orderId -> x).toMap
    val currentOrders = orders.filter { x => orderIdToNote.contains(x.orderId) }

    Logger.info(s"currentOrders=\n${currentOrders mkString "\n"}")

    Portfolio.processCurrentOrders(currentOrders, orderIdToNote, db)

    // calculate account balance
    val balance = Portfolio.calculateAccountBalance(portfolioDetails, transfers, notes)

    Logger.info(s"account balance for portfolio ${portfolioDetails} => ${balance}")
    Logger.info(s"reconciliation done for ${portfolioDetails}")

    balance
  }
}

//TODO look at making this an actor
class Portfolio(portfolioDetails: PortfolioDetails, db: LendingClubDb, lc: LendingClubConnection, transfers: Seq[Transaction], notes: Seq[LendingClubNote], orders: Seq[OrderPlaced]) {
  private val lock: Lock = new ReentrantLock()

  @volatile private var accountBalance: AccountBalance = Portfolio.reconcilePortfolio(portfolioDetails, db, transfers, notes, orders)
  @volatile private var currentNotes: Future[Seq[LendingClubNote]] = Future { notes }
  @volatile private var reloadNotes = false

  private var analytics = portfolioAnalytics

  def ownedNotes = {
    if (reloadNotes) {
      currentNotes = Future { lc.ownedNotes.filter(_.portfolioName == portfolioDetails.portfolioName) }
      reloadNotes = false
    }
    Await.result(currentNotes,5 seconds)
  }

  def balance = accountBalance

  def portfolioAnalytics: Future[PortfolioAnalytics] = {
    currentNotes map (PortfolioAnalytics.analyse(_))
  }

  def transferFunds(amount: BigDecimal): AccountBalance = {
    lock.tryLock
    try {
      accountBalance = Await.result(Portfolio.transferFundsWithLock(portfolioDetails, db, lc, amount, accountBalance), 5 seconds)
      accountBalance
    } finally {
      lock.unlock()
    }
  }

  def withdrawFunds(amount: BigDecimal): AccountBalance = {
    lock.tryLock
    try {
      accountBalance = Await.result(Portfolio.withdrawFundsWithLock(portfolioDetails, db, lc, amount, accountBalance), 5 seconds)
      accountBalance
    } finally {
      lock.unlock()
    }
  }

  def submitOrder(loanId: String, amount: BigDecimal): AccountBalance = {
    lock.tryLock
    try {
      val future = Portfolio.submitOrderWithLock(portfolioDetails, lc, db, loanId, amount, accountBalance)
      val newBalance = Await.result(future, 5 seconds)
      if (newBalance != accountBalance) {
        reloadNotes = true
        accountBalance = newBalance
      }
      accountBalance
    } finally {
      lock.unlock()
    }
  }
}