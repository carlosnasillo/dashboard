/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package models

import com.lattice.lib.utils.DbUtil
import controllers.QuoteForm
import play.api.Logger
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection.JSONCollection
import reactivemongo.bson.BSONObjectID

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

case class Quote(
                  _id: BSONObjectID,
                  rfqId: String,
                  timestamp: String, // todo : find a better way to manage the dates
                  premium: BigDecimal,
                  timeWindowInMinutes: Int,
                  client: String,
                  dealer: String
                )

object Quote {
  val collectionName = "quotes"

  implicit val quoteFormat = Json.format[Quote]
  implicit val quoteFormFormat = Json.format[QuoteForm]

  val quotesTable: JSONCollection = DbUtil.db.collection(collectionName)

  def store(quote: QuoteForm) {
    val future = quotesTable.insert(Json.toJson(quote).as[JsObject])
    future.onComplete {
      case Failure(e) => throw e
      case Success(lastError) => Logger.info(s"New quote inserted : $quote")
    }
  }

  def getQuotesByClient(client: String) =
    quotesTable
      .find(Json.obj("client" -> client))
      .cursor[Quote]()
      .collect[List](Int.MaxValue)
}