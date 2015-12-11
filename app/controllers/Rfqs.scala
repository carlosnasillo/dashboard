/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import models.Rfq
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

class Rfqs extends Controller {

  val rfqForm = Form(
    mapping (
      "timestamp" -> ignored(DateTime.now()),
      "durationInMonths" -> number,
      "client" -> nonEmptyText,
      "dealer" -> list(nonEmptyText),
      "creditEvent" -> list(nonEmptyText),
      "timeWindowInMinutes" -> number,
      "isValid" -> boolean,
      "cdsValue" -> bigDecimal
    )(Rfq.apply)(models.Rfq.unapply)
  )

  def submitRFQ = Action { implicit request =>
    rfqForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedRfq => {
        Rfq.store(submittedRfq)
        Ok
      }
    )
  }
}
