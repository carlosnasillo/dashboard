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

  def login = Action { implicit request =>
    request.session.get("email") match {
      case Some(userEmail) => Redirect( routes.Dashboard.dashboard() )
      case None            => Ok( views.html.login( loginForm ) )
    }
  }

  def logout = Action { implicit request =>
    Redirect( routes.Login.login() )
      .withNewSession
      .flashing("info" -> "You have been logged out.")
  }

  def authenticate = Action { implicit request =>
    request.session.get("email") match {
      case Some(userEmail) => Redirect( routes.Dashboard.dashboard() )
      case None => Ok( views.html.login( loginForm ) )
    }
  }

  def authentification = Action.async { implicit request =>

    def goLoginWithFlash(flashMessage: String): Result = {
      Redirect( routes.Login.login() )
        .flashing("danger" -> flashMessage)
    }

    loginForm.bindFromRequest.fold(
      formWithErrors => {
        Future.successful(
          goLoginWithFlash("Wrong data sent.")
        )
      },
      providedLogin => {
        UserLogin.getByEmail( providedLogin.email ).map {
          case Some(user) =>
            if ( Hash.checkPassword(providedLogin.password, user.password) ) {
              Redirect( routes.Dashboard.dashboard() )
                .withSession(
                  "email" -> user.email
                )
            }
            else {
              goLoginWithFlash("The password is incorrect.")
            }
          case None =>
            goLoginWithFlash("Incorrect email or password.")
        }
      }
    )
  }
}