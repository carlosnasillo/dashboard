/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.impl

import java.time.LocalDate

import scala.math.BigDecimal.int2bigDecimal

import com.lattice.lib.integration.lc.model.LendingClubNote
import com.lattice.lib.portfolio.MarketplacePortfolioAnalytics

import models.Grade
import models.Originator
import models.Term

/**
 * @author ze97286
 */

object PortfolioAnalytics {
  val InterestRateBuckets = Seq((6d, 8.99d), (9d, 11.99d), (12d, 14.99d), (15d, 17.99d), (18d, 22.99d), (23d, 99d))

  private[impl] def notesCache(notes: Seq[LendingClubNote]) = (notes map (x => (x.noteId -> x))).toMap
  private[impl] def notesByDate(notes: Seq[LendingClubNote]) = notes groupBy (_.orderDate.toLocalDate)
  private[impl] def principalOutstanding(notes: Seq[LendingClubNote]) = notes.map(_.principalPending).sum
  private[impl] def cashReceived(notes: Seq[LendingClubNote]) = notes.map(_.principalReceived).sum
  private[impl] def interestReceived(notes: Seq[LendingClubNote]) = notes.map(_.interestReceived).sum
  private[impl] def notesByGrade(notes: Seq[LendingClubNote]) = notes.groupBy(_.gradeEnum) map { case (key, value) => (key, value.size) }
  private[impl] def notesByState(notes: Seq[LendingClubNote]) = notes.groupBy(_.loanStatus) map { case (key, value) => (key, value.size) }
  private[impl] def notesByStateByGrade(notes: Seq[LendingClubNote]) = notes.groupBy(_.loanStatus) map { case (key, value) => (key -> (value.groupBy(_.gradeEnum) map { case (k, v) => (k -> v.size) })) }
  private[impl] def principalOutstandingByGrade(notes: Seq[LendingClubNote]) = notes.groupBy(_.gradeEnum) map { case (key, value) => (key, value.map(_.principalPending).sum) }
  private[impl] def principalOutstandingByYield(notes: Seq[LendingClubNote]) = (InterestRateBuckets map { case (lower, upper) => (lower, upper) -> (notes.collect { case x if x.interestRate >= lower && x.interestRate <= upper => x.principalPending } reduceLeft (_ + _)) }).toMap
  private[impl] def principalOutstandingByTerm(notes: Seq[LendingClubNote]) = notes.groupBy(_.loanLengthEnum) map { case (key, value) => (key, (value.map(_.principalPending).sum)) }
  private[impl] def principalOutstandingByState(notes: Seq[LendingClubNote]) = notes.groupBy(_.loanStatus) map { case (key, value) => (key, (value.map(_.principalPending).sum)) }
  private[impl] def principalOutstandingByStateByGrade(notes: Seq[LendingClubNote]) = notes.groupBy(_.loanStatus) map { case (key, value) => (key, (value groupBy (_.gradeEnum) map { case (k, v) => (k -> (v.map(_.principalPending).sum)) })) }
  private[impl] def currentNotes(notes: Seq[LendingClubNote]) = notes.filter(x => x.principalPending > 0).size
  private[impl] def pendingInvestment(notes: Seq[LendingClubNote]) = notes.collect { case x if x.loanStatus == "In Funding" => x.noteAmount }.sum

  def analyse(notes: Seq[LendingClubNote]): PortfolioAnalytics = {
    PortfolioAnalytics(principalOutstanding(notes),
      pendingInvestment(notes),
      cashReceived(notes),
      interestReceived(notes),
      notesByGrade(notes),
      notesByState(notes),
      notesCache(notes),
      notesByStateByGrade(notes),
      principalOutstandingByGrade(notes),
      principalOutstandingByYield(notes),
      principalOutstandingByTerm(notes),
      principalOutstandingByState(notes),
      principalOutstandingByStateByGrade(notes),
      currentNotes(notes),
      notesByDate(notes))
  }

  private[impl] def notesForRange(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, Seq[LendingClubNote]] = notesByDate filter { case (date, _) => !date.isBefore(from) && !date.isAfter(to) }

