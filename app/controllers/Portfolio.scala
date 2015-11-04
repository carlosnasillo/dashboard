/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import com.lattice.lib.portfolio.MarketPlaceFactory
import models.Originator
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.mvc._
import play.api.libs.json.Json

import com.lattice.lib.integration.lc.model.Formatters.marketplacePortfolioAnalyticsFormat
import utils.Constants

/**
 * @author : julienderay
 * Created on 02/11/2015
 */
class Portfolio extends Controller {

  private val portfolio = MarketPlaceFactory.portfolio(Originator.LendingClub)

  def portfolioAnalytics = Action.async {
    portfolio.portfolioAnalytics(Constants.portfolioName).map(portfolioAnalytics => Ok( Json.toJson(portfolioAnalytics) ) )
  }
}
