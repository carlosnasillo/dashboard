/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import java.time.LocalDateTime

import controllers.Security.HasToken
import models.Quote
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

class Quotes extends Controller {

  val quoteForm = Form(
    mapping (
      "rfqId" -> nonEmptyText,
      "timestamp" -> nonEmptyText,
      "premium" -> bigDecimal,
      "timeWindowInMinutes" -> number,
      "client" -> nonEmptyText,
      "dealer" -> nonEmptyText
    )(Quote.apply)(models.Quote.unapply)
  )

  def submitQuote = HasToken { implicit request =>
    quoteForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedQuote => {
        val deadline = LocalDateTime.parse(submittedQuote.timestamp).plusMinutes(submittedQuote.timeWindowInMinutes)

        if ( deadline.compareTo(LocalDateTime.now()) < 0 ) {
          BadRequest("RFQ expired.")
        }
        else {
          Quote.store(submittedQuote)
          Ok
        }
      }
    )
  }
}
