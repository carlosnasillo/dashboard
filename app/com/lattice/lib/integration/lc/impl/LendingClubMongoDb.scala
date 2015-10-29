/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

package com.lattice.lib.integration.lc.impl

import java.time.LocalDate

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

import com.lattice.lib.integration.lc.LendingClubDb
import com.lattice.lib.integration.lc.model.Formatters.loanAnalyticsFormat
import com.lattice.lib.integration.lc.model.Formatters.loanListingFormat
import com.lattice.lib.integration.lc.model.Formatters.orderPlacedFormat
import com.lattice.lib.integration.lc.model.Formatters.transactionFormat
import com.lattice.lib.integration.lc.model.LoanAnalytics
import com.lattice.lib.integration.lc.model.LoanListing
import com.lattice.lib.integration.lc.model.OrderPlaced
import com.lattice.lib.integration.lc.model.Transaction

import play.api.Logger
import play.api.libs.json.JsObject
import play.api.libs.json.Json
import play.api.libs.json.Json.toJsFieldJsValueWrapper
import play.modules.reactivemongo.json.JsObjectDocumentWriter
import play.modules.reactivemongo.json.collection.JSONCollectionProducer
import reactivemongo.api.DefaultDB
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

  override def persistOrder(orderPlaced: OrderPlaced): Future[Unit] = {
    Logger.info(s"persisting order: $orderPlaced")
    val orders = db.collection("orders")
    val selector = Json.obj("investorId" -> orderPlaced.portfolioName, "orderId" -> orderPlaced.orderId)
    val modifier = Json.toJson(orderPlaced).as[JsObject]
    orders.update(selector, modifier, upsert = true) map (x => ())
  }

  override def persistAnalytics(loanAnalytics: LoanAnalytics): Future[Unit] = {
    Logger.info(s"persisting analytics: $loanAnalytics")
    val loanAnalyticsCol = db.collection("loanAnalytics")
    loanAnalyticsCol.insert(Json.toJson(loanAnalytics).as[JsObject]).map(x => ())
  }

  override def loadOrders: Future[Seq[OrderPlaced]] = {
    Logger.info(s"loading orders from db")
    val collection = db.collection("orders")
    val futureList = collection.find(Json.obj()).cursor[OrderPlaced].toList(Int.MaxValue)
    futureList
  }

  override def loadAnalyticsByDate(date: LocalDate): Future[LoanAnalytics] = {
    Logger.info(s"loading analytics for date $date from db")
    val loansAnalytics = db.collection("loanAnalytics")
    val query = Json.obj("created_on" -> Json.obj("$gte" -> date, "$lt" -> date.plusDays(1)))
    loansAnalytics.find(query).sort(Json.obj("created_on" -> -1)).cursor[LoanAnalytics].toList(Int.MaxValue).map(_.head)
  }

  override def loadTransactions: Future[Seq[Transaction]] = {
    Logger.info(s"loading transactions from db")
    val collection = db.collection("transactions")
    collection.find(Json.obj()).cursor[Transaction].toList(Int.MaxValue)
  }

  override def persistTransaction(transaction: Transaction): Future[Unit] = {
    Logger.info(s"persist transaction $transaction to db")
    val orders = db.collection("transactions")
    val transactionJs = Json.toJson(transaction).as[JsObject]
    orders.insert(transaction) map (x => ())
  }
}  