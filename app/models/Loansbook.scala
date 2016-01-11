/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import com.lattice.lib.utils.DbUtil
import org.joda.time.DateTime
import play.api.libs.json.Json
import play.modules.reactivemongo.json._
import play.modules.reactivemongo.json.collection.JSONCollection

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 11/01/2016
  */

case class Loansbook(
                      id: Int,
                      status: String,
                      credit_band: String,
                      loan_purpose: String,
                      sector: String,
                      business_type_name: String,
                      region_name: String,
                      loan_amount: BigDecimal,
                      interest_rate: Double,
                      term: Int,
                      loan_accepted_date: DateTime,
                      security_taken: String
                    )

object Loansbook {
  val collectionName = "loansbook"

  implicit val loansbookFormat = Json.format[Loansbook]

  val loansbookTable: JSONCollection = DbUtil.db.collection(collectionName)

  def getLoansbook = loansbookTable
    .find(Json.obj())
    .sort(Json.obj("loan_accepted_date" -> 1))
    .cursor[Loansbook]()
    .collect[List](Int.MaxValue)
}