/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import play.api.mvc._

class Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }
}
