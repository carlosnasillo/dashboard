/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
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