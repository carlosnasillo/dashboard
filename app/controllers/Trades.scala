/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import java.util.UUID

import controllers.Security._
import models.Trade
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.iteratee.{Concurrent, Enumeratee, Iteratee}
import play.api.libs.json.{JsArray, JsValue, Json}
import play.api.mvc.{Controller, WebSocket}

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  *         Created on 13/12/2015
  */

class Trades extends Controller {

  val (outTrades, channelTrades) = Concurrent.broadcast[JsValue]

  def streamTrades(account: String) = WebSocket.using[JsValue] {
    request =>
      val in = Iteratee.ignore[JsValue]
      val clientAndDealerFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedDealer = (jsObj \ "dealer").getOrElse(JsArray()).as[String]
        val extractedClient = (jsObj \ "client").getOrElse(JsArray()).as[String]
        extractedClient == account || extractedDealer == account
      })

      (in, outTrades through clientAndDealerFilter)
  }

  def submitTrade = HasToken { implicit request =>
    val tradeForm = Form(
      mapping (
        "id" -> ignored(UUID.randomUUID().toString),
        "rfqId" -> nonEmptyText,
        "quoteId" -> nonEmptyText,
        "timestamp" -> ignored(DateTime.now()),
        "durationInMonths" -> number,
        "client" -> nonEmptyText,
        "dealer" -> nonEmptyText,
        "creditEvents" -> list(nonEmptyText),
        "cdsValue" -> bigDecimal,
        "premium" -> bigDecimal,
        "referenceEntities" -> list(nonEmptyText)
      )(Trade.apply)(Trade.unapply)
    )

    tradeForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedTrade => {
        Trade.store(submittedTrade)
        channelTrades push Json.toJson(submittedTrade)
        Ok
      }
    )
  }

  def getTradesByAccount(account: String) = HasToken.async {
    Trade.getTradesByAccount(account).map( trades => Ok( Json.toJson(trades) ) )
  }
}