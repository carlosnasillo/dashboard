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
import reactivemongo.api.{Cursor, QueryOpts}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

/**
  * @author : julienderay
  * Created on 11/12/2015
  */

case class Rfq(
                timestamp: DateTime,
                durationInMonths: Int,
                client: String,
                dealers: List[String],
                creditEvents: List[String],
                timeWindowInMinutes: Int,
                isValid: Boolean,
                cdsValue: BigDecimal
              )

object Rfq {
  val collectionName = "rfqs"

  implicit val RFQFormat = Json.format[Rfq]

  val RFQsTable: JSONCollection = DbUtil.db.collection(collectionName)

  lazy val futureCollection: Future[JSONCollection] = {
    RFQsTable.stats().flatMap {
      case stats if !stats.capped =>
        // the collection is not capped, so we convert it
        RFQsTable.convertToCapped(1024 * 1024, None)
      case _ => Future(RFQsTable)
    }.recover {
      // the collection does not exist, so we create it
      case _ =>
        RFQsTable.createCapped(1024 * 1024, None)
    }.map { _ =>
      RFQsTable
    }
  }

  def store(rfq: Rfq) {
    val future = RFQsTable.insert(Json.toJson(rfq).as[JsObject])
    future.onComplete {
      case Failure(e) => throw e
      case Success(lastError) => Logger.info(s"New RFQ inserted : $rfq")
    }
  }

  def getRfqStream = {
    val today = DateTime.now().withHourOfDay(0).getMillis
    Logger.info(today.toString)
    futureCollection.map { collection =>
      val cursor: Cursor[JsObject] = collection
        .find(Json.obj("timestamp" -> Json.obj("$gte" -> today)))
        .options(QueryOpts().tailable.awaitData)
        .cursor[JsObject]()

      cursor.enumerate()
    }
  }
}
