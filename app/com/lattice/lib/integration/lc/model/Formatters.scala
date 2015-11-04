/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc.model

import java.time.LocalDate

import com.lattice.lib.integration.lc.impl.PortfolioAnalytics
import com.lattice.lib.portfolio.MarketplacePortfolioAnalytics
import models.Grade.Grade
import models.{Grade, Term}
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
  implicit val mapGradeIntFormat: Format[Map[Grade.Value, Int]] = mapFormatFactory[Grade.Value, Int](Grade.withName, _.toInt)(_.toString, _.toInt)
  implicit val mapIntLendingClubNote: Format[Map[Int, LendingClubNote]] = mapFormatFactory[Int, LendingClubNote](_.toInt, _.asInstanceOf[LendingClubNote])(_.toString, _.toString)
  implicit val mapDoubleDoubleBigDecimal: Format[Map[(Double, Double), BigDecimal]] = mapFormatFactory[(Double, Double), BigDecimal](_.split(";") match { case Array(x: String, y: String, _*) => (x.toDouble, y.toDouble) }, BigDecimal(_))({ case (x: Double, y: Double) => s"$x;$y"}, _.toString())
  implicit val mapDoubleDoubleInt: Format[Map[(Double, Double), Int]] = mapFormatFactory[(Double, Double), Int](_.split(";") match { case Array(x: String, y: String, _*) => (x.toDouble, y.toDouble) }, _.toInt)({ case (x: Double, y: Double) => s"$x;$y"}, _.toInt)
  implicit val mapTermBigDecimal: Format[Map[Term.Value, BigDecimal]] = mapFormatFactory[Term.Value, BigDecimal](Term.withName, BigDecimal(_))(_.toString, _.toString())
  implicit val mapLocalDateSeqLendingClubNote: Format[Map[LocalDate, Seq[LendingClubNote]]] = mapFormatFactory[LocalDate, Seq[LendingClubNote]](LocalDate.parse, _.asInstanceOf[Seq[LendingClubNote]])(_.toString, _.toString())

  /**
   * Defines the formatter for LoanAnalytics
   * (better to be defined after the formatters needed)
   */
  implicit val loanAnalyticsFormat = Json.format[LoanAnalytics]
  implicit val transactionFormat = Json.format[Transaction]

  implicit val portfolioAnalyticsFormat = Json.format[PortfolioAnalytics]

  implicit val marketplacePortfolioAnalyticsFormat = Format[MarketplacePortfolioAnalytics] (
    Reads[MarketplacePortfolioAnalytics] {
     case portfolioAnalytics: PortfolioAnalytics => Json.reads[PortfolioAnalytics].reads(portfolioAnalytics)
    },
    Writes[MarketplacePortfolioAnalytics] {
     case portfolioAnalytics: PortfolioAnalytics => Json.writes[PortfolioAnalytics].writes(portfolioAnalytics)
    }
  )
}
