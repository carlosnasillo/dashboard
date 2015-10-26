package controllers

import models.UserLogin
import play.api.data.Form
import play.api.data.Forms._
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

  def authentification = Action.async { implicit request =>
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
              Ok("")
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