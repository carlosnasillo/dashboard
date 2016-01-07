/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

package com.lattice.lib.channels

import play.api.libs.iteratee.{Iteratee, Concurrent}
import play.api.libs.json.JsValue

/**
  * @author : julienderay
  * Created on 31/12/2015
  */

object Channels {

  val ignoredIn = Iteratee.ignore[JsValue]
  val (outRfq, channelRfq) = Concurrent.broadcast[JsValue]
  val (outQuotes, channelQuotes) = Concurrent.broadcast[JsValue]
  val (outTrades, channelTrades) = Concurrent.broadcast[JsValue]
}
