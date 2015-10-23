/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

package models

/**
 * Created by Julien Déray on 23/10/2015.
 */
import com.lattice.lib.utils.DbUtil
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future
import scala.util.{Failure, Success}

case class UserLogin (
                       email: String,
                       password: String
                       )

object UserLogin  {

  lazy val dbName = "lattice"
  val collectionName = "userlogin"

  implicit val accountSummaryFormat = Json.format[UserLogin]

  val userLoginTable: JSONCollection = DbUtil.db.collection(collectionName)

  def store(userLogin: UserLogin) {
      val future = userLoginTable.insert(Json.toJson(userLogin).as[JsObject])
      future.onComplete {
        case Failure(e) => throw e
        case Success(lastError) => println(s"successfully inserted document: $lastError")
      }
  }

  def getByEmail(email: String): Future[Option[UserLogin]] = {
    val query = Json.obj("email" -> email)
    userLoginTable.find(query).one[UserLogin]
  }
}