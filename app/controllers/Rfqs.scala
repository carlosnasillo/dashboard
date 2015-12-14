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
import models.Rfq
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import play.api.libs.json.Json

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

// Todo : find a better way to not have the id for storage
case class RfqForm(
                timestamp: DateTime,
                durationInMonths: Int,
                client: String,
                dealers: List[String],
                creditEvents: List[String],
                timeWindowInMinutes: Int,
                isValid: Boolean,
                cdsValue: BigDecimal,
                loanId: String,
                originator: String
              )

class Rfqs extends Controller {

  def submitRFQ = HasToken { implicit request =>
    val rfqForm = Form(
      mapping (
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
      )(RfqForm.apply)(RfqForm.unapply)
    )

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

  def getRFQWhenDealersContainsClient(client: String) = HasToken.async {
    Rfq.getTodaysRfqWhenDealersContainsClient(client).map( rfqs => Ok( Json.toJson(rfqs) ) )
  }

  def getRFQByClient(client: String) = HasToken.async {
    Rfq.getTodaysRfqByClient(client).map( rfqs => Ok( Json.toJson(rfqs) ) )
  }
}
