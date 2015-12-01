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

import com.lattice.lib.integration.lc.impl.PortfolioManagerImpl
import com.lattice.lib.portfolio.{MarketplacePortfolioManager, MarketplacePortfolioAnalytics, MarketPlaceFactory}
import controllers.Security.HasToken
import models.Originator
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc._
import play.api.libs.json.Json

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

  private val lcPortfolio = MarketPlaceFactory.portfolio(Originator.LendingClub)
  private val portfolios = Seq(lcPortfolio)

  private def originator(strOriginator: String): Option[MarketplacePortfolioManager] = strOriginator match {
    case "lendingClub" => Some(lcPortfolio)
    case "prosper"     => None
    case _             => None
  }

  def portfolioAnalytics(strOriginator: String) = HasToken.async {
    originator(strOriginator) map ( originator =>
      originator.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics =>
        Ok( Json.toJson(portfolioAnalytics) ) )
    ) orElse Some(Future.successful(BadRequest)) get
  }

  def allPortfolioAnalytics = HasToken.async {
    val portfolioAnalytics = portfolios.map(_.portfolioAnalytics(Constants.portfolioName))
    mergePortfoliosAnalytics( portfolioAnalytics: _* ).map( analytics => Ok( Json.toJson( analytics ) ) )
  }

  def totalCurrentBalance = HasToken {
    Ok( Json.toJson( portfolios.map(_.accountBalance(Constants.portfolioName).availableCash).sum ) )
  }

  private def mergePortfoliosAnalytics(portfoliosAnalytics: Future[MarketplacePortfolioAnalytics]*): Future[Map[String, MarketplacePortfolioAnalytics]] = {
    Future.sequence(portfoliosAnalytics).map( _.map(analytics => analytics.originator.toString -> analytics ).toMap )
  }

  def currentBalance(strOriginator: String) = HasToken {
    originator(strOriginator) map ( originator => Ok( Json.toJson( originator.accountBalance(Constants.portfolioName).availableCash ) ) ) orElse Some(BadRequest) get
  }

  def notesAcquiredTodayByGrade(strOriginator: String) = HasToken.async {
    originator(strOriginator) map ( originator =>
      originator.portfolioAnalytics(Constants.portfolioName).map( portfolio =>
        Ok( Json.toJson( portfolio.notesAcquiredTodayByGrade ) )
      )
    ) orElse Some(Future.successful(BadRequest)) get
  }

  def notesAcquiredTodayByYield(strOriginator: String) = HasToken.async {
    originator(strOriginator) map ( originator =>
      originator.portfolioAnalytics(Constants.portfolioName).map( portfolio =>
        Ok( Json.toJson( portfolio.notesAcquiredTodayByYield ) )
      )
    ) orElse Some(Future.successful(BadRequest)) get
  }

  def notesAcquiredTodayByPurpose(strOriginator: String) = HasToken.async {
    originator(strOriginator) map ( originator =>
      originator.portfolioAnalytics(Constants.portfolioName).map( portfolio =>
        Ok( Json.toJson( portfolio.notesAcquiredTodayByPurpose ) )
      )
    ) orElse Some(Future.successful(BadRequest)) get
  }

  def notesAcquiredThisYearByMonthByGrade(strOriginator: String) = HasToken.async {
    originator(strOriginator) map ( originator =>
          originator.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics =>
          Ok( Json.toJson(
            portfolioAnalytics.notesAcquiredByGrade(LocalDate.now().minusYears(1), LocalDate.now())
              .groupBy(_._1.getMonthValue)
              .mapValues(_.values)
              .map { case(i, m) => (i, m reduce (_ ++ _)) }
          ))
        )
      ) orElse Some(Future.successful(BadGateway)) get
  }

  def notesAcquiredThisYearByMonthByYield(strOriginator: String) = HasToken.async {
    originator(strOriginator) map ( originator =>
      originator.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics =>
          Ok( Json.toJson(
            portfolioAnalytics.notesAcquiredByYield(LocalDate.now().minusYears(1), LocalDate.now())
              .groupBy(_._1.getMonthValue)
              .mapValues(_.values)
              .map { case(i, m) => (i, m reduce (_ ++ _)) }
          ))
        )
    ) orElse Some(Future.successful(BadGateway)) get
  }

  def notesAcquiredThisYearByMonthByPurpose(strOriginator: String) = HasToken.async {
    originator(strOriginator) map ( originator =>
      originator.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics =>
          Ok( Json.toJson(
            portfolioAnalytics.notesAcquiredByPurpose(LocalDate.now().minusYears(1), LocalDate.now())
              .groupBy(_._1.getMonthValue)
              .mapValues(_.values)
              .map { case(i, m) => (i, m reduce (_ ++ _)) }
          ))
        )
    ) orElse Some(Future.successful(BadGateway)) get
  }
}
