/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.impl

import java.util.concurrent.locks.ReentrantLock

import scala.collection.mutable.{ Map => MMap }
import scala.concurrent.Await
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.concurrent.duration.DurationInt
import scala.util.Failure
import scala.util.Success

import com.lattice.lib.integration.lc.LendingClubConnection
import com.lattice.lib.integration.lc.LendingClubDb
import com.lattice.lib.integration.lc.model.LendingClubNote
import com.lattice.lib.integration.lc.model.LendingClubNote.ToNote
import com.lattice.lib.integration.lc.model.OrderPlaced
import com.lattice.lib.integration.lc.model.PortfolioDetails
import com.lattice.lib.integration.lc.model.Transaction
import com.lattice.lib.portfolio.AccountBalance
import com.lattice.lib.portfolio.MarketplacePortfolioManager

import models.Note
import models.Originator
import play.api.Logger

/**
 * @author ze97286
 */

object PortfolioManagerImpl {
  private[impl] def reconcilePortfolioWithLock(lc: LendingClubConnection, db: LendingClubDb): Future[Map[String, Portfolio]] = {
    Logger.info("starting portfolio reconciliation")
    val portfolios = lc.loadPortfolios
    val transactions = db.loadTransactions
    val ownedNotes = lc.ownedNotes
    val placedOrders = db.loadOrders

    for (
      trans <- transactions;
      orders <- placedOrders
    ) yield (reconcilePortfolioWithLock(lc, db, portfolios, trans, ownedNotes, orders))
  }

  private[impl] def reconcilePortfolioWithLock(lc: LendingClubConnection, db: LendingClubDb, portfolios: Seq[PortfolioDetails], transactions: Seq[Transaction], notes: Seq[LendingClubNote], orders: Seq[OrderPlaced]): Map[String, Portfolio] = {
    Logger.info(s"reconciling portfolios for: ${portfolios mkString "\n"}")
    Logger.info(s"transactions: ${transactions mkString "\n"}")
    Logger.info(s"notes: ${notes mkString "\n"}")
    Logger.info(s"orders: ${orders mkString "\n"}")

    val transfersByPortfolio = transactions.filter(_.investorId != "").groupBy(_.investorId)
    val notesByPortfolio = notes.filter(_.portfolioName.isDefined).groupBy(_.portfolioName.get)
    val ordersByPortfolio = orders.groupBy(_.portfolioName)

    //find all portfolios for which we've recorded transactions
    val portfoliosByTrans = transactions.map(_.investorId).distinct.toSet

    // find all portfolios for which we don't have transactions but we have notes (ignore empty portfolio) - should be none
    val portfoliosByNotesWithoutTransactions = notes.filter(n => n.portfolioName.isDefined && !portfoliosByTrans.contains(n.portfolioName.get))

    portfoliosByNotesWithoutTransactions foreach (n => {
      Logger.warn(s"Found a note (${n.orderId}/${n.noteId}/${n.loanId}) with a portfolio name (${n.portfolioName.get}) for which we have no transactions - will not reconcile this portfolio")
    })

    // find all portfolios for which we don't have transactions but we have orders (ignore empty portfolio) - should be none
    val portfoliosByOrdersWithoutTransactions = orders.filter(o => o.portfolioName != "" && !portfoliosByTrans.contains(o.portfolioName))
    portfoliosByOrdersWithoutTransactions foreach (o => {
      Logger.warn(s"Found an order (${o.orderId}/${o.noteId}/${o.loanId}) with a portfolio name (${o.portfolioName}) for which we have no transactions - will not reconcile this portfolio")
    })

    // the portfolios that we create are only those for which we:
    // 1. Have a portfolio defined
    // 2. Has notes and transactions
    // 3. Has no notes
    val newPortfolioMap = (portfolios.filter { x => x.portfolioName != "" && ((portfoliosByTrans.contains(x.portfolioName) || !notesByPortfolio.contains(x.portfolioName))) }.
      map { p => (p.portfolioName, new Portfolio(p, db, lc, transfersByPortfolio.getOrElse(p.portfolioName, Seq()), notesByPortfolio.getOrElse(p.portfolioName, Seq()), ordersByPortfolio.getOrElse(p.portfolioName, Seq()))) })

    newPortfolioMap.toMap
  }

