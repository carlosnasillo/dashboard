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

import com.lattice.lib.channels.Channels
import controllers.Security.HasToken
import models.{QuoteState, Quote}
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.{Constraint, Valid, Invalid}
import play.api.libs.iteratee.{Concurrent, Enumeratee, Iteratee}
import play.api.libs.json.{JsArray, JsValue, Json}
import play.api.mvc._
import utils.Formatters.mapStringListQuote

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Success, Failure}

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

class Quotes extends Controller {

  def streamQuotesToClient(account: String) = WebSocket.using[JsValue] {
    request =>
      val accountFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedClient = (jsObj \ "client").getOrElse(JsArray()).as[String]
        extractedClient == account
      })

      (Channels.ignoredIn, Channels.outQuotes through accountFilter)
  }

  def streamQuotesToDealer(account: String) = WebSocket.using[JsValue] {
    request =>
      val accountFilter = Enumeratee.filter[JsValue](jsObj => {
        val extractedDealer = (jsObj \ "dealer").getOrElse(JsArray()).as[String]
        extractedDealer == account
      })

      (Channels.ignoredIn, Channels.outQuotes through accountFilter)
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
        "dealer" -> nonEmptyText,
        "referenceEntities" -> set(nonEmptyText),
        "state" -> ignored(QuoteState.Outstanding)
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
        Channels.channelQuotes push Json.toJson(submittedQuote)
        Ok
//        }
      }
    )
  }

  def getQuoteByClientGroupByRfqId(account: String) = HasToken.async {
    Quote.getQuotesByClient(account).map( quotes => Ok( Json.toJson(quotes.groupBy(_.rfqId)) ) )
  }

  def getQuoteByDealerGroupByRfqId(account: String) = HasToken.async {
    Quote.getQuotesByDealer(account).map( quotes => Ok( Json.toJson(quotes.groupBy(_.rfqId)) ) )
  }

  def setQuoteStateToCancelled(quoteId: String) = HasToken.async {
    Quote.updateState(quoteId, QuoteState.Cancelled).map { result =>
      if (result.ok) {
        Quote.getById(quoteId).map( _.map( Channels.channelQuotes push Json.toJson(_) ) )
        Ok
      }
      else BadRequest("Something went wrong. Please verify the id you sent.") }
  }
}
