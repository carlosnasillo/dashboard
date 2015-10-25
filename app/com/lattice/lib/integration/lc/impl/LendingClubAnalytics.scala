/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.impl

import java.time.LocalDate
import com.lattice.lib.utils.{DbUtil, Log}
import com.lattice.lib.utils.Implicits.SeqImpl
import com.lattice.lib.integration.lc.LendingClubDb
import com.lattice.lib.portfolio.MarketplaceAnalytics
import models.Grade.Grade
import models.{Grade, Originator}
import scala.concurrent.Future
import com.lattice.lib.integration.lc.model.LoanListing
import com.lattice.lib.integration.lc.model.LoanAnalytics
import com.lattice.lib.integration.lc.model.LendingClubLoan
import com.lattice.lib.integration.lc.LendingClubConnection
import java.time.ZonedDateTime

/**
 * Implementation for LendingClub of the Market
 * Load marketplace analytics from db
 *
 * TODO implement
 * @author ze97286
 */
class LendingClubAnalytics(lc:LendingClubConnection,db: LendingClubDb) extends MarketplaceAnalytics {
  override val originator = Originator.LendingClub

  reload
  
  private def reload {
    val availableLoans = lc.availableLoans
    reconcileAvailableLoans(availableLoans.loans)
  }
  
   private[impl] def reconcileAvailableLoans(availableLoans: Seq[LendingClubLoan]) {
    log.info("reconciling available loans")
    val availableLoans = lc.availableLoans
    val future=db.persistLoans(availableLoans)
    
    future foreach (x=> {
      val futureLoanAnalytics: Future[LoanAnalytics] = calculateLoanAnalytics(availableLoans)
      futureLoanAnalytics map (db.persistAnalytics(_))
    })
    
    
  }
  
  private[impl] def calculateLoanAnalytics(loanListing: LoanListing): Future[LoanAnalytics] = {
    val numLoans: Int = loanListing.loans.size
    val liquidity: BigDecimal = loanListing.loans.sumBy[BigDecimal]( x => x.loanAmount - x.fundedAmount )
    val numLoansByGrade: Map[String, Int] = loanListing.loans.groupBy(_.grade).mapValues(_.size)
    val liquidityByGrade: Map[String, BigDecimal] = loanListing.loans.groupBy(_.grade).mapValues(_.map(lcl => lcl.loanAmount - lcl.fundedAmount).sum.toLong)

    val loanOrigination: Int = loanListing.loans.count(loan => loan.listD.toLocalDate == LocalDate.now())
    val loanOriginationByGrade: Map[String, Int] = loanListing.loans.filter(loan => loan.listD.toLocalDate == LocalDate.now()).groupBy(_.grade).mapValues(_.size)
    val loanOriginationByYield: Map[Double, Int] = loanListing.loans.filter(loan => loan.listD.toLocalDate == LocalDate.now()).groupBy(_.intRate).mapValues(_.size)

    val originatedNotional: BigDecimal =
      loanListing.loans
      .filter(loans => loans.listD.toLocalDate == LocalDate.now())
      .sumBy[BigDecimal]( x => x.loanAmount - x.fundedAmount )

    val originatedNotionalByGrade: Map[String, BigDecimal] =
      loanListing.loans
        .filter(loans => loans.listD.toLocalDate == LocalDate.now())
        .groupBy(_.grade)
        .mapValues( x => x.sumBy[BigDecimal]( x => x.loanAmount - x.fundedAmount) )

    val originatedNotionalByYield: Map[Double, BigDecimal] =
      loanListing.loans
        .filter(loans => loans.listD.toLocalDate == LocalDate.now())
        .groupBy(_.intRate)
        .mapValues( x => x.sumBy[BigDecimal]( x => x.loanAmount - x.fundedAmount) )

    val lendingClubMongoDb: LendingClubMongoDb = new LendingClubMongoDb(DbUtil.db)

    val yesterdayAnalytics: Future[LoanAnalytics] = lendingClubMongoDb.loadAnalyticsByDate(LocalDate.now().minusDays(1))

    yesterdayAnalytics.map{ analytics =>
        val dailyChangeInNumLoans: Int = numLoans - analytics.numLoans
        val dailyChangeInLiquidity: BigDecimal = liquidity - analytics.liquidity

        LoanAnalytics(
          ZonedDateTime.now(),
          numLoans,
          liquidity,
          numLoansByGrade,
          liquidityByGrade,
          dailyChangeInNumLoans,
          dailyChangeInLiquidity,
          loanOrigination,
          loanOriginationByGrade,
          loanOriginationByYield,
          originatedNotional,
          originatedNotionalByGrade,
          originatedNotionalByYield
        )
    }
  }
  
  
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