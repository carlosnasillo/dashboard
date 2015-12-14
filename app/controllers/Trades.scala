/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import controllers.Security._
import models.Trade
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.iteratee.{Enumeratee, Enumerator, Iteratee}
import play.api.libs.json.{JsArray, JsObject, JsValue}
import play.api.mvc.{Controller, _}

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  *         Created on 13/12/2015
  */
case class TradeForm(
                  rfqId: String,
                  quoteId: String,
                  timestamp: DateTime,
                  durationInMonths: Int,
                  client: String,
                  dealer: String,
                  creditEvents: List[String],
                  cdsValue: BigDecimal,
                  originator: String,
                  premium: BigDecimal
                )

class Trades extends Controller {

  val tradeForm = Form(
    mapping (
      "rfqId" -> nonEmptyText,
      "quoteId" -> nonEmptyText,
      "timestamp" -> ignored(DateTime.now()),
      "durationInMonths" -> number,
      "client" -> nonEmptyText,
      "dealer" -> nonEmptyText,
      "creditEvents" -> list(nonEmptyText),
      "cdsValue" -> bigDecimal,
      "originator" -> nonEmptyText,
      "premium" -> bigDecimal
    )(TradeForm.apply)(TradeForm.unapply)
  )

  implicit val jsObjFrame = WebSocket.FrameFormatter.jsonFrame.
    transform[JsObject]({ obj: JsObject => obj: JsValue }, {
    case obj: JsObject => obj
    case js => sys.error(s"unexpected JSON value: $js")
  })

  def submitTrade = HasToken { implicit request =>
    tradeForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest("Wrong data sent.")
      },
      submittedTrade => {
        Trade.store(submittedTrade)
        Ok
      }
    )
  }

  def streamTradeWithDealerAndClient(account: String) = WebSocket.using[JsObject] { request =>
    val clientAndDealerFilter = Enumeratee.filter[JsObject](jsObj => {
      val extractedDealer = (jsObj \ "dealer").getOrElse(JsArray()).as[String]
      val extractedClient = (jsObj \ "client").getOrElse(JsArray()).as[String]
      extractedClient == account || extractedDealer == account
    })

    val in = Iteratee.ignore[JsObject]
    val out = Enumerator.flatten(Trade.getTradeStream).through(clientAndDealerFilter)

    (in, out)
  }
}