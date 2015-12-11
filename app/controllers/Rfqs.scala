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
import play.api.libs.iteratee.{Enumeratee, Enumerator, Iteratee}
import play.api.libs.json.{JsObject, JsString, JsValue}
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global

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
      "dealers" -> list(nonEmptyText),
      "creditEvents" -> list(nonEmptyText),
      "timeWindowInMinutes" -> number,
      "isValid" -> boolean,
      "cdsValue" -> bigDecimal
    )(Rfq.apply)(models.Rfq.unapply)
  )

  implicit val jsObjFrame = WebSocket.FrameFormatter.jsonFrame.
    transform[JsObject]({ obj: JsObject => obj: JsValue }, {
    case obj: JsObject => obj
    case js => sys.error(s"unexpected JSON value: $js")
  })

  def submitRFQ = HasToken { implicit request =>
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

  def streamRFQByClient(client: String) = WebSocket.using[JsObject] { request =>
    val clientFilter = Enumeratee.filter[JsObject](jsObj => {
      val extractedClient = (jsObj \ "client").getOrElse(JsString("")).as[String]
      extractedClient == client
    })

    val in = Iteratee.ignore[JsObject]
    val out = Enumerator.flatten(Rfq.getRfqStream).through(clientFilter)

    (in, out)
  }
}
