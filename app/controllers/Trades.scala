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
import play.api.mvc.Controller
import play.api.libs.json.Json

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

  def submitTrade = HasToken { implicit request =>
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

  def getTradesByAccount(account: String) = HasToken.async {
    Trade.getTradesByAccount(account).map( trades => Ok( Json.toJson(trades) ) )
  }
}