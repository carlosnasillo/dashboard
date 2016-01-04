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
import org.joda.time.DateTime
import play.api.Logger
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global
import scala.util.{Failure, Success}

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

case class Quote(
                  id: String,
                  rfqId: String,
                  timestamp: DateTime,
                  premium: BigDecimal,
                  timeWindowInMinutes: Int,
                  client: String,
                  dealer: String,
                  referenceEntities: List[String]
                )

object Quote {
  val collectionName = "quotes"

  implicit val quoteFormat = Json.format[Quote]

  val quotesTable: JSONCollection = DbUtil.db.collection(collectionName)

  def store(quote: Quote) {
    val future = quotesTable.insert(Json.toJson(quote).as[JsObject])
    future.onComplete {
      case Failure(e) => throw e
      case Success(lastError) => Logger.info(s"New quote inserted : $quote")
    }
  }

  def getQuotesByClient(client: String) =
    quotesTable
      .find(Json.obj("client" -> client))
      .sort(Json.obj("timestamp" -> 1))
      .cursor[Quote]()
      .collect[List](Int.MaxValue)

  def getQuotesByDealer(dealer: String) =
    quotesTable
      .find(Json.obj("dealer" -> dealer))
      .sort(Json.obj("timestamp" -> 1))
      .cursor[Quote]()
      .collect[List](Int.MaxValue)
}