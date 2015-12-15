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
import models.Quote
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.iteratee.{Concurrent, Enumeratee, Iteratee}
import play.api.libs.json.{JsArray, JsValue, Json}
import play.api.mvc._
import utils.Formatters.mapStringListQuote

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

class Quotes extends Controller {
  val (outQuotes, channelQuotes) = Concurrent.broadcast[JsValue]

  def streamQuotes(account: String) = WebSocket.using[JsValue] {
    request =>
      val in = Iteratee.ignore[JsValue]
      val accountFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedClient = (jsObj \ "client").getOrElse(JsArray()).as[String]
        extractedClient == account
      })

      outQuotes through accountFilter
      (in, outQuotes)
  }


  def submitQuote = HasToken { implicit request =>
    val quoteForm = Form(
      mapping (
        "id" -> ignored(UUID.randomUUID().toString),
        "rfqId" -> nonEmptyText,
        "timestamp" -> ignored(DateTime.now()),
        "premium" -> bigDecimal,
        "timeWindowInMinutes" -> number,
        "client" -> nonEmptyText,
        "dealer" -> nonEmptyText
      )(Quote.apply)(Quote.unapply)
    )

    quoteForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedQuote => { // todo : not working, don't know why, will be fixed by optimizing dates
//        val deadline = LocalDateTime.parse(submittedQuote.timestamp).plusMinutes(submittedQuote.timeWindowInMinutes)
//
//        if ( deadline.compareTo(LocalDateTime.now()) < 0 ) {
//          BadRequest("RFQ expired.")
//        }
//        else {
          Quote.store(submittedQuote)
        channelQuotes push Json.toJson(submittedQuote)
        Ok
//        }
      }
    )
  }

  def getQuoteWithClientByRfqId(account: String) = HasToken.async {
    Quote.getQuotesByClient(account).map( quotes => Ok( Json.toJson(quotes.groupBy(_.rfqId)) ) )
  }
}