  private[impl] def accountBalance(portfolioName: String, portfolioNameToPortfolio: Map[String, Portfolio]): AccountBalance = {
    portfolioNameToPortfolio.get(portfolioName) match {
      case None => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) =>
        val balance = portfolioNameToPortfolio(portfolioName).balance
        Logger.info(s"account balance for portfolio $portfolioName is $balance")
        balance
    }

  }

  private[impl] def transferFundsWithLock(portfolioName: String, amount: BigDecimal, portfolioNameToPortfolio: Map[String, Portfolio]): AccountBalance = {
    portfolioNameToPortfolio.get(portfolioName) match {
      case None => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) =>
        val newBalance = p.transferFunds(amount)
        Logger.info(s"balance for $portfolioName after transfer is: $newBalance")
        newBalance
    }
  }

  private[impl] def withdrawFundsWithLock(portfolioName: String, amount: BigDecimal, portfolioNameToPortfolio: Map[String, Portfolio]): AccountBalance = {
    portfolioNameToPortfolio.get(portfolioName) match {
      case None => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) =>
        val newBalance = p.withdrawFunds(amount)
        Logger.info(s"balance for $portfolioName after withdrawal is: $newBalance")
        newBalance
    }
  }

  private[impl] def submitOrderWithLock(portfolioName: String, loanId: String, amount: BigDecimal, portfolioNameToPortfolio: Map[String, Portfolio]): AccountBalance = {
    portfolioNameToPortfolio.get(portfolioName) match {
      case None => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) =>
        val newBalance = p.submitOrder(loanId, amount)
        Logger.info(s"accountBalance after the order for portfolio $portfolioName is $newBalance")
        newBalance
    }
  }

  private[impl] def newInvestorWithLock(lc: LendingClubConnection, db: LendingClubDb, portfolioName: String, portfolioDescription: String, portfolioNameToPortfolio: MMap[String, Portfolio]): AccountBalance = {
    val portfolioDetails = lc.createPorfolio(portfolioName, portfolioDescription)
    Logger.info(s"portfolio details = $portfolioDetails")

    portfolioNameToPortfolio(portfolioName) = new Portfolio(portfolioDetails, db, lc, Seq(), Seq(), Seq())
    Logger.info(s"portfolio created for $portfolioName with account balance=${portfolioNameToPortfolio(portfolioName).balance}")

    portfolioNameToPortfolio(portfolioName).balance
  }

  private[impl] def portfolioAnalyticsWithLock(portfolioName: String, portfolioNameToPortfolio: Map[String, Portfolio]) = {
    portfolioNameToPortfolio.get(portfolioName) match {
      case None => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) =>
        val analytics = p.portfolioAnalytics
        Logger.info("returning analytics future")
        analytics
    }
  }

  /**
   * Return the notes for a given portfolio
   */
  private[impl] def notesWithLock(portfolioName: String, portfolioNameToPortfolio: Map[String, Portfolio]) = {
    portfolioNameToPortfolio.get(portfolioName) match {
      case None => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) =>
        val ret = p.ownedNotes map (_.toNote)
        Logger.info(s"found notes for $portfolioName:\n${ret mkString "\n"}")
        ret
    }
  }
}

//TODO look at making this an actor
class PortfolioManagerImpl(lc: LendingClubConnection, db: LendingClubDb) extends MarketplacePortfolioManager {
  private var portfolioNameToPortfolio: MMap[String, Portfolio] = MMap()

  private val globalLock = new ReentrantLock

  override def originator = Originator.LendingClub

  override def reconcilePortfolio() {
    globalLock.tryLock
    try {
      val future = PortfolioManagerImpl.reconcilePortfolioWithLock(lc, db)
      Await.result(future, 5 seconds)

      future.onComplete {
        case Success(m) =>
          portfolioNameToPortfolio = MMap(m.toSeq: _*)
          Logger.info(s"reconciliation completed successfully")
        case Failure(e) =>
          Logger.error(s"reconciliation failed - ${e.getMessage}")
          throw new IllegalStateException(e)
      }
    } finally {
      globalLock.unlock()
    }
  }

  override def accountBalance(portfolioName: String) = {
    Logger.info(s"requesting account balanace for $portfolioName")
    globalLock.tryLock
    try {
      PortfolioManagerImpl.accountBalance(portfolioName, portfolioNameToPortfolio.toMap)
    } finally {
      globalLock.unlock
    }

  }
  override def transferFunds(portfolioName: String, amount: BigDecimal) {
    Logger.info(s"processing request to transfer $amount to $portfolioName")
    globalLock.tryLock
    try {
      PortfolioManagerImpl.transferFundsWithLock(portfolioName, amount, portfolioNameToPortfolio.toMap)
    } finally {
      globalLock.unlock
    }

  }

  override def withdrawFunds(portfolioName: String, amount: BigDecimal) {
    Logger.info(s"processing request to withdraw $amount from $portfolioName")
    globalLock.tryLock
    try {
      PortfolioManagerImpl.withdrawFundsWithLock(portfolioName, amount, portfolioNameToPortfolio.toMap)
    } finally {
      globalLock.unlock
    }

  }

  override def submitOrder(portfolioName: String, loanId: String, amount: BigDecimal) {
    Logger.info(s"submit order for $portfolioName, loanId=$loanId, amount=$amount")
    globalLock.tryLock
    try {
      PortfolioManagerImpl.submitOrderWithLock(portfolioName, loanId, amount, portfolioNameToPortfolio.toMap)
    } finally {
      globalLock.unlock
    }
  }

  override def newInvestor(portfolioName: String, portfolioDescription: String) {
    Logger.info(s"creating new investor for $portfolioName")
    globalLock.tryLock
    try {
      PortfolioManagerImpl.newInvestorWithLock(lc, db, portfolioName, portfolioDescription, portfolioNameToPortfolio)
    } finally {
      globalLock.unlock
    }
  }

  override def portfolioAnalytics(portfolioName: String) = {
    Logger.info(s"portfolio analytics called for $portfolioName")
    globalLock.tryLock
    try {
      PortfolioManagerImpl.portfolioAnalyticsWithLock(portfolioName, portfolioNameToPortfolio.toMap)
    } finally {
      globalLock.unlock  
    }
  }

  override def notes(portfolioName: String): Seq[Note] = {
    Logger.info(s"notes called for portfolio $portfolioName")
    globalLock.tryLock
    try {
      PortfolioManagerImpl.notesWithLock(portfolioName, portfolioNameToPortfolio.toMap)
    } finally {
      globalLock.unlock
    }
  }
}