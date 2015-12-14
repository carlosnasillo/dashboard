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
import controllers.TradeForm
import org.joda.time.DateTime
import play.api.Logger
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection.JSONCollection
import reactivemongo.api.{Cursor, QueryOpts}
import reactivemongo.bson.BSONObjectID

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

/**
  * @author : julienderay
  * Created on 13/12/2015
  */

case class Trade(
                  _id: BSONObjectID,
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

object Trade {
  val collectionName = "trades"

  implicit val tradeFormat = Json.format[Trade]
  implicit val tradeFormFormat = Json.format[TradeForm]

  val tradesTable: JSONCollection = DbUtil.db.collection(collectionName)

  lazy val futureCollection: Future[JSONCollection] = {
    tradesTable.stats().flatMap {
      case stats if !stats.capped =>
        // the collection is not capped, so we convert it
        tradesTable.convertToCapped(1024 * 1024, None)
      case _ => Future(tradesTable)
    }.recover {
      // the collection does not exist, so we create it
      case _ =>
        tradesTable.createCapped(1024 * 1024, None)
    }.map { _ =>
      tradesTable
    }
  }

  def store(rfq: TradeForm) {
    val future = tradesTable.insert(Json.toJson(rfq).as[JsObject])
    future.onComplete {
      case Failure(e) => throw e
      case Success(lastError) => Logger.info(s"New trade inserted : $rfq")
    }
  }

  def getTradeStream = {
    futureCollection.map { collection =>
      val cursor: Cursor[JsObject] = collection
        .find(Json.obj())
        .options(QueryOpts().tailable.awaitData)
        .cursor[JsObject]()

      cursor.enumerate()
    }
  }
}

