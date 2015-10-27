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

import com.lattice.lib.integration.lc.impl.LendingClubMongoDb
import com.lattice.lib.utils.DbUtil
import play.api.libs.json.{JsObject, Json}
import play.api.mvc._

import com.lattice.lib.integration.lc.model.Formatters.loanAnalyticsFormat
import play.api.libs.concurrent.Execution.Implicits.defaultContext


/**
 * Created by Julien Déray on 26/10/2015.
 */
class Dashboard extends Controller {

  def lendingClubAnalytics = Action.async {
    val lendingClubAnalytics = new LendingClubMongoDb(DbUtil.db).loadAnalyticsByDate( LocalDate.now() )
    lendingClubAnalytics.map(lc => Ok( Json.toJson(lc).as[JsObject]) )
  }
}
