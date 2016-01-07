/**
 * Copyright (c) 2015 PDX Technology, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * PDX Technology, except with written permission of PDX Technology.
 */
package com.lattice.lib.utils

/**
 * Created by Julien Déray on 22/10/2015.
 */
object Implicits {

  implicit class SeqImpl[T](seq:Seq[T]) {
    def sumBy[N](f:T=>N)(implicit num: Numeric[N])  = {
      seq.foldLeft(num.zero)((acc, b) => num.plus(acc, f(b)))
    }
  }
}
