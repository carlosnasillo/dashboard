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
    grade:Grade.Value, 
    interestRate: Double, 
    term:Term.Value, 
    loanStatus:String,
    paymentsReceived: BigDecimal,
    issueDate: Option[ZonedDateTime],
    orderDate: ZonedDateTime,
    purpose:String)