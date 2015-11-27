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

import com.lattice.lib.portfolio.{MarketplacePortfolioAnalytics, MarketPlaceFactory}
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

  def LCportfolioAnalytics = HasToken.async {
    lcPortfolio.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics => Ok( Json.toJson(portfolioAnalytics) ) )
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

  def currentBalance = HasToken {
    Ok( Json.toJson( lcPortfolio.accountBalance(Constants.portfolioName).availableCash ) )
  }

  def notesAcquiredTodayByGrade = HasToken.async {
    lcPortfolio.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics => Ok( Json.toJson(portfolioAnalytics.notesAcquiredTodayByGrade) ) )
  }

  def notesAcquiredTodayByYield = HasToken.async {
    lcPortfolio.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics => Ok( Json.toJson(portfolioAnalytics.notesAcquiredTodayByYield) ) )
  }

  def notesAcquiredTodayByPurpose = HasToken.async {
    lcPortfolio.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics => Ok( Json.toJson(portfolioAnalytics.notesAcquiredTodayByPurpose) ) )
  }

  def notesAcquiredThisYearByMonthByGrade = HasToken.async {
    lcPortfolio.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics =>{
      Ok( Json.toJson(
        portfolioAnalytics.notesAcquiredByGrade(LocalDate.now().minusYears(1), LocalDate.now())
          .groupBy(_._1.getMonthValue)
          .mapValues(_.values)
          .map { case(i, m) => (i, m reduce (_ ++ _)) }
      ))
    })
  }

  def notesAcquiredThisYearByMonthByYield = HasToken.async {
    lcPortfolio.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics =>{
      Ok( Json.toJson(
        portfolioAnalytics.notesAcquiredByYield(LocalDate.now().minusYears(1), LocalDate.now())
          .groupBy(_._1.getMonthValue)
          .mapValues(_.values)
          .map { case(i, m) => (i, m reduce (_ ++ _)) }
      ))
    })
  }

  def notesAcquiredThisYearByMonthByPurpose = HasToken.async {
    lcPortfolio.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics =>{
      Ok( Json.toJson(
        portfolioAnalytics.notesAcquiredByPurpose(LocalDate.now().minusYears(1), LocalDate.now())
          .groupBy(_._1.getMonthValue)
          .mapValues(_.values)
          .map { case(i, m) => (i, m reduce (_ ++ _)) }
      ))
    })
  }
}
