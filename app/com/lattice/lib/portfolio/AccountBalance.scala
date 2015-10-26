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

case class AccountBalance(
    portfolioName: String, // the name of the portfolio
    availableCash: BigDecimal, // currently available cash in the account
    invested: BigDecimal, // total investment in notes for the portfolio
    pendingInvestment: BigDecimal, // total pending investment - notes not yet initiated
    principalOutstanding: BigDecimal, // total outstanding principal portfolio
    principalReceived: BigDecimal, // total principal received for the portfolio
    interestReceived: BigDecimal, // total interest received for the portfolio
    paymentReceived: BigDecimal, // total payment received for the portfolio
    earmarked:BigDecimal) // inflight investment - sent to the market, not yet confirmed