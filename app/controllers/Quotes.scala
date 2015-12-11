/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

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
      "id" -> nonEmptyText,
      "rfqId" -> nonEmptyText,
      "timestamp" -> jodaDate("yyyy-MM-dd HH:mm:ss"),
      "premium" -> bigDecimal,
      "timeWindowInMinutes" -> number,
      "client" -> nonEmptyText,
      "dealer" -> nonEmptyText
    )(Quote.apply)(models.Quote.unapply)
  )

  def submitQuote = Action { implicit request =>
    quoteForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedQuote => {
        Quote.store(submittedQuote)
        Ok
      }
    )
  }
}
