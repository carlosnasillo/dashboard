/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package controllers

import play.api.mvc.Action
import play.api.mvc._

/**
 * Created by Julien Déray on 23/10/2015.
 */
class Dashboard extends Controller {
  def dashboard = Action {
    Ok("")
  }
}
