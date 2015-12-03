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

import com.lattice.lib.integration.lc.impl.{PortfolioAnalytics, PortfolioManagerImpl}
import com.lattice.lib.portfolio.{MarketplacePortfolioManager, MarketplacePortfolioAnalytics, MarketPlaceFactory}
import controllers.Security.HasToken
import models.{Grade, Originator}
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc._
import play.api.libs.json.{Writes, Json}

import utils.Formatters.mapGradeIntFormat
import utils.Formatters.mapIntMapGradeValueIntFormat
import com.lattice.lib.integration.lc.model.Formatters.marketplacePortfolioAnalyticsFormat
import com.lattice.lib.integration.lc.model.Formatters.mapDoubleDoubleInt
import com.lattice.lib.integration.lc.model.Formatters.mapIntMapDoubleDoubleIntFormat
import com.lattice.lib.integration.lc.model.Formatters.mapIntMapStringIntFormat
import com.lattice.lib.integration.lc.model.Formatters.mapStringMarketplacePortfolioAnalytics

import utils.Constants

import scala.concurrent.Future

/**
 * @author : julienderay
 * Created on 02/11/2015
 */
class Portfolio extends Controller {

  private def extractFromPortfolio[T](strOriginator: String, f: MarketplacePortfolioAnalytics => T)(implicit tjs: Writes[T]): Future[Result] =
    Portfolio.originator(strOriginator) map (originator =>
      originator.portfolioAnalytics(Constants.portfolioName) map (portfolioAnalytics =>
        Ok( Json.toJson( f(portfolioAnalytics) ) )
      )
    ) orElse Some(Future.successful(BadRequest)) get

  def portfolioAnalytics(strOriginator: String) = HasToken.async {
    extractFromPortfolio[MarketplacePortfolioAnalytics](strOriginator, analytics => analytics)
  }

  def allPortfolioAnalytics = HasToken.async {
    val portfolioAnalytics = Portfolio.portfolios.map(_.portfolioAnalytics(Constants.portfolioName))
    Portfolio.mergePortfoliosAnalytics( portfolioAnalytics: _* ).map( analytics => Ok( Json.toJson( analytics ) ) )
  }

  def totalCurrentBalance = HasToken {
    Ok( Json.toJson( Portfolio.portfolios.map(_.accountBalance(Constants.portfolioName).availableCash).sum ) )
  }

  def currentBalance(strOriginator: String) = HasToken {
    Portfolio.originator(strOriginator) map ( originator => Ok( Json.toJson( originator.accountBalance(Constants.portfolioName).availableCash ) ) ) orElse Some(BadRequest) get
  }

  def notesAcquiredTodayByGrade(strOriginator: String) = HasToken.async {
    extractFromPortfolio[Map[Grade.Value, Int]](strOriginator, analytics => analytics.notesAcquiredTodayByGrade)
  }

  def notesAcquiredTodayByYield(strOriginator: String) = HasToken.async {
    extractFromPortfolio[Map[(Double, Double), Int]](strOriginator, analytics => analytics.notesAcquiredTodayByYield)
  }

  def notesAcquiredTodayByPurpose(strOriginator: String) = HasToken.async {
    extractFromPortfolio[Map[String, Int]](strOriginator, analytics => analytics.notesAcquiredTodayByPurpose)
  }

  def notesAcquiredThisYearByMonthByGrade(strOriginator: String) = HasToken.async {
    extractFromPortfolio[Map[Int, Map[Grade.Value, Int]]](strOriginator, analytics =>
      Portfolio.groupByMonthNumber[Grade.Value]( analytics.notesAcquiredByGrade(LocalDate.now().minusYears(1), LocalDate.now()) )
    )
  }

  def notesAcquiredThisYearByMonthByYield(strOriginator: String) = HasToken.async {
    extractFromPortfolio[Map[Int, Map[(Double, Double), Int]]](strOriginator, analytics =>
      Portfolio.groupByMonthNumber[(Double, Double)]( analytics.notesAcquiredByYield(LocalDate.now().minusYears(1), LocalDate.now()) )
    )
  }

  def notesAcquiredThisYearByMonthByPurpose(strOriginator: String) = HasToken.async {
    extractFromPortfolio[Map[Int, Map[String, Int]]](strOriginator, analytics =>
      Portfolio.groupByMonthNumber[String]( analytics.notesAcquiredByPurpose(LocalDate.now().minusYears(1), LocalDate.now()) )
    )
  }
}

object Portfolio {
  lazy val lcPortfolio = MarketPlaceFactory.portfolio(Originator.LendingClub)
  lazy val portfolios: Seq[MarketplacePortfolioManager] = Seq(lcPortfolio)

  private[controllers] def originator(strOriginator: String): Option[MarketplacePortfolioManager] = strOriginator match {
    case "lendingClub" => Some(lcPortfolio)
    case "prosper"     => None
    case _             => None
  }

  private[controllers] def groupByMonthNumber[A](map: Map[LocalDate, Map[A, Int]]): Map[Int, Map[A, Int]] =
    map
      .groupBy(_._1.getMonthValue)
      .mapValues( m => (Map[A, Int]() /: (for (m <- m.values; kv <- m) yield kv)) { (a, kv) =>
        a + (if (a.contains(kv._1)) kv._1 -> (a(kv._1) + kv._2) else kv)
      })

  private[controllers] def mergePortfoliosAnalytics(portfoliosAnalytics: Future[MarketplacePortfolioAnalytics]*): Future[Map[String, MarketplacePortfolioAnalytics]] = {
    Future.sequence(portfoliosAnalytics).map( _.map(analytics => analytics.originator.toString -> analytics ).toMap )
  }
}