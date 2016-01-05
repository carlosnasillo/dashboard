/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */
package com.lattice.lib.integration.lc

import com.lattice.lib.integration.lc.model.LoanListing

/**
 * interface for interaction with Lending Club API
 *
 * @author ze97286
 */
trait LendingClubConnection {

  // get a sequence of available loans
  def availableLoans: LoanListing
}