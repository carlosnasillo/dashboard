/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 */

package models

import play.api.libs.json.Json

/**
  * @author : julienderay
  * Created on 07/01/2016
  */

case class UserInfo(
                    email: String,
                    account: String
                    )

object UserInfo {
  implicit val userInfosFormat = Json.format[UserInfo]
}