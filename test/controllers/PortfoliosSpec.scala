/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import java.time.LocalDate

import com.lattice.lib.integration.lc.impl.PortfolioAnalytics
import com.lattice.lib.portfolio.MarketplacePortfolioAnalytics
import models.{Grade, Term}
import org.scalatestplus.play._
import org.scalatest.concurrent.ScalaFutures

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 02/12/2015
  */
class PortfoliosSpec extends PlaySpec with ScalaFutures {

  "groupByMonthNumber" must {
    "convert months in there integer value" in {
      val inputMap = Map[LocalDate, Map[String, Int]](
        LocalDate.of(2000, 1, 1) -> Map("A" -> 1),
        LocalDate.of(2000, 2, 1) -> Map("B" -> 3),
        LocalDate.of(2000, 3, 1) -> Map("A" -> 2)
      )

      val res = Map[Int, Map[String, Int]] (
        1 -> Map("A" -> 1),
        2 -> Map("B" -> 3),
        3 -> Map("A" -> 2)
      )

      Portfolio.groupByMonthNumber[String](inputMap) mustBe res
    }
    "add together the grades in the maps from the same month" in {
      val inputMap = Map[LocalDate, Map[String, Int]](
        LocalDate.of(2000, 1, 1) -> Map("A" -> 1, "B" -> 2),
        LocalDate.of(2000, 1, 2) -> Map("A" -> 1, "B" -> 2),
        LocalDate.of(2000, 1, 3) -> Map("A" -> 1, "B" -> 2)
      )

      val res = Map[Int, Map[String, Int]] (
        1 -> Map("A" -> 3, "B" -> 6)
      )

      Portfolio.groupByMonthNumber[String](inputMap) mustBe res
    }
  }

  "mergePortfoliosAnalytics" must {
    "return a Future Map of PortfolioAnalytics by originator" in {
      val pa = PortfolioAnalytics(0, 0, 0, 0, 0, Map(Grade.A -> 0), Map("" -> 0), Map(0 -> null), Map("" -> Map(Grade.A -> 0)), Map(Grade.A -> BigDecimal(0)), Map((2d -> 2d) -> BigDecimal(0)), Map(Term._24 -> BigDecimal(0)), Map("" -> BigDecimal(0)), Map("" -> Map(Grade.A -> BigDecimal(0))), 0, Map(LocalDate.now -> Seq()))

      val mpaList: Seq[Future[MarketplacePortfolioAnalytics]] = Seq( Future{ pa } )

      whenReady(Portfolio.mergePortfoliosAnalytics( mpaList:_* )) { result =>
        result mustEqual Map( pa.originator.toString -> pa )
      }
    }
    "return an empty map if no argument is given" in {
      whenReady(Portfolio.mergePortfoliosAnalytics()) { result =>
        result mustEqual Map()
      }
    }
  }
}
