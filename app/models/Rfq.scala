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

case class Rfq(
                id: String,
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

object Rfq {
  val collectionName = "rfqs"

  implicit val RFQFormat = Json.format[Rfq]

  val RFQsTable: JSONCollection = DbUtil.db.collection(collectionName)

  def store(rfq: Rfq) {
    val future = RFQsTable.insert(Json.toJson(rfq).as[JsObject])
    future.onComplete {
      case Failure(e) => throw e
      case Success(lastError) => Logger.info(s"New RFQ inserted : $rfq")
    }
  }

  def getTodaysRfqWhenDealersContainsClient(client: String) = {
    val today = DateTime.now().withHourOfDay(0).getMillis
    RFQsTable
      .find(Json.obj(
        "timestamp" -> Json.obj("$gte" -> today),
        "dealers" -> client
      ))
      .cursor[Rfq]()
      .collect[List](Int.MaxValue)
  }

  def getTodaysRfqByClient(client: String) = {
    val today = DateTime.now().withHourOfDay(0).getMillis
    RFQsTable
      .find(Json.obj(
        "timestamp" -> Json.obj("$gte" -> today),
        "client" -> client
      ))
      .cursor[Rfq]()
      .collect[List](Int.MaxValue)
  }
}
