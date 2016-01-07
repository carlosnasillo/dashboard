/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.lattice.lib.integration.lc

import java.time.LocalDate

import scala.concurrent.Future

import com.lattice.lib.integration.lc.model.LoanAnalytics
import com.lattice.lib.integration.lc.model.LoanListing

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

  // persists loans analytics to lattice db
  def persistAnalytics(loanAnalytics: LoanAnalytics): Future[Unit]

  // load loans analytics from lattice db
  def loadAnalyticsByDate(date: LocalDate): Future[LoanAnalytics]
}