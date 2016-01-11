/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */

package controllers

import controllers.Security.HasToken
import play.api.libs.json.Json
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global

/**
  * @author : julienderay
  * Created on 11/01/2016
  */

class Loansbook extends Controller {

  def getLoansbook = HasToken.async {
    models.Loansbook.getLoansbook map ( loanbook => Ok( Json.toJson(loanbook) ) )
  }
}
