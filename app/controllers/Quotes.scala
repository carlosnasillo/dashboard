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
import controllers.Security.HasToken
import models.{Quote, QuoteState, Trade}
import play.api.libs.iteratee.Enumeratee
import play.api.libs.json.{JsArray, JsValue, Json}
import play.api.mvc._
import utils.Formatters.mapStringListQuote
import utils.Forms

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

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
    Forms.quoteForm.bindFromRequest.fold(
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

  def accept = HasToken.async { implicit request =>
    Forms.tradeForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful( BadRequest("Wrong data sent.") )
      },
      submittedTrade => {
        Quote.getById(submittedTrade.quoteId).flatMap (_.filter (_.state == QuoteState.Outstanding) map(quote => {
          for {
            quoteUpdateResult <- Quote.updateState(submittedTrade.quoteId, QuoteState.Accepted) if quoteUpdateResult.ok
            tradeUpdateResult <- Trade.store(submittedTrade) if tradeUpdateResult.ok
          } yield {
            Channels.channelQuotes push Json.toJson(quote.copy(state = QuoteState.Accepted))
            Channels.channelTrades push Json.toJson(submittedTrade)
            Ok
          }
        })
          getOrElse Future.successful(BadRequest("Quote's state should be outstanding in order to be accepted.")))
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
        Quote.getById(quoteId).map( _.foreach( Channels.channelQuotes push Json.toJson(_) ) )
        Ok
      }
      else BadRequest("Something went wrong. Please verify the id you sent.") }
  }
}
