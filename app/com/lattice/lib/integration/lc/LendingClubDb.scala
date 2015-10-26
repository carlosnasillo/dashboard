/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

package com.lattice.lib.integration.lc

import java.time.LocalDate

import scala.concurrent.Future

import com.lattice.lib.integration.lc.model.LoanAnalytics
import com.lattice.lib.integration.lc.model.LoanListing
import com.lattice.lib.integration.lc.model.OrderPlaced
import com.lattice.lib.integration.lc.model.Transaction

/**
 * Trait for lending club data persistence
 *
 * TODO add whatever is needed by the analytics API
 *
 * @author ze97286
 */
trait LendingClubDb {
  // persist loan listing to lattice database
  def persistLoans(availableLoans: LoanListing): Future[Unit]

  // load currently available loans from lattice database
  def availableLoans: Future[LoanListing]

  // upsert an order
  def persistOrder(orderPlaced: OrderPlaced):Future[Unit]

  // load an order
  def loadOrders: Future[Seq[OrderPlaced]]

  // persist a transfer or withdrawal transaction
  def persistTransaction(transaction: Transaction) : Future[Unit]

  // load all transactions 
  def loadTransactions: Future[Seq[Transaction]]
  
  // persists loans analytics to lattice db
  def persistAnalytics(loanAnalytics: LoanAnalytics): Future[Unit]

  // load loans analytics from lattice db
  def loadAnalyticsByDate(date: LocalDate): Future[LoanAnalytics]
}