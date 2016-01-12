/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import play.api.libs.json.{JsString, JsSuccess, JsValue, Format}

/**
  * @author : julienderay
  *         Created on 12/01/2016
  */

object PaymentPeriodicity extends Enumeration {
  type PaymentPeriodicity = Value
  val Monthly, Quarterly, Yearly = Value

  implicit val paymentPeriodicityFormat = new Format[PaymentPeriodicity.Value] {
    def reads(json: JsValue) = JsSuccess(PaymentPeriodicity.withName(json.as[String]))
    def writes(enum: PaymentPeriodicity.Value) = JsString(enum.toString)
  }
}