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
import play.api.mvc._

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 20/11/2015
  */

object Security {
  case class TokenRequest[A](token: String, request: Request[A]) extends WrappedRequest[A](request)

  private[controllers] object HasToken extends ActionBuilder[TokenRequest] {
    def invokeBlock[A](request: Request[A], block: (TokenRequest[A]) => Future[Result]) = {
      request.headers.get("X-TOKEN") map { token =>
        UserLogin.getByToken( token ).flatMap {
          case Some(user) => block(TokenRequest(user.token, request))
          case None       => Future.successful( Results.Unauthorized("401 Unauthorized\n") )
        }
      } getOrElse {
        Future.successful(Results.Unauthorized("401 No Security Token\n"))
      }
    }
  }
}