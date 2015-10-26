/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.model

import models.Term
import java.time.ZonedDateTime
import models.Grade
import models.Note

/**
 * @author ze97286
 */

case class LendingClubNote(
    loanId: Int,
    noteId: Int,
    orderId: Int,
    portfolioName: Option[String],
    interestRate: Double,
    loanLength: Int,
    loanStatus: String,
    grade: String,
    loanAmount: BigDecimal,
    noteAmount: BigDecimal,
    currentPaymentStatus: Option[String],
    paymentsReceived: BigDecimal,
    accruedInterest: BigDecimal,
    principalPending: BigDecimal,
    interestPending: BigDecimal,
    principalReceived: BigDecimal,
    interestReceived: BigDecimal,
    nextPaymentDate: Option[ZonedDateTime],
    issueDate: Option[ZonedDateTime],
    orderDate: ZonedDateTime,
    purpose: String,
    loanStatusDate: ZonedDateTime) {

  val gradeEnum = Grade.withName("" + grade.head)

  val loanLengthEnum = loanLength match {
    case 24 => Term._24
    case 36 => Term._36
    case 60 => Term._60
    case _  => throw new IllegalArgumentException("unsupported term")
  }
}

object LendingClubNote {
  implicit class ToNote(lcn: LendingClubNote) {
    def toNote: Note = Note(
      lcn.portfolioName.getOrElse(""),
      lcn.noteId.toString,
      lcn.orderId.toString,
      lcn.loanAmount,
      lcn.noteAmount,
      lcn.gradeEnum,
      lcn.interestRate,
      lcn.loanLengthEnum,
      lcn.loanStatus,
      lcn.paymentsReceived,
      lcn.issueDate,
      lcn.orderDate,
      lcn.purpose)
  }
}
