/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.impl

import java.time.LocalDate

import com.lattice.lib.integration.lc.LendingClubDb
import com.lattice.lib.portfolio.MarketplaceAnalytics
import models.Grade.Grade
import models.{Grade, Originator}

import scala.concurrent.Future

/**
 * Implementation for LendingClub of the Market
 * Load marketplace analytics from db
 *
 * TODO implement
 * @author ze97286
 */
class LendingClubAnalytics(db: LendingClubDb) extends MarketplaceAnalytics {
  override val originator = Originator.LendingClub

  private def dateRange(from: LocalDate, to: LocalDate): Iterator[LocalDate] =
    Iterator.iterate(from)(_.plusDays(1)).takeWhile(!_.isAfter(to))

  // read the latest doc from loans and return the count of loans
  override def numLoans: Future[Int] = db.loadAnalyticsByDate(LocalDate.now()).map(_.numLoans)

  // read the latest doc from loans and return the sum of available notional
  override def liquidity: Future[BigDecimal] = db.loadAnalyticsByDate(LocalDate.now()).map(_.liquidity)

  // read the latest doc from loans partition by grade, count
  override def numLoansByGrade: Future[Map[Grade, Int]] = db.loadAnalyticsByDate(LocalDate.now()).map(_.numLoansByGradeEnum)

  // read the latest doc from loans partition by grade, sum
  override def liquidityByGrade: Future[Map[Grade, BigDecimal]] = db.loadAnalyticsByDate(LocalDate.now()).map(_.liquidityByGradeEnum)

  // read the latest doc from loans for today and yesterday, diff in count
  override def dailyChangeInNumLoans: Future[Int] = db.loadAnalyticsByDate(LocalDate.now()).map(_.dailyChangeInNumLoans)

  // read the latest doc from loans for today and yesterday, diff in sum
  override def dailyChangeInLiquidity: Future[BigDecimal] = db.loadAnalyticsByDate(LocalDate.now()).map(_.dailyChangeInLiquidity)

  // read the latest doc from loans for each of the days in the range and for each return the number of loans *originated* on this day
  override def loanOrigination(from: LocalDate, to: LocalDate): Future[Map[LocalDate, Int]] = {
    val mapOfFutures = dateRange(from, to)
        .map(date => (date, db.loadAnalyticsByDate(date).map(_.loanOrigination)))
        .toMap

    Future.sequence(mapOfFutures.map(entry => entry._2.map(i => (entry._1, i)))).map(_.toMap)
  }

  // read the latest doc from loans for each of the days in the range and for each return the number of loans  *originated* on this day partition by grade
  override def loanOriginationByGrade(from: LocalDate, to: LocalDate): Future[Map[LocalDate, Map[Grade.Value, Int]]] = {
    val mapOfFutures = dateRange(from, to)
      .map( date => (date, db.loadAnalyticsByDate(date).map(_.loanOriginationByGradeEnum)))
      .toMap

    Future.sequence(mapOfFutures.map(entry => entry._2.map(i => (entry._1, i)))).map(_.toMap)
  }

  // read the latest doc from loans for each of the days in the range and for each return the number of loans  *originated* on this day partition by yield
  override def loanOriginationByYield(from: LocalDate, to: LocalDate): Future[Map[LocalDate, Map[Double, Int]]] = {
    val mapOfFutures = dateRange(from, to)
      .map( date => (date, db.loadAnalyticsByDate(date).map(_.loanOriginationByYield)))
      .toMap

    Future.sequence(mapOfFutures.map(entry => entry._2.map(i => (entry._1, i)))).map(_.toMap)
  }

  // read the latest doc from loans for each of the days in the range and for each return the sum of requested cash  *originated* on this day
  override def originatedNotional(from: LocalDate, to: LocalDate): Future[Map[LocalDate, BigDecimal]] = {
    val mapOfFutures = dateRange(from, to)
      .map( date => (date, db.loadAnalyticsByDate(date).map(_.originatedNotional)))
      .toMap

    Future.sequence(mapOfFutures.map(entry => entry._2.map(i => (entry._1, i)))).map(_.toMap)
  }

  // read the latest doc from loans for each of the days in the range and for each return the sum of requested cash  *originated* on this day partition by grade
  override def originatedNotionalByGrade(from: LocalDate, to: LocalDate): Future[Map[LocalDate, Map[Grade.Value, BigDecimal]]] = {
    val mapOfFutures = dateRange(from, to)
      .map( date => (date, db.loadAnalyticsByDate(date).map(_.originatedNotionalByGradeEnum)))
      .toMap

    Future.sequence(mapOfFutures.map(entry => entry._2.map(i => (entry._1, i)))).map(_.toMap)
  }

  // read the latest doc from loans for each of the days in the range and for each return the sum of requested cash  *originated* on this day partition by yield
  override def originatedNotionalByYield(from: LocalDate, to: LocalDate): Future[Map[LocalDate, Map[Double, BigDecimal]]] = {
    val mapOfFutures = dateRange(from, to)
      .map( date => (date, db.loadAnalyticsByDate(date).map(_.originatedNotionalByYield)))
      .toMap

    Future.sequence(mapOfFutures.map(entry => entry._2.map(i => (entry._1, i)))).map(_.toMap)
  }
}