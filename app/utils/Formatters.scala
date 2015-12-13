/*
 * Copyright (c) 2015 Lattice Markets, All rights reserved.
 *
 * Unpublished copyright. All rights reserved. This material contains
 * proprietary information that shall be used or copied only with
 * Lattice Markets, except with written permission of Lattice Markets.
 *
 */

package utils

import models.Grade._
import models.{Quote, Grade, Term, Note}
import play.api.libs.json._
import play.api.libs.json.Json.JsValueWrapper

/**
  * @author : julienderay
  * Created on 19/11/2015
  */
object Formatters {

  def mapFormatFactory[A, B](strToA: String => A, strToB: String => B)(AtoKey: A => String, BtoValue: B => JsValueWrapper):  Format[Map[A, B]] = Format[Map[A, B]](
    new Reads[Map[A, B]] {
      def reads(jv: JsValue): JsResult[Map[A, B]] =
        JsSuccess(jv.as[Map[String, String]].map {
          case (k, v) =>
            strToA(k) -> strToB(v)
        })
    },
    new Writes[Map[A, B]] {
      def writes(map: Map[A, B]): JsValue =
        Json.obj(map.map {
          case (s, o) =>
            val ret: (String, JsValueWrapper) = AtoKey(s) -> BtoValue(o)
            ret
        }.toSeq: _*)
    }
  )

  implicit val mapTermBigDecimal: Format[Map[Term.Value, BigDecimal]] = mapFormatFactory[Term.Value, BigDecimal](Term.withName, BigDecimal(_))(_.toString, _.toString())
  implicit val mapGradeBigDecimalFormat: Format[Map[Grade, BigDecimal]] = mapFormatFactory[Grade, BigDecimal](Grade.withName, BigDecimal(_))(_.toString, _.toInt)
  implicit val mapGradeIntFormat: Format[Map[Grade.Value, Int]] = mapFormatFactory[Grade.Value, Int](Grade.withName, _.toInt)(_.toString, _.toInt)
  implicit val mapIntMapGradeValueIntFormat: Format[Map[Int,Map[models.Grade.Value,Int]]] = mapFormatFactory[Int,Map[Grade.Value,Int]](_.toInt, _.asInstanceOf[Map[models.Grade.Value,Int]])(_.toString, _.toString())
  implicit val mapStringListQuote: Format[Map[String, List[Quote]]] = mapFormatFactory[String, List[Quote]](_.toString, _.asInstanceOf[List[Quote]])(_.toString, Json.toJson(_))

  implicit val noteFormat = Json.format[Note]
}
