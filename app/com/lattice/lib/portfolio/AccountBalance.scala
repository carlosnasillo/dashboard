/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.portfolio

import scala.math.BigDecimal.int2bigDecimal

/**
 * @author ze97286
 */
object AccountBalance {
  def newAccount(investorId: String) = AccountBalance(investorId, 0, 0, 0, 0, 0, 0, 0,0)
}

case class AccountBalance(portfolioName: String, availableCash: BigDecimal, invested: BigDecimal, pendingInvestment: BigDecimal, principalOutstanding: BigDecimal, principalReceived: BigDecimal, interestReceived: BigDecimal, paymentReceived: BigDecimal,earmarked:BigDecimal) 