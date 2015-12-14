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

import controllers.Security.HasToken
import models.Rfq
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.iteratee.{Enumeratee, Concurrent, Iteratee}
import play.api.libs.json.{JsArray, JsObject, JsValue, Json}
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

// Todo : find a better way to not have the id for storage
class Rfqs extends Controller {

  val (outRfq, channelRfq) = Concurrent.broadcast[JsValue]

  def streamRfqToDealer(account: String) = WebSocket.using[JsValue] {
    request =>
      val in = Iteratee.ignore[JsValue]
      val dealerFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedDealers = (jsObj \ "dealers").getOrElse(JsArray()).as[List[String]]
        extractedDealers contains account
      })

      outRfq through dealerFilter
      (in, outRfq)
  }

  def streamRfqToClient(account: String) = WebSocket.using[JsValue] {
    request =>
      val in = Iteratee.ignore[JsValue]
      val clientFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedClient = (jsObj \ "client").getOrElse(JsArray()).as[List[String]]
        extractedClient.toString == account
      })

      outRfq through clientFilter
      (in, outRfq)
  }

  def submitRFQ = HasToken { implicit request =>
    implicit val RFQFormFormat = Json.format[Rfq]

    val rfqForm = Form(
      mapping (
        "id" -> ignored(UUID.randomUUID().toString),
        "timestamp" -> ignored(DateTime.now()),
        "durationInMonths" -> number,
        "client" -> nonEmptyText,
        "dealers" -> list(nonEmptyText),
        "creditEvents" -> list(nonEmptyText),
        "timeWindowInMinutes" -> number,
        "isValid" -> boolean,
        "cdsValue" -> bigDecimal,
        "loanId" -> nonEmptyText,
        "originator" -> nonEmptyText
      )(Rfq.apply)(Rfq.unapply)
    )

    rfqForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedRfq => {
        Rfq.store(submittedRfq)
        channelRfq push Json.toJson(submittedRfq)
        Ok
      }
    )
  }

  def getRFQWhenDealersContainsClient(client: String) = HasToken.async {
    Rfq.getTodaysRfqWhenDealersContainsClient(client).map( rfqs => Ok( Json.toJson(rfqs) ) )
  }

  def getRFQByClient(client: String) = HasToken.async {
    Rfq.getTodaysRfqByClient(client).map( rfqs => Ok( Json.toJson(rfqs) ) )
  }
}
