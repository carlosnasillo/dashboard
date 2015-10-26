/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.impl

import PortfolioAnalytics._
import models.Grade
import models.Term
import java.time.LocalDate
import com.lattice.lib.portfolio._
import models.Originator
import com.lattice.lib.integration.lc.model.LendingClubNote

/**
 * @author ze97286
 */

object PortfolioAnalytics {
  val InterestRateBuckets = Seq((6d, 8.99d), (9d, 11.99d), (12d, 14.99d), (15d, 17.99d), (18d, 22.99d), (23d, 99d))
  
  def analyse(notes: Seq[LendingClubNote]): PortfolioAnalytics = {
    val notesCache = (notes map (x => (x.noteId -> x))).toMap
    val notesByDate = notes groupBy (_.orderDate.toLocalDate)

    val principalOutstanding = notes.map(_.principalPending).sum
    val cashReceived = notes.map(_.principalReceived).sum
    val interestReceived = notes.map(_.interestReceived).sum
    val notesByGrade = notes.groupBy(_.gradeEnum) map { case (key, value) => (key, value.size) }
    val notesByState = notes.groupBy(_.loanStatus) map { case (key, value) => (key, value.size) }
    val notesByStateByGrade = notes.groupBy(_.loanStatus) map { case (key, value) => (key -> (value.groupBy(_.gradeEnum) map { case (k, v) => (k -> v.size) })) }
    val principalOutstandingByGrade = notes.groupBy(_.gradeEnum) map { case (key, value) => (key, value.map(_.principalPending).sum) }
    val principalOutstandingByYield = (InterestRateBuckets map { case (lower, upper) => (lower, upper) -> (notes.collect { case x if x.interestRate >= lower && x.interestRate <= upper => x.principalPending } reduceLeft (_ + _)) }).toMap
    val principalOutstandingByTerm = notes.groupBy(_.loanLengthEnum) map { case (key, value) => (key, (value.map(_.principalPending).sum)) }
    val principalOutstandingByState = notes.groupBy(_.loanStatus) map { case (key, value) => (key, (value.map(_.principalPending).sum)) }
    val principalOutstandingByStateByGrade = notes.groupBy(_.loanStatus) map { case (key, value) => (key, (value groupBy (_.gradeEnum) map { case (k, v) => (k -> (v.map(_.principalPending).sum)) })) }
    val currentNotes = notes.filter(x => x.principalPending > 0).size
    val pendingInvestment = notes.collect {case x if x.loanStatus == "In Funding" => x.noteAmount}.sum
    
    
    PortfolioAnalytics(principalOutstanding,
        pendingInvestment,
      cashReceived,
      interestReceived,
      notesByGrade,
      notesByState,
      notesCache,
      notesByStateByGrade,
      principalOutstandingByGrade,
      principalOutstandingByYield,
      principalOutstandingByTerm,
      principalOutstandingByState,
      principalOutstandingByStateByGrade,
      currentNotes: Int,
      notesByDate)
  }
}

case class PortfolioAnalytics(
    override val principalOutstanding: BigDecimal,
    override val pendingInvestment: BigDecimal,
    override val cashReceived: BigDecimal,
    override val interestReceived: BigDecimal,
    override val notesByGrade: Map[Grade.Value, Int],
    override val notesByState: Map[String, Int],
    notesCache: Map[Int, LendingClubNote],
    override val notesByStateByGrade: Map[String, Map[Grade.Value, Int]],
    override val principalOutstandingByGrade: Map[Grade.Value, BigDecimal],
    override val principalOutstandingByYield: Map[(Double, Double), BigDecimal],
    override val principalOutstandingByTerm: Map[Term.Value, BigDecimal],
    override val principalOutstandingByState: Map[String, BigDecimal],
    override val principalOutstandingByStateByGrade: Map[String, Map[Grade.Value, BigDecimal]],
    override val currentNotes: Int,
    notesByDate: Map[LocalDate, Seq[LendingClubNote]])  extends MarketplacePortfolioAnalytics {

  override val originator=Originator.LendingClub
  
  def notesForRange(from: LocalDate, to: LocalDate): Map[LocalDate, Seq[LendingClubNote]] = notesByDate filter { case (date, _) => !date.isBefore(from) && !date.isAfter(to) }

  override def notesAcquiredToday=notesAcquired(LocalDate.now,LocalDate.now)(LocalDate.now)
  override def notesAcquiredTodayByGrade=notesAcquiredByGrade(LocalDate.now,LocalDate.now)(LocalDate.now)
  override def notesAcquiredTodayByYield=notesAcquiredByYield(LocalDate.now,LocalDate.now)(LocalDate.now)
  override def notesAcquiredTodayByPurpose=notesAcquiredByPurpose(LocalDate.now,LocalDate.now)(LocalDate.now)
  override def notesAcquired(from: LocalDate, to: LocalDate): Map[LocalDate, Int] = notesForRange(from, to) map { case (k, v) => k -> v.size }
  override def notesAcquiredByGrade(from: LocalDate, to: LocalDate): Map[LocalDate, Map[Grade.Value, Int]] = notesForRange(from, to) map { case (k, v) => k -> (v groupBy (_.gradeEnum) map { case (k1, v1) => k1 -> v1.size }) }
  override def notesAcquiredByYield(from: LocalDate, to: LocalDate): Map[LocalDate, Map[(Double, Double), Int]] = {
    notesForRange(from, to) map { case (k, v) => k -> (InterestRateBuckets map { case (lower, upper) => (lower, upper) -> (v.collect { case x if x.interestRate >= lower && x.interestRate <= upper => x }).size }).toMap }
  }
  override def notesAcquiredByPurpose(from: LocalDate, to: LocalDate): Map[LocalDate, Map[String, Int]] = notesForRange(from, to) map { case (k, v) => k -> (v groupBy (_.purpose) map { case (k1, v1) => k1 -> v1.size }) }
  override def amountInvestedToday = amountInvested(LocalDate.now,LocalDate.now)(LocalDate.now)
  override def amountInvestedTodayByGrade= amountInvestedByGrade(LocalDate.now,LocalDate.now)(LocalDate.now)
  override def amountInvestedTodayByYield = amountInvestedByYield(LocalDate.now,LocalDate.now)(LocalDate.now)
  override def amountInvestedTodayByPurpose = amountInvestedByPurpose(LocalDate.now,LocalDate.now)(LocalDate.now)
  override def amountInvested(from: LocalDate, to: LocalDate): Map[LocalDate, BigDecimal] = notesForRange(from, to) map { case (k, v) => k -> (v map (_.principalPending) sum) }
  override def amountInvestedByGrade(from: LocalDate, to: LocalDate): Map[LocalDate, Map[Grade.Value, BigDecimal]] = notesForRange(from, to) map { case (k, v) => k -> (v groupBy (_.gradeEnum) map { case (k1, v1) => k1 -> (v1 map (_.principalPending)).sum }) }
  override def amountInvestedByYield(from: LocalDate, to: LocalDate): Map[LocalDate, Map[(Double, Double), BigDecimal]] = {
    notesForRange(from, to) map { case (k, v) => k -> (InterestRateBuckets map { case (lower, upper) => (lower, upper) -> (v.collect { case x if x.interestRate >= lower && x.interestRate <= upper => x.principalPending}).sum  }).toMap }
  }
  override def amountInvestedByPurpose(from: LocalDate, to: LocalDate): Map[LocalDate, Map[String, BigDecimal]] = notesForRange(from, to) map { case (k, v) => k -> (v groupBy (_.purpose) map { case (k1, v1) => k1 -> (v1 map (_.principalPending)).sum }) }
}