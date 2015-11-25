/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.portfolio

import java.time.LocalDate

import com.lattice.lib.integration.lc.model.LoanAnalytics

import scala.concurrent.ExecutionContext
import scala.concurrent.Future

import models.Grade
import models.Originator

/**
 * Defines a set of analytics for marketplace lending
 * 
 * @author ze97286
 */
trait MarketplaceAnalytics {
  implicit val ec = ExecutionContext.Implicits.global

  def originator:Originator.Value

  def loadLoansFromMarket():Unit

  // wraps
  def wrappedAnalytics: Future[LoanAnalytics]

  // the number of loans originated within the date range (inclusive on both ends)
  def loanOrigination(from:LocalDate, to:LocalDate): Future[Map[LocalDate, Int]]

  // the number of loans originated within the date range (inclusive on both ends) - breakdown by grade
  def loanOriginationByGrade(from:LocalDate, to:LocalDate): Future[Map[LocalDate,Map[Grade.Value, Int]]]
  
  // the number of loans originated within the date range (inclusive on both ends) breakdown by yield
  def loanOriginationByYield(from:LocalDate, to:LocalDate): Future[Map[LocalDate,Map[Double, Int]]]
  
  // the total notional originated within the date range (inclusive on both ends)
  def originatedNotional(from:LocalDate, to:LocalDate): Future[Map[LocalDate, BigDecimal]]
  
  // the total notional originated within the date range (inclusive on both ends) - breakdown by grade
  def originatedNotionalByGrade(from:LocalDate, to:LocalDate): Future[Map[LocalDate,Map[Grade.Value, BigDecimal]]]
  
  // the total notional originated within the date range (inclusive on both ends) - breakdown by yield
  def originatedNotionalByYield(from:LocalDate, to:LocalDate): Future[Map[LocalDate,Map[Double, BigDecimal]]]
}