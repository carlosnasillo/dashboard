/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import com.lattice.lib.integration.lc.impl.LendingClubAnalytics
import com.lattice.lib.portfolio.MarketPlaceFactory
import models.Originator
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc._

import com.lattice.lib.integration.lc.model.Formatters.mapGradeBigDecimalFormat

/**
 * Created by Julien Déray on 26/10/2015.
 */
class Dashboard extends Controller {

  private val analytics: LendingClubAnalytics = MarketPlaceFactory.analytics(Originator.LendingClub)

  def lendingClubAnalyticsNumLoans = Action.async {
    val numLoans = analytics.numLoans
    numLoans.map( nl => Ok( Json.toJson(nl) ) )
  }

  def lendingClubAnalyticsLiquidity = Action.async {
    val liquidity = analytics.liquidity
    liquidity.map( l => Ok( Json.toJson(l) ) )
  }

  def lendingClubAnalyticsLiquidityByGrade = Action.async {
    val liquidityByGrade = analytics.liquidityByGrade
    liquidityByGrade.map( lbg => Ok( Json.toJson(lbg) ) )
  }

  def lendingClubAnalyticsDailyChangeInNumLoans = Action.async {
    val dailyChangeInNumLoans = analytics.dailyChangeInNumLoans
    dailyChangeInNumLoans.map( dcinl => Ok( Json.toJson(dcinl) ) )
  }

  def lendingClubAnalyticsDailyChangeInLiquidity = Action.async {
    val dailyChangeInLiquidity = analytics.dailyChangeInLiquidity
    dailyChangeInLiquidity.map( dcil => Ok( Json.toJson(dcil) ) )
  }
}
