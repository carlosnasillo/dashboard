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
import play.api.libs.json._
import utils.Formatters._

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

  implicit val mapDoubleBigDecimalFormat: Format[Map[Double, BigDecimal]] = mapFormatFactory[Double, BigDecimal](_.toDouble, BigDecimal(_))(_.toString, _.toString())
  implicit val mapDoubleIntFormat: Format[Map[Double, Int]] = mapFormatFactory[Double, Int](_.toDouble, _.toInt)(_.toString, _.toString)
  implicit val mapIntLendingClubNote: Format[Map[Int, LendingClubNote]] = mapFormatFactory[Int, LendingClubNote](_.toInt, _.asInstanceOf[LendingClubNote])(_.toString, _.toString)
  implicit val mapDoubleDoubleBigDecimal: Format[Map[(Double, Double), BigDecimal]] = mapFormatFactory[(Double, Double), BigDecimal](_.split(";") match { case Array(x: String, y: String, _*) => (x.toDouble, y.toDouble) }, BigDecimal(_))({ case (x: Double, y: Double) => s"$x;$y"}, _.toString())
  implicit val mapDoubleDoubleInt: Format[Map[(Double, Double), Int]] = mapFormatFactory[(Double, Double), Int](_.split(";") match { case Array(x: String, y: String, _*) => (x.toDouble, y.toDouble) }, _.toInt)({ case (x: Double, y: Double) => s"$x;$y"}, _.toInt)
  implicit val mapLocalDateSeqLendingClubNote: Format[Map[LocalDate, Seq[LendingClubNote]]] = mapFormatFactory[LocalDate, Seq[LendingClubNote]](LocalDate.parse, _.asInstanceOf[Seq[LendingClubNote]])(_.toString, _.toString())
  implicit val mapIntMapDoubleDoubleIntFormat: Format[Map[Int,Map[(Double, Double),Int]]] = mapFormatFactory[Int,Map[(Double, Double),Int]](_.toInt, _.asInstanceOf[Map[(Double,Double),Int]])(_.toString, _.toString())
  implicit val mapIntMapStringIntFormat: Format[Map[Int,Map[String,Int]]] = mapFormatFactory[Int,Map[String,Int]](_.toInt, _.asInstanceOf[Map[String,Int]])(_.toString, _.toString())
  implicit val mapStringMarketplacePortfolioAnalytics: Format[Map[String, MarketplacePortfolioAnalytics]] = mapFormatFactory[String, MarketplacePortfolioAnalytics](_.toString, _.asInstanceOf[MarketplacePortfolioAnalytics])(_.toString, _.toString)

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
