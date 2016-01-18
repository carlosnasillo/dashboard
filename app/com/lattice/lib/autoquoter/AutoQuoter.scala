/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

package com.lattice.lib.autoquoter

import java.util.UUID

import models.{QuoteState, Quote, Rfq}
import org.joda.time.DateTime
import utils.Constants

import scala.util.Random

/**
* @author : julienderay
* Created on 31/12/2015
*/

object AutoQuoter {
  def generateQuote(rfq: Rfq): Quote = {
    Quote(UUID.randomUUID.toString, rfq.id, DateTime.now, randomBetween10and100, 10*60, rfq.client, Constants.automaticDealerAccount, Constants.automaticDealerEmail, rfq.referenceEntities, QuoteState.Outstanding)
  }

  private def randomBetween10and100: Int = {
    Random.nextInt(90) + 10
  }
}
