/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */
package com.lattice.lib.portfolio

import com.lattice.lib.integration.lc.LendingClubFactory

import models.Originator

/**
 * A factory to originator's interfaces
 * 
 * @author ze97286
 */
trait MarketPlaceFactory {
  def analytics: MarketplaceAnalytics
}

object MarketPlaceFactory {
  def analytics(originator: Originator.Value) = originator match {
    case Originator.LendingClub => LendingClubFactory.analytics
    case _                      => throw new IllegalArgumentException(s"unsupported originator $originator")
  }
}