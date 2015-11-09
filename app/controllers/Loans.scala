/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import com.lattice.lib.integration.lc.impl.LendingClubConnectionImpl
import com.lattice.lib.integration.lc.model.LoanListing
import play.api.mvc._
import play.api.libs.json.Json
import com.lattice.lib.integration.lc.model.Formatters.loanListingFormat

import scala.concurrent.Future

/**
  * Created by julienderay on 09/11/2015.
  */
class Loans extends Controller {

  def availableLoans = Action.async {
    val loanListing: LoanListing = LendingClubConnectionImpl.availableLoans
    Future.successful( Ok( Json.toJson( loanListing ) ) )
  }
}
