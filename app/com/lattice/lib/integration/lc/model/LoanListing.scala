/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */
package com.lattice.lib.integration.lc.model

import java.time.ZonedDateTime

/**
 * @author ze97286
 */
case class LoanListing(asOfDate:ZonedDateTime,loans:Seq[LendingClubLoan])