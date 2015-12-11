/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import controllers.Security.HasToken
import models.Quote
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._
import utils.Formatters.mapStringListQuote

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

case class QuoteForm(
                  rfqId: String,
                  timestamp: String, // todo : find a better way to manage the dates
                  premium: BigDecimal,
                  timeWindowInMinutes: Int,
                  client: String,
                  dealer: String
                )

class Quotes extends Controller {


  val quoteForm = Form(
    mapping (
      "rfqId" -> nonEmptyText,
      "timestamp" -> nonEmptyText,
      "premium" -> bigDecimal,
      "timeWindowInMinutes" -> number,
      "client" -> nonEmptyText,
      "dealer" -> nonEmptyText
    )(QuoteForm.apply)(QuoteForm.unapply)
  )

  def submitQuote = HasToken { implicit request =>
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
          Ok
//        }
      }
    )
  }

  def getQuoteWithClientByRfqId(client: String) = HasToken.async {
    Quote.getQuotesByClient(client).map( quotes => Ok( Json.toJson(quotes.groupBy(_.rfqId)) ) )
  }
}