  private[impl] def notesAcquiredToday(notesByDate: Map[LocalDate, Seq[LendingClubNote]]) = notesAcquired(notesByDate, LocalDate.now, LocalDate.now)(LocalDate.now)
  private[impl] def notesAcquiredTodayByGrade(notesByDate: Map[LocalDate, Seq[LendingClubNote]]) = notesAcquiredByGrade(notesByDate, LocalDate.now, LocalDate.now)(LocalDate.now)
  private[impl] def notesAcquiredTodayByYield(notesByDate: Map[LocalDate, Seq[LendingClubNote]]) = notesAcquiredByYield(notesByDate, LocalDate.now, LocalDate.now)(LocalDate.now)
  private[impl] def notesAcquiredTodayByPurpose(notesByDate: Map[LocalDate, Seq[LendingClubNote]]) = notesAcquiredByPurpose(notesByDate, LocalDate.now, LocalDate.now)(LocalDate.now)
  private[impl] def notesAcquired(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, Int] = notesForRange(notesByDate, from, to) map { case (k, v) => k -> v.size }
  private[impl] def notesAcquiredByGrade(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, Map[Grade.Value, Int]] = notesForRange(notesByDate, from, to) map { case (k, v) => k -> (v groupBy (_.gradeEnum) map { case (k1, v1) => k1 -> v1.size }) }
  private[impl] def notesAcquiredByYield(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, Map[(Double, Double), Int]] = {
    notesForRange(notesByDate, from, to) map { case (k, v) => k -> (InterestRateBuckets map { case (lower, upper) => (lower, upper) -> (v.collect { case x if x.interestRate >= lower && x.interestRate <= upper => x }).size }).toMap }
  }
  private[impl] def notesAcquiredByPurpose(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, Map[String, Int]] = notesForRange(notesByDate, from, to) map { case (k, v) => k -> (v groupBy (_.purpose) map { case (k1, v1) => k1 -> v1.size }) }
  private[impl] def amountInvestedToday(notesByDate: Map[LocalDate, Seq[LendingClubNote]]) = amountInvested(notesByDate, LocalDate.now, LocalDate.now)(LocalDate.now)
  private[impl] def amountInvestedTodayByGrade(notesByDate: Map[LocalDate, Seq[LendingClubNote]]) = amountInvestedByGrade(notesByDate, LocalDate.now, LocalDate.now)(LocalDate.now)
  private[impl] def amountInvestedTodayByYield(notesByDate: Map[LocalDate, Seq[LendingClubNote]]) = amountInvestedByYield(notesByDate, LocalDate.now, LocalDate.now)(LocalDate.now)
  private[impl] def amountInvestedTodayByPurpose(notesByDate: Map[LocalDate, Seq[LendingClubNote]]) = amountInvestedByPurpose(notesByDate, LocalDate.now, LocalDate.now)(LocalDate.now)
  private[impl] def amountInvested(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, BigDecimal] = notesForRange(notesByDate, from, to) map { case (k, v) => k -> (v map (_.principalPending) sum) }
  private[impl] def amountInvestedByGrade(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, Map[Grade.Value, BigDecimal]] = notesForRange(notesByDate, from, to) map { case (k, v) => k -> (v groupBy (_.gradeEnum) map { case (k1, v1) => k1 -> (v1 map (_.principalPending)).sum }) }
  private[impl] def amountInvestedByYield(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, Map[(Double, Double), BigDecimal]] = {
    notesForRange(notesByDate, from, to) map { case (k, v) => k -> (InterestRateBuckets map { case (lower, upper) => (lower, upper) -> (v.collect { case x if x.interestRate >= lower && x.interestRate <= upper => x.principalPending }).sum }).toMap }
  }
  private[impl] def amountInvestedByPurpose(notesByDate: Map[LocalDate, Seq[LendingClubNote]], from: LocalDate, to: LocalDate): Map[LocalDate, Map[String, BigDecimal]] = notesForRange(notesByDate, from, to) map { case (k, v) => k -> (v groupBy (_.purpose) map { case (k1, v1) => k1 -> (v1 map (_.principalPending)).sum }) }

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
    notesByDate: Map[LocalDate, Seq[LendingClubNote]]) extends MarketplacePortfolioAnalytics {

  override val originator = Originator.LendingClub
  
  override def notesAcquiredToday = PortfolioAnalytics.notesAcquiredToday(notesByDate)
  override def notesAcquiredTodayByGrade = PortfolioAnalytics.notesAcquiredTodayByGrade(notesByDate)
  override def notesAcquiredTodayByYield = PortfolioAnalytics.notesAcquiredTodayByYield(notesByDate)
  override def notesAcquiredTodayByPurpose = PortfolioAnalytics.notesAcquiredTodayByPurpose(notesByDate)
  override def notesAcquired(from: LocalDate, to: LocalDate): Map[LocalDate, Int] = PortfolioAnalytics.notesAcquired(notesByDate, from, to)
  override def notesAcquiredByGrade(from: LocalDate, to: LocalDate): Map[LocalDate, Map[Grade.Value, Int]] = PortfolioAnalytics.notesAcquiredByGrade(notesByDate, from, to)
  override def notesAcquiredByYield(from: LocalDate, to: LocalDate): Map[LocalDate, Map[(Double, Double), Int]] = PortfolioAnalytics.notesAcquiredByYield(notesByDate, from, to)
  override def notesAcquiredByPurpose(from: LocalDate, to: LocalDate): Map[LocalDate, Map[String, Int]] = PortfolioAnalytics.notesAcquiredByPurpose(notesByDate, from, to)
  override def amountInvestedToday = PortfolioAnalytics.amountInvestedToday(notesByDate)
  override def amountInvestedTodayByGrade = PortfolioAnalytics.amountInvestedTodayByGrade(notesByDate)
  override def amountInvestedTodayByYield = PortfolioAnalytics.amountInvestedTodayByYield(notesByDate)
  override def amountInvestedTodayByPurpose = PortfolioAnalytics.amountInvestedTodayByPurpose(notesByDate)
  override def amountInvested(from: LocalDate, to: LocalDate): Map[LocalDate, BigDecimal] = PortfolioAnalytics.amountInvested(notesByDate, from, to)
  override def amountInvestedByGrade(from: LocalDate, to: LocalDate): Map[LocalDate, Map[Grade.Value, BigDecimal]] = PortfolioAnalytics.amountInvestedByGrade(notesByDate, from, to)
  override def amountInvestedByYield(from: LocalDate, to: LocalDate): Map[LocalDate, Map[(Double, Double), BigDecimal]] = PortfolioAnalytics.amountInvestedByYield(notesByDate, from, to)
  override def amountInvestedByPurpose(from: LocalDate, to: LocalDate): Map[LocalDate, Map[String, BigDecimal]] = PortfolioAnalytics.amountInvestedByPurpose(notesByDate, from, to)
}