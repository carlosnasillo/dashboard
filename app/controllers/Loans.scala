/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import com.lattice.lib.integration.lc.impl.LendingClubMongoDb
import com.lattice.lib.integration.lc.model.Formatters.loanListingFormat
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import com.lattice.lib.utils.DbUtil
import play.api.libs.json.Json
import play.api.mvc._

/**
  * Created by julienderay on 09/11/2015.
  */
class Loans extends Controller {

  val lendingClubMongoDb: LendingClubMongoDb = new LendingClubMongoDb(DbUtil.db)

  def availableLoans = Action.async {
    lendingClubMongoDb.availableLoans.map( loanListing => Ok( Json.toJson( loanListing ) ) )
  }
}
