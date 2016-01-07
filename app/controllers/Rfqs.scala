/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

package controllers

import com.lattice.lib.autoquoter.AutoQuoter
import com.lattice.lib.channels.Channels
import controllers.Security.HasToken
import models.{Quote, Rfq}
import play.api.libs.iteratee.Enumeratee
import play.api.libs.json.{JsArray, JsValue, Json}
import play.api.mvc._
import utils.{Constants, Forms}

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

// Todo : find a better way to not have the id for storage
class Rfqs extends Controller {

  implicit val RFQFormFormat = Json.format[Rfq]

  def streamRfqToDealer(account: String) = WebSocket.using[JsValue] {
    request =>
      val dealerFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedDealers = (jsObj \ "dealers").getOrElse(JsArray()).as[List[String]]
        extractedDealers contains account
      })

      (Channels.ignoredIn, Channels.outRfq through dealerFilter)
  }

  def streamRfqToClient(account: String) = WebSocket.using[JsValue] {
    request =>
      val clientFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedClient = (jsObj \ "client").getOrElse(JsArray()).as[List[String]]
        extractedClient.toString == account
      })

      (Channels.ignoredIn, Channels.outRfq through clientFilter)
  }

  def submitRFQ = HasToken { implicit request =>
    Forms.rfqForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedRfq => {
        Rfq.store(submittedRfq)
        Channels.channelRfq push Json.toJson(submittedRfq)
        if (submittedRfq.dealers.contains(Constants.automaticDealerAccount)) {
          val quote = AutoQuoter.generateQuote(submittedRfq)
          Channels.channelQuotes push Json.toJson(quote)
          Quote.store(quote)
        }
        Ok
      }
    )
  }

  def getRFQWhenDealersContainsAccount(account: String) = HasToken.async {
    Rfq.getTodaysRfqWhenDealersContainsAccount(account).map( rfqs => Ok( Json.toJson(rfqs) ) )
  }

  def getRFQByClient(client: String) = HasToken.async {
    Rfq.getTodaysRfqByClient(client).map( rfqs => Ok( Json.toJson(rfqs) ) )
  }

  def getRFQById(id: String) = HasToken.async {
    Rfq.getById(id).map( rfq => Ok( Json.toJson(rfq) ) )
  }
}
