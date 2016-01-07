/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package utils

import java.util.UUID

import controllers.LoginFormObj
import models._
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._

/**
  * @author : julienderay
  * Created on 06/01/2016
  */

object Forms {
  def loginForm = Form(
    mapping (
      "email" -> email,
      "password" -> nonEmptyText
    )(LoginFormObj.apply)(LoginFormObj.unapply)
  )

  def tradeForm = Form(
    mapping (
      "id" -> ignored(UUID.randomUUID().toString),
      "rfqId" -> nonEmptyText,
      "quoteId" -> nonEmptyText,
      "timestamp" -> ignored(DateTime.now()),
      "durationInMonths" -> number,
      "client" -> nonEmptyText,
      "dealer" -> nonEmptyText,
      "submittedBy" -> email,
      "acceptedBy" -> email,
      "creditEvents" -> set(nonEmptyText),
      "cdsValue" -> bigDecimal,
      "premium" -> bigDecimal,
      "referenceEntities" -> set(nonEmptyText)
    )(Trade.apply)(Trade.unapply)
  )

  def quoteForm = Form(
    mapping (
      "id" -> ignored(UUID.randomUUID().toString),
      "rfqId" -> nonEmptyText,
      "timestamp" -> ignored(DateTime.now()),
      "premium" -> bigDecimal,
      "timeWindowInMinutes" -> number,
      "client" -> nonEmptyText,
      "dealer" -> nonEmptyText,
      "submittedBy" -> email,
      "referenceEntities" -> set(nonEmptyText),
      "state" -> ignored(QuoteState.Outstanding)
    )(Quote.apply)(Quote.unapply)
  )

  def rfqForm = Form(
    mapping (
      "id" -> ignored(UUID.randomUUID().toString),
      "timestamp" -> ignored(DateTime.now()),
      "durationInMonths" -> number,
      "client" -> nonEmptyText,
      "dealers" -> set(nonEmptyText),
      "submittedBy" -> email,
      "creditEvents" -> set(nonEmptyText),
      "timeWindowInMinutes" -> number,
      "isValid" -> boolean,
      "cdsValue" -> bigDecimal,
      "referenceEntities" -> set(nonEmptyText)
    )(Rfq.apply)(Rfq.unapply)
  )
}
