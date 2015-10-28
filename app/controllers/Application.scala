/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import java.io.File

import play.api._
import play.api.mvc._
import play.api.Play.current

class Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  /** resolve "any" into the corresponding HTML page URI */
  def getURI(any: String): String = any match {
      // views
    case "mainDashboard" => "/public/app/mainDashboard/mainDashboard.html"
    case "login" => "/public/app/login/login.html"

      // directive templates
    case "mySimpleNumberDisplay" => "/public/app/directives/mySimpleNumberDisplay/my-simple-number-display.html"
    case "myDoughnutChart" => "/public/app/directives/myDoughnutChart/my-doughnut-chart.html"

    case _ => "error"
  }

  /** load an HTML page from public/html */
  def loadPublicHTML(any: String) = Action {
    val projectRoot = Play.application.path
    val file = new File(projectRoot + getURI(any))
    if (file.exists())
      Ok(scala.io.Source.fromFile(file.getCanonicalPath).mkString).as("text/html")
    else
      NotFound
  }
}
