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
import com.lattice.lib.portfolio.MarketPlaceFactory
import com.lattice.lib.utils.DbUtil
import controllers.Security.HasToken
import models.Originator
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.mvc._
import utils.Formatters.noteFormat

import scala.concurrent.Future

/**
  * Created by julienderay on 09/11/2015.
  */
case class SubmitFormOrder(
                          loanId: String,
                          investorId: String,
                          amount: BigDecimal
                          )

case class OwnedNotesForm(
                         investorId: String
                         )

class Loans extends Controller {

  val lendingClubMongoDb: LendingClubMongoDb = new LendingClubMongoDb(DbUtil.db)

  val submitOrderForm = Form(
    mapping (
      "loanId" -> nonEmptyText,
      "investorId" -> nonEmptyText,
      "amount" -> bigDecimal
    )(SubmitFormOrder.apply)(SubmitFormOrder.unapply)
  )

  val ownedNotesForm = Form(
    mapping (
      "investorId" -> nonEmptyText
    )(OwnedNotesForm.apply)(OwnedNotesForm.unapply)
  )

  def availableLoans = HasToken.async {
    lendingClubMongoDb.availableLoans.map( loanListing => Ok( Json.toJson( loanListing ) ) )
  }

  def submitOrder = HasToken.async { implicit request =>
    submitOrderForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful(
          BadRequest("Wrong data sent.")
        )
      },
      infos => {
        MarketPlaceFactory.portfolio(Originator.LendingClub).submitOrder(infos.investorId, infos.loanId, infos.amount)
        Future.successful(
          Ok("")
        )
      }
    )
  }

  def ownedNotes(investorId: String) = HasToken.async {
    Future.successful(
      Ok(Json.toJson( MarketPlaceFactory.portfolio(Originator.LendingClub).notes(investorId) ))
    )
  }
}
