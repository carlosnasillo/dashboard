/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.lattice.lib.integration.lc.impl

import java.time.LocalDate

import com.lattice.lib.integration.lc.LendingClubDb
import com.lattice.lib.integration.lc.model.Formatters.{loanAnalyticsFormat, loanListingFormat}
import com.lattice.lib.integration.lc.model.{LoanAnalytics, LoanListing}
import play.api.Logger
import play.api.libs.json.{JsObject, Json}
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import play.modules.reactivemongo.json.JsObjectDocumentWriter
import play.modules.reactivemongo.json.collection.JSONCollectionProducer
import reactivemongo.api.DefaultDB

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
/**
 * TODO test
 * @author ze97286
 */

class LendingClubMongoDb(db: DefaultDB) extends LendingClubDb {

  override def persistLoans(availableLoans: LoanListing): Future[Unit] = {
    Logger.info(s"persisting available loans: $availableLoans")
    val loans = db.collection("loans")
    val loansJs = Json.toJson(availableLoans)
    loans.insert(loansJs.as[JsObject]) map (x => ())
  }

  override def availableLoans: Future[LoanListing] = {
    Logger.info(s"loading available loans from db")
    val loansTable = db.collection("loans")
    val query = Json.obj()
    val availableJsonFuture = loansTable.find(query).one[JsObject]
    availableJsonFuture.map(json => Json.fromJson[LoanListing](json.get).asOpt.get)
  }

  override def persistAnalytics(loanAnalytics: LoanAnalytics): Future[Unit] = {
    Logger.info(s"persisting analytics: $loanAnalytics")
    val loanAnalyticsCol = db.collection("loanAnalytics")
    loanAnalyticsCol.insert(Json.toJson(loanAnalytics).as[JsObject]).map(x => ())
  }

  override def loadAnalyticsByDate(date: LocalDate): Future[LoanAnalytics] = {
    Logger.info(s"loading analytics for date $date from db")
    val loansAnalytics = db.collection("loanAnalytics")
    val query = Json.obj("created_on" -> Json.obj("$gte" -> date, "$lt" -> date.plusDays(1)))
    loansAnalytics.find(query).sort(Json.obj("created_on" -> -1)).cursor[LoanAnalytics]().collect[List](Int.MaxValue).map(_.head)
  }
}