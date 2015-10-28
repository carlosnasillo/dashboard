/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.model

import models.Grade
import models.Grade.Grade
import models.Grade.Grade
import play.api.libs.json.Json.JsValueWrapper
import play.api.libs.json._

/**
 * @author ze97286
 */
object Formatters {
  implicit val orderFormat = Json.format[Order]
  implicit val ordersFormat = Json.format[Orders]
  implicit val orderConfirmationFormat = Json.format[OrderConfirmation]
  implicit val executionReportFormat = Json.format[ExecutionReport]
  implicit val noteFormat = Json.format[LendingClubNote]
  implicit val notesFormat = Json.format[OwnedNotes]
  implicit val orderPlacedFormat = Json.format[OrderPlaced]
  implicit val loanFormat = Json.format[LendingClubLoan]
  implicit val loanListingFormat = Json.format[LoanListing]
  implicit val accountSummaryFormat = Json.format[AccountSummary]
  implicit val portfolioDetailsFormat = Json.format[PortfolioDetails]
  implicit val myPortfoliosFormat = Json.format[InvestorPortfolios]
  implicit val errorFormat = Json.format[Error]
  implicit val errorsFormat = Json.format[Errors]
  implicit val withdrawResponseFormat = Json.format[WithdrawFundsResponse]
  implicit val transferReponseFormat = Json.format[TransferFundsResponse]

  def mapFormatFactory[A, B](strToA: String => A, strToB: String => B)(AtoKey: A => String, BtoValue: B => JsValueWrapper):  Format[Map[A, B]] = Format[Map[A, B]](
    new Reads[Map[A, B]] {
      def reads(jv: JsValue): JsResult[Map[A, B]] =
        JsSuccess(jv.as[Map[String, String]].map {
          case (k, v) =>
            strToA(k) -> strToB(v)
        })
    },
    new Writes[Map[A, B]] {
      def writes(map: Map[A, B]): JsValue =
        Json.obj(map.map {
          case (s, o) =>
            val ret: (String, JsValueWrapper) = AtoKey(s) -> BtoValue(o)
            ret
        }.toSeq: _*)
    }
  )

  implicit val mapDoubleBigDecimalFormat: Format[Map[Double, BigDecimal]] = mapFormatFactory[Double, BigDecimal](_.toDouble, BigDecimal(_))(_.toString, _.toString())
  implicit val mapDoubleIntFormat: Format[Map[Double, Int]] = mapFormatFactory[Double, Int](_.toDouble, _.toInt)(_.toString, _.toString)
  implicit val mapGradeBigDecimalFormat: Format[Map[Grade, BigDecimal]] = mapFormatFactory[Grade, BigDecimal](Grade.withName, BigDecimal(_))(_.toString, _.toInt)

  /**
   * Defines the formatter for LoanAnalytics
   * (better to be defined after the formatters needed)
   */
  implicit val loanAnalyticsFormat = Json.format[LoanAnalytics]
  implicit val transactionFormat = Json.format[Transaction]
}
