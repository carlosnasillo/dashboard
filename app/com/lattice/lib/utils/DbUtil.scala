/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.utils

import play.api.Play.current
import play.modules.reactivemongo.ReactiveMongoApi

import scala.concurrent.duration.DurationInt
import scala.language.postfixOps

/**
 * Mongo DB util for accessing lattice mongo database
 *
 * @author ze97286
 */
object DbUtil {
  lazy val reactiveMongoApi = current.injector.instanceOf[ReactiveMongoApi]

  val timeout = 5 seconds
  val timeoutMillis = timeout.toMillis.toInt

  lazy val db = reactiveMongoApi.db

  def closeDriver(): Unit = try {
    reactiveMongoApi.driver.close()
  } catch { case _: Throwable => () }

}