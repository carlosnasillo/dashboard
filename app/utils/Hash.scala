/*
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 *
 */

package utils

import java.util.UUID

import org.mindrot.jbcrypt.BCrypt

/**
 * Created by Julien Déray on 23/10/2015.
 */

object Hash {
  def createPassword(clearString: String): String = BCrypt.hashpw(clearString, BCrypt.gensalt())
  def checkPassword(candidate: String, encryptedPassword: String): Boolean = BCrypt.checkpw(candidate, encryptedPassword)
  def createToken: String = UUID.randomUUID().toString
}