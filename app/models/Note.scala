package models

import java.time.ZonedDateTime

/**
 * @author ze97286
 */
case class Note(
    portfolioName:String, 
    noteId:String, 
    orderId:String,
    loanAmount:BigDecimal, 
    noteAmount:BigDecimal, 
    grade:String,
    interestRate: Double, 
    term:Int,
    loanStatus:String,
    paymentsReceived: BigDecimal,
    issueDate: Option[ZonedDateTime],
    orderDate: ZonedDateTime,
    purpose:String) {

  val termEnum = term match {
    case 24 => Term._24
    case 36 => Term._36
    case 60 => Term._60
    case _  => throw new IllegalArgumentException("unsupported term")
  }

  val gradeEnum = Grade.withName(grade)
}