/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import models.UserLogin
import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json
import play.api.mvc._
import utils.Hash

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

case class LoginFormObj(email: String, password: String)

class Login extends Controller {

  val loginForm = Form(
    mapping (
      "email" -> email,
      "password" -> nonEmptyText
    )(LoginFormObj.apply)(LoginFormObj.unapply)
  )

  def authentication = Action.async { implicit request =>
    loginForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful(
          BadRequest("Wrong data sent.")
        )
      },
      providedLogin => {
        UserLogin.getByEmail( providedLogin.email ).map {
          case Some(user) =>
            if ( Hash.checkPassword(providedLogin.password, user.password) ) {
              val token = Hash.createToken
              UserLogin.save(UserLogin(user.email, user.password, token))
              Ok(Json.obj("token" -> token))
            }
            else {
              BadRequest("The password is incorrect.")
            }
          case None =>
            BadRequest("Incorrect email or password.")
        }
      }
    )
  }
}