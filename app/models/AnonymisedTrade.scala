/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package models

import org.joda.time.DateTime
import play.api.libs.json.Json

/**
  * @author : julienderay
  * Created on 07/01/2016
  */
case class AnonymisedTrade(
                           timestamp: DateTime,
                           durationInMonths: Int,
                           cdsValue: BigDecimal,
                           premium: BigDecimal,
                           referenceEntities: Set[String]
                          )

object AnonymisedTrade {
  implicit val anonymisedTradeFormat = Json.format[AnonymisedTrade]
}