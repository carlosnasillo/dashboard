/**
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

package com.lattice.lib.integration.lc.impl

import com.lattice.lib.integration.lc.LendingClubConfig
import com.lattice.lib.integration.lc.LendingClubConfig.ApiKey
import com.lattice.lib.integration.lc.LendingClubConfig.ApiKeyHeader
import com.lattice.lib.integration.lc.LendingClubConfig.Authorisation
import com.lattice.lib.integration.lc.LendingClubConfig.AuthorisationHeader
import com.lattice.lib.integration.lc.LendingClubConfig.SubmitOrderUrl
import com.lattice.lib.integration.lc.LendingClubConnection
import com.lattice.lib.integration.lc.model.AccountSummary
import com.lattice.lib.integration.lc.model.ExecutionReport
import com.lattice.lib.integration.lc.model.Formatters._
import com.lattice.lib.integration.lc.model.LendingClubNote
import com.lattice.lib.integration.lc.model.LoanListing
import com.lattice.lib.integration.lc.model.Order
import com.lattice.lib.integration.lc.model.Orders
import com.lattice.lib.integration.lc.model.OwnedNotes
import play.api.libs.json.Json
import scalaj.http.Http
import com.lattice.lib.integration.lc.model.PortfolioDetails
import com.lattice.lib.integration.lc.model.InvestorPortfolios
import play.api.Logger
import java.time.ZonedDateTime
import com.lattice.lib.integration.lc.model.Errors
import com.lattice.lib.integration.lc.model.WithdrawFundsResponse
import com.lattice.lib.integration.lc.model.TransferFundsResponse

/**
 * Implementation for lending club connection api
 *
 * TODO add full logging
 * TODO test all
 *
 * @author ze97286
 */

object LendingClubConnectionImpl extends LendingClubConnection {

  /**
   * Submit an order to buy loans based on the given sequence of orders
   */
  override def submitOrder(orders: Seq[Order]): ExecutionReport = {
    Logger.info(s"submitting orders ${orders mkString "\n"}")
    val lcOrders = Orders(LendingClubConfig.Account, orders)
    val jsonOrders = Json.toJson(lcOrders).toString
    val erString = Http(SubmitOrderUrl).headers(
      ("Content-Type", "application/json"),
      (AuthorisationHeader, Authorisation),
      (ApiKeyHeader, ApiKey)).postData(jsonOrders).asString.body
    val erJson = Json.parse(erString)
    Json.fromJson[ExecutionReport](erJson).asOpt match {
      case None =>
        val err = s"failed to process submit order response: $erJson"
        Logger.error(err)
        throw new IllegalArgumentException(err)
      case Some(er) =>
        Logger.info(s"sucessfully processed execution report: ${er.orderInstructId} => \n${er.orderConfirmations mkString "\n"}")
        er
    }
  }

  /**
   * Get notes owned through lattice
   */
  override def ownedNotes: Seq[LendingClubNote] = {
    Logger.info("requesting owned notes from LendingClub")
    val notesString = Http(LendingClubConfig.OwnedNotesUrl)
      .headers((AuthorisationHeader, Authorisation),
        (ApiKeyHeader, ApiKey)).asString.body

    val notes = if (notesString == LendingClubConfig.EmptyDoc) {
      Seq()
    } else {
      val notesJson = Json.parse(notesString)
      Json.fromJson[OwnedNotes](notesJson).asOpt.get.myNotes
    }

    Logger.info(s"found notes:${notes mkString "\n"}")
    notes
  }

  /**
   * Get the currently available loans listing
   */
  override def availableLoans: LoanListing = {
    Logger.info("requesting available loans from LendingClub")
    val loansString = Http(LendingClubConfig.LoanListingUrl)
      .headers((AuthorisationHeader, Authorisation),
        (ApiKeyHeader, ApiKey)).asString.body
    val loansJson = Json.parse(loansString)
    val loans = Json.fromJson[LoanListing](loansJson).asOpt.getOrElse(LoanListing(ZonedDateTime.now, Seq()))

    Logger.info(s"found loans [${loans.asOfDate}:\n${loans.loans mkString "\n"}")
    loans
  }

  /**
   * Get lattice account summary from LC
   */
  override def accountSummary: AccountSummary = {
    Logger.info("requesting account summary (for lattice) from LendingClub")
    val summaryString = Http(LendingClubConfig.AccountSummaryUrl)
      .headers((AuthorisationHeader, Authorisation),
        (ApiKeyHeader, ApiKey)).asString.body

    val summaryJson = Json.parse(summaryString)

    val summary = Json.fromJson[AccountSummary](summaryJson).asOpt
    summary match {
      case Some(s) =>
        Logger.info(s"account summary: $s")
        s
      case _ => throw new IllegalArgumentException("Failed to get account summary for lattice from LendingClub")
    }
  }

  /**
   *  Transfer funds to lattice account with Lending Club
   */
  override def transferFunds(amount: BigDecimal) = {
    Logger.info(s"requesting to transfer funds to LendingClub: amount=$amount")

    val transferJson = s"""{
      "transferFrequency" : "LOAD_NOW",
      "amount" : $amount
      }"""

    val transferResult = Http(LendingClubConfig.TransferFundsUrl).headers(
      ("Content-Type", "application/json"),
      (AuthorisationHeader, Authorisation),
      (ApiKeyHeader, ApiKey)).postData(transferJson).asString.body

    val transferResultJson = Json.toJson(transferResult)

    val result = Json.fromJson[TransferFundsResponse](transferResultJson).asOpt
    Logger.info(s"result=$result")
    result match {
      case None =>
        val errors = Json.fromJson[Errors](transferResultJson).asOpt
        val errorMessage = errors match {
          case Some(e) => s"failed to transfer $amount to LendingClub, reason: $e"
          case None    => s"failed to transfer $amount to LendingClub ${transferResultJson}"
        }
        Logger.error(errorMessage)
        throw new IllegalArgumentException(errorMessage)
      case Some(w) => Logger.info(s"successfully transferred funds to LendingClub: $w")
    }
  }

  /**
   *  Withdraw funds from Lending Club to lattice account
   */
  override def withdrawFunds(amount: BigDecimal) = {
    Logger.info(s"requesting to withdraw funds from LendingClub: amount=$amount")

    val withdrawJson = s"""{"amount" : $amount}"""
    val withdrawStr = Http(LendingClubConfig.WithdrawFundsUrl).headers(
      ("Content-Type", "application/json"),
      (AuthorisationHeader, Authorisation),
      (ApiKeyHeader, ApiKey)).postData(withdrawJson).asString.body

    val withdrawRespJson = Json.parse(withdrawStr)
    val result = Json.fromJson[WithdrawFundsResponse](withdrawRespJson).asOpt

    result match {
      case None =>
        val errors = Json.fromJson[Errors](withdrawRespJson).asOpt
        val errorMessage = errors match {
          case Some(e) => s"failed to withdraw $amount from LendingClub, reason: $e"
          case None    => s"failed to withdraw $amount from LendingClub ${withdrawRespJson}"
        }
        Logger.error(errorMessage)
        throw new IllegalArgumentException(errorMessage)
      case Some(w) => Logger.info(s"successfully withdrawn funds from LendingClub: $w")
    }
  }

  override def createPorfolio(name: String, description: String): PortfolioDetails = {
    Logger.info(s"creating portfolio in LendingClub for $name, $description")
    val portfolioJson = s"""{"aid" : ${LendingClubConfig.Account}, "portfolioName" : "${name}", "portfolioDescription" : "${description}"}"""

    val createResult = Http(LendingClubConfig.CreatePorfoliorUrl).headers(
      ("Content-Type", "application/json"),
      (AuthorisationHeader, Authorisation),
      (ApiKeyHeader, ApiKey)).postData(portfolioJson).asString.body

    val resultJson = Json.parse(createResult)
    val result = Json.fromJson[PortfolioDetails](resultJson).asOpt

    result match {
      case None =>
        val errors = Json.fromJson[Errors](resultJson).asOpt
        val errorMessage = errors match {
          case Some(e) => s"failed to create portfolio for $name, reason: $e"
          case None    => s"failed to create portfolio for $name, ${resultJson}"
        }
        Logger.error(errorMessage)
        throw new IllegalArgumentException(errorMessage)
      case Some(res) =>
        Logger.info(s"successfully created portfolio for $name in LendingClub")
        res
    }
  }

  override def loadPortfolios: Seq[PortfolioDetails] = {
    Logger.info("loading porfolios from LendingClub")
    val portfoliosString = Http(LendingClubConfig.MyPortfoliosUrl)
      .headers((AuthorisationHeader, Authorisation),
        (ApiKeyHeader, ApiKey)).asString.body
    val portfoliosJson = Json.parse(portfoliosString)
    val portfolios = Json.fromJson[InvestorPortfolios](portfoliosJson).asOpt
    portfolios match {
      case None =>
        Logger.warn("no portfolios could be found")
        Seq()
      case Some(ip) =>
        Logger.info(s"found portfolios: \n${ip.myPortfolios mkString "\n"}")
        ip.myPortfolios
    }
  }
}