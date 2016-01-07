/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package com.lattice.lib.integration.lc.impl

import java.time.ZonedDateTime

import com.lattice.lib.integration.lc.LendingClubConfig.{ApiKey, ApiKeyHeader, Authorisation, AuthorisationHeader}
import com.lattice.lib.integration.lc.{LendingClubConfig, LendingClubConnection}
import com.lattice.lib.integration.lc.model.Formatters._
import com.lattice.lib.integration.lc.model.LoanListing
import play.api.Logger
import play.api.libs.json.Json

import scalaj.http.Http

/**
 * Implementation for lending club connection api
 *
 * TODO test all
 *
 * @author ze97286
 */

object LendingClubConnectionImpl extends LendingClubConnection {

  /**
   * Get the currently available loans listing
   */
  override def availableLoans: LoanListing = {

    Logger.info("requesting available loans from LendingClub")
    val loansString = Http(LendingClubConfig.LoanListingUrl)
      .headers((AuthorisationHeader, Authorisation),
        (ApiKeyHeader, ApiKey)).asString.body

    val loans = if (loansString == "") LoanListing(ZonedDateTime.now, Seq()) else {
      val loansJson = Json.parse(loansString)
      Json.fromJson[LoanListing](loansJson).asOpt.getOrElse(LoanListing(ZonedDateTime.now, Seq()))
    }

    Logger.info(s"found loans [${loans.asOfDate}:\n${loans.loans mkString "\n"}")
    loans
  }
}