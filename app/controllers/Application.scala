package controllers

import java.io.File

import play.api._
import play.api.mvc._
import play.api.Play.current

class Application extends Controller {

  def index = Action {
    Ok("")
  }

  /** resolve "any" into the corresponding HTML page URI */
  def getURI(any: String): String = any match {
    case "mainDashboard" => "/public/html/mainDashboard.html"
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
