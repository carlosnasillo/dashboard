/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.impl

import scala.collection.mutable.{ Map => MMap }
import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.Failure
import scala.util.Success
import com.lattice.lib.integration.lc.LendingClubConnection
import com.lattice.lib.integration.lc.LendingClubDb
import com.lattice.lib.integration.lc.model.LendingClubNote
import com.lattice.lib.integration.lc.model.OrderPlaced
import com.lattice.lib.integration.lc.model.Transaction
import com.lattice.lib.portfolio.MarketplacePortfolioManager
import models.Originator
import com.lattice.lib.integration.lc.model.PortfolioDetails
import models.Note
import play.api.Logger

/**
 * @author ze97286
 */
class PortfolioManagerImpl(lc: LendingClubConnection, db: LendingClubDb) extends MarketplacePortfolioManager {
  private var portfolioNameToPortfolio: MMap[String, Portfolio] = MMap()

  override def originator = Originator.LendingClub

  // load all notes, orders, and transactions from db, split by portfolio name and reconcile
  override def reconcilePortfolio() {
    Logger.info("starting portfolio reconciliation")
    val transactions = db.loadTransactions
    val ownedNotes = lc.ownedNotes
    val placedOrders = db.loadOrders
    val portfolios = lc.loadPortfolios

    transactions.onComplete {
      case Success(trans) => placedOrders.onComplete {
        case Success(orders) => reconcilePortfolio(portfolios, trans, ownedNotes, orders)
        case Failure(e)      =>
          Logger.error(e.getMessage, e)
          throw new IllegalStateException("Failed to reconcile state with Lending Club", e)
      }
      case Failure(e) => 
        Logger.error(e.getMessage, e)
        throw new IllegalStateException("Failed to reconcile state with Lending Club", e)
    }
  }

  private def reconcilePortfolio(portfolios: Seq[PortfolioDetails], transactions: Seq[Transaction], notes: Seq[LendingClubNote], orders: Seq[OrderPlaced]) {
    Logger.info(s"reconciling portfolios for: ${portfolios mkString "\n"}")
    Logger.info(s"transactions: ${transactions mkString "\n"}")
    Logger.info(s"notes: ${notes mkString "\n"}")
    Logger.info(s"orders: ${orders mkString "\n"}")
    
    val transfersByPortfolio = transactions.groupBy(_.investorId)
    val notesByPortfolio = notes.filter(_.portfolioName.isDefined).groupBy(_.portfolioName.get)
    val ordersByPortfolio = orders.groupBy(_.portfolioName)

    //find all portfolios for which we've recorded transactions
    val portfoliosByTrans = transactions.map(_.investorId).distinct.toSet

    // check if there are any notes for a portfolio name for which we don't have transactions - there should be none
    val portfoliosByNotes = notes.map(_.portfolioName.getOrElse("")).distinct.toSet

    // check if there's any orders for a portfolio name for which we don't have transactions - there should be none
    //for each portfolio call reconcile with params
    val portfolioByOrders = orders.map(_.portfolioName).distinct.toSet

    val portfoliosWithNotesAndNoTransactions = portfoliosByTrans -- portfoliosByNotes
    if (!portfoliosWithNotesAndNoTransactions.isEmpty) {
      throw new IllegalStateException("Found notes for which we don't have any transactions")
    }

    val portfolioWithOrdersAnNoTransactions = portfoliosByTrans -- portfolioByOrders
    if (!portfolioWithOrdersAnNoTransactions.isEmpty) {
      throw new IllegalStateException("Found orders for which we don't have any transactions")
    }

    portfolioNameToPortfolio = (portfolios.filter { x => x.portfolioName != "" }.
      map { p => (p, new Portfolio(p, db, lc, transfersByPortfolio(p.portfolioName), notesByPortfolio(p.portfolioName), ordersByPortfolio(p.portfolioName))) }).
      asInstanceOf[MMap[String, Portfolio]]

  }

  override def accountBalance(portfolioName: String) = portfolioNameToPortfolio(portfolioName).balance

  override def transferFunds(portfolioName: String, amount: BigDecimal) {
    val portfolio = portfolioNameToPortfolio.get(portfolioName)
    portfolio match {
      case None    => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) => p.transferFunds(amount)
    }
  }

  override def withdrawFunds(portfolioName: String, amount: BigDecimal) {
    val portfolio = portfolioNameToPortfolio.get(portfolioName)
    portfolio match {
      case None    => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) => p.withdrawFunds(amount)
    }
  }

  override def submitOrder(portfolioName: String, loanId: String, amount: BigDecimal) {
    val portfolio = portfolioNameToPortfolio.get(portfolioName)
    portfolio match {
      case None    => throw new IllegalArgumentException("unknown portfolio name")
      case Some(p) => p.submitOrder(loanId, amount)
    }
  }

  override def newInvestor(portfolioName: String, portfolioDescription: String) {
    val portfolioDetails = lc.createPorfolio(portfolioName, portfolioDescription)
    portfolioNameToPortfolio(portfolioName) = new Portfolio(portfolioDetails, db, lc, Seq(), Seq(), Seq())
  }

  override def portfolioAnalytics(portfolioName: String) = portfolioNameToPortfolio(portfolioName).portfolioAnalytics

  override def notes(portfolioName:String):Seq[Note] = portfolioNameToPortfolio(portfolioName).ownedNotes map (_.toNote)
  
}