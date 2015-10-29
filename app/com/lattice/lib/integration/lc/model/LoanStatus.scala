/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.model

/**
 * @author ze97286
 */
object LoanStatus extends Enumeration {
  val InReview=Value("In Review")
  val Expired=Value("Expired")
  val Removed=Value("Removed")
  val Withdrawn=Value("Withdrawn by Applicant")
  val InFunding=Value("In Funding")
  val Issuing=Value("Issuing")
  val Issued=Value("Issued")
  val NotYetIssued=Value("Not Yet Issued")
  val Current=Value("Current")
  val InGracePeriod=Value("In Grace Period")
  val Late16_30=Value("Late (16-30)")
  val Late31_120=Value("Late (31-120)")
  val FullyPaid=Value("Fully paid")
  val Default=Value("Default")
  val ChargedOff=Value("Charged Off")
  val PartiallyFunded=Value("Partially Funded")
  
  implicit def asString(value:LoanStatus.Value):String=value.toString
  
  private val pending=Set(InReview,InFunding,Issuing,NotYetIssued,PartiallyFunded)
  private val cancelled=Set(Expired, Withdrawn, Removed)
  private val issued=Set(Issued, Current, InGracePeriod,Late16_30,Late31_120,FullyPaid,Default,ChargedOff)
  
  def isPending(value: LoanStatus.Value) = pending.contains(value)
  def isCancelled(value: LoanStatus.Value) = cancelled.contains(value)
  def isIssued(value: LoanStatus.Value) = issued.contains(value)
}