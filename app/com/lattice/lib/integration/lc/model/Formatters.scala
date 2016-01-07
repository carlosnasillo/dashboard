/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */
package com.lattice.lib.integration.lc.model

import play.api.libs.json._
import utils.Formatters._

/**
 * @author ze97286
 */
object Formatters {
  implicit val loanFormat = Json.format[LendingClubLoan]
  implicit val loanListingFormat = Json.format[LoanListing]

  implicit val mapDoubleBigDecimalFormat: Format[Map[Double, BigDecimal]] = mapFormatFactory[Double, BigDecimal](_.toDouble, BigDecimal(_))(_.toString, _.toString())
  implicit val mapDoubleIntFormat: Format[Map[Double, Int]] = mapFormatFactory[Double, Int](_.toDouble, _.toInt)(_.toString, _.toString)
  implicit val mapDoubleDoubleBigDecimal: Format[Map[(Double, Double), BigDecimal]] = mapFormatFactory[(Double, Double), BigDecimal](_.split(";") match { case Array(x: String, y: String, _*) => (x.toDouble, y.toDouble) }, BigDecimal(_))({ case (x: Double, y: Double) => s"$x;$y"}, _.toString())
  implicit val mapDoubleDoubleInt: Format[Map[(Double, Double), Int]] = mapFormatFactory[(Double, Double), Int](_.split(";") match { case Array(x: String, y: String, _*) => (x.toDouble, y.toDouble) }, _.toInt)({ case (x: Double, y: Double) => s"$x;$y"}, _.toInt)
  implicit val mapIntMapDoubleDoubleIntFormat: Format[Map[Int,Map[(Double, Double),Int]]] = mapFormatFactory[Int,Map[(Double, Double),Int]](_.toInt, _.asInstanceOf[Map[(Double,Double),Int]])(_.toString, _.toString())
  implicit val mapIntMapStringIntFormat: Format[Map[Int,Map[String,Int]]] = mapFormatFactory[Int,Map[String,Int]](_.toInt, _.asInstanceOf[Map[String,Int]])(_.toString, _.toString())

  /**
   * Defines the formatter for LoanAnalytics
   * (better to be defined after the formatters needed)
   */
  implicit val loanAnalyticsFormat = Json.format[LoanAnalytics]
}
