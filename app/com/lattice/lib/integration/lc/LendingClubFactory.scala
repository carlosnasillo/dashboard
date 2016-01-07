/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.lattice.lib.integration.lc

import com.lattice.lib.integration.lc.impl.{LendingClubAnalytics, LendingClubConnectionImpl, LendingClubMongoDb}
import com.lattice.lib.portfolio.MarketPlaceFactory
import com.lattice.lib.utils.DbUtil

/**
 * TODO change this to proper DI
 *
 * @author ze97286
 */
object LendingClubFactory extends MarketPlaceFactory {
  private val db = new LendingClubMongoDb(DbUtil.db)
  override val analytics = new LendingClubAnalytics(LendingClubConnectionImpl,db)
}