/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

package utils

import java.util.UUID

import models.Trade
import org.joda.time.DateTime
import play.api.data.Form
import play.api.data.Forms._

/**
  * @author : julienderay
  * Created on 06/01/2016
  */

object Forms {
  def tradeForm = Form(
    mapping (
      "id" -> ignored(UUID.randomUUID().toString),
      "rfqId" -> nonEmptyText,
      "quoteId" -> nonEmptyText,
      "timestamp" -> ignored(DateTime.now()),
      "durationInMonths" -> number,
      "client" -> nonEmptyText,
      "dealer" -> nonEmptyText,
      "creditEvents" -> set(nonEmptyText),
      "cdsValue" -> bigDecimal,
      "premium" -> bigDecimal,
      "referenceEntities" -> set(nonEmptyText)
    )(Trade.apply)(Trade.unapply)
  )
}
