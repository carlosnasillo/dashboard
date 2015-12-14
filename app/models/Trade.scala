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
  * Created on 13/12/2015
  */

case class Trade(
                  id: String,
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

  val tradesTable: JSONCollection = DbUtil.db.collection(collectionName)

  def store(rfq: Trade) {
    val future = tradesTable.insert(Json.toJson(rfq).as[JsObject])
    future.onComplete {
      case Failure(e) => throw e
      case Success(lastError) => Logger.info(s"New trade inserted : $rfq")
    }
  }

  def getTradesByAccount(account: String) = {
    tradesTable
      .find(Json.obj(
        "$or" -> Json.arr(
          Json.obj("client" -> account),
          Json.obj("dealer" -> account)
        )
      ))
      .cursor[Trade]()
      .collect[List](Int.MaxValue)
  }
}

