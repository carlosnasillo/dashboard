/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

package controllers

import com.lattice.lib.channels.Channels
import controllers.Security._
import models.Trade
import play.api.libs.iteratee.{Enumeratee, Iteratee}
import play.api.libs.json.{JsArray, JsValue, Json}
import play.api.mvc.{Controller, WebSocket}
import utils.Forms

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  *         Created on 13/12/2015
  */

class Trades extends Controller {

  def streamTrades(account: String) = WebSocket.using[JsValue] {
    request =>
      val in = Iteratee.ignore[JsValue]
      val clientAndDealerFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedDealer = (jsObj \ "dealer").getOrElse(JsArray()).as[String]
        val extractedClient = (jsObj \ "client").getOrElse(JsArray()).as[String]
        extractedClient == account || extractedDealer == account
      })

      (in, Channels.outTrades through clientAndDealerFilter)
  }

  def streamAnonymisedTrades = WebSocket.using[JsValue] {
    request =>
      val in = Iteratee.ignore[JsValue]
      (in, Channels.outTrades)
  }

  def submitTrade = HasToken { implicit request =>
    Forms.tradeForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedTrade => {
        Trade.store(submittedTrade)
        Channels.channelTrades push Json.toJson(submittedTrade)
        Ok
      }
    )
  }

  def getTradesByAccount(account: String) = HasToken.async {
    Trade.getTradesByAccount(account).map( trades => Ok( Json.toJson(trades) ) )
  }

  def getTodaysAnonymisedTrades = HasToken.async {
    Trade.getTodaysAnonymisedTrades.map( trades => Ok( Json.toJson(trades) ) )
  }
}