/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.portfolio

import java.time.LocalDate

import models.Grade
import models.Originator
import models.Term

/**
 * Defines marketplace analytics for an investor portfolio
 *
 * @author ze97286
 */
trait MarketplacePortfolioAnalytics {
  def originator: Originator.Value

  // how much principal is invested in the market pending to be returned
  def principalOutstanding: BigDecimal

  // how much is invested in loans not yet originated
  def pendingInvestment: BigDecimal

  // how much cash has been received from loan repaid
  def cashReceived: BigDecimal

  // how much interest has been received on the investor account
  def interestReceived: BigDecimal

  // how many notes are owned by the investor by grade
  def notesByGrade: Map[Grade.Value, Int]

  // how many notes are owned by the investor by the note state
  def notesByState: Map[String, Int]

  // how many notes are owned by the intvestor by state, for each grouped by grade
  def notesByStateByGrade: Map[String, Map[Grade.Value, Int]]

  // how much principal is outstanding by grade
  def principalOutstandingByGrade: Map[Grade.Value, BigDecimal]

  // how much principal is outstanding by yield buckets
  def principalOutstandingByYield: Map[(Double, Double), BigDecimal]

  // how much principal is outstanding by term 
  def principalOutstandingByTerm: Map[Term.Value, BigDecimal]

  // how much principal is outstanding by note state
  def principalOutstandingByState: Map[String, BigDecimal]

  // how much principal is outstanding by state by grade
  def principalOutstandingByStateByGrade: Map[String, Map[Grade.Value, BigDecimal]]

  // how many active notes are owned by the investor
  def currentNotes: Int

  // how many notes were acquired today
  def notesAcquiredToday: Int

  // how many notes were acquired today by grade
  def notesAcquiredTodayByGrade: Map[Grade.Value, Int]

  // how many notes were acquired today by yield buckets
  def notesAcquiredTodayByYield: Map[(Double, Double), Int]

  // how many notes were acquired today by purpose 
  def notesAcquiredTodayByPurpose: Map[String, Int]

  // how many notes were acquired in the given period
  def notesAcquired(from: LocalDate, to: LocalDate):Map[LocalDate,Int] 

  // how many notes were acquired by the given period by Grade
  def notesAcquiredByGrade(from: LocalDate, to: LocalDate): Map[LocalDate, Map[Grade.Value, Int]]

  // how many notes were acquired by the given period by Yield
  def notesAcquiredByYield(from: LocalDate, to: LocalDate): Map[LocalDate, Map[(Double, Double), Int]]

  // how many notes were acquired by the given period by purpose
  def notesAcquiredByPurpose(from: LocalDate, to: LocalDate): Map[LocalDate, Map[String, Int]]

  // how much was invested in notes today
  def amountInvestedToday: BigDecimal

  // how much was invested in notes today by grade
  def amountInvestedTodayByGrade: Map[Grade.Value, BigDecimal]

  // how much was invested in notes today by yield buckets
  def amountInvestedTodayByYield: Map[(Double, Double), BigDecimal]

  // how much was invested in notes today by purpose 
  def amountInvestedTodayByPurpose: Map[String, BigDecimal]

  // how much was invested in notes in the given period
  def amountInvested(from: LocalDate, to: LocalDate):  Map[LocalDate,BigDecimal]

  // how much was invested in notes in the given period by grade 
  def amountInvestedByGrade(from: LocalDate, to: LocalDate): Map[LocalDate, Map[Grade.Value, BigDecimal]]

  // how much was invested in notes in the given period by yield buckets
  def amountInvestedByYield(from: LocalDate, to: LocalDate): Map[LocalDate, Map[(Double, Double), BigDecimal]]

  // how much was invested in notes in the given period by purpose
  def amountInvestedByPurpose(from: LocalDate, to: LocalDate): Map[LocalDate, Map[String, BigDecimal]]

}