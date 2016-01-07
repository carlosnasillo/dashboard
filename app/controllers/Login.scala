/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

package controllers

import models.UserLogin
import play.api.libs.json.Json
import play.api.mvc._
import utils.{Forms, Hash}

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class LoginFormObj(email: String, password: String)

class Login extends Controller {

  def authentication = Action.async { implicit request =>
    Forms.loginForm.bindFromRequest.fold(
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
              UserLogin.save(UserLogin(user.email, user.password, user.account, token))
              Ok(Json.obj("token" -> token, "account" -> user.account))
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