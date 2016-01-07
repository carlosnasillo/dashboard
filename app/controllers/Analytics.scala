/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

package controllers

import com.lattice.lib.integration.lc.impl.LendingClubAnalytics
import com.lattice.lib.portfolio.MarketPlaceFactory
import com.lattice.lib.integration.lc.model.Formatters.loanAnalyticsFormat
import controllers.Security.HasToken
import models.Originator
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc._

/**
 * Created by Julien Déray on 26/10/2015.
 */

class Analytics extends Controller {

  private val analytics: LendingClubAnalytics = MarketPlaceFactory.analytics(Originator.LendingClub)

  def lendingClubAnalytics = HasToken.async {
    analytics.wrappedAnalytics.map( loanAnalytics => Ok(Json.toJson(loanAnalytics)) )
  }
}
