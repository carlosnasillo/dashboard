package com.lattice.lib.integration.lc.impl

import org.scalatest._
import java.time.ZonedDateTime
import com.lattice.lib.integration.lc.model.Transaction
import com.lattice.lib.integration.lc.model.LendingClubNote
import com.lattice.lib.integration.lc.model.LoanStatus
import com.lattice.lib.integration.lc.model.PortfolioDetails
import com.lattice.lib.portfolio.AccountBalance
import com.lattice.lib.integration.lc.model.OrderPlaced

/**
 * @author ze97286
 */
class PortfolioSpec extends FlatSpec {

  behavior of "totalTransactions"
  it should "return the total balance of transactions - given a sequence of transactions return the sum of transaction.amount" in {
    assert(Portfolio.totalTransactions(Seq()) == 0)
    assert(Portfolio.totalTransactions(Seq(Transaction("a", ZonedDateTime.now, 100))) == 100)
    assert(Portfolio.totalTransactions(Seq(Transaction("a", ZonedDateTime.now, 100), Transaction("a", ZonedDateTime.now, -100))) == 0)
  }

  val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.InReview.toString, "A", 1000, 100, None, 100, 10, 50, 50, 10, 1, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
  val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.InFunding.toString, "B", 1000, 200, None, 200, 20, 100, 50, 20, 2, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
  val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issuing.toString, "C", 1000, 300, None, 300, 10, 150, 200, 30, 3, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
  val note4 = LendingClubNote(4, 4, 4, Some("zohar"), 10d, 24, LoanStatus.NotYetIssued.toString, "D", 1000, 400, None, 400, 20, 200, 50, 40, 4, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
  val note5 = LendingClubNote(5, 5, 5, Some("zohar"), 10d, 24, LoanStatus.PartiallyFunded.toString, "D", 1000, 500, None, 500, 20, 250, 50, 50, 5, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
  val note6 = LendingClubNote(6, 6, 6, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "D", 1000, 600, None, 600, 20, 300, 50, 60, 6, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
  val note7 = LendingClubNote(7, 7, 7, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "D", 1000, 700, None, 700, 20, 350, 50, 70, 7, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)

  behavior of "totalPaymentReceived"
  it should "return the total sum of payment received for the notes in a given sequence" in {
    assert(Portfolio.totalPaymentReceived(Seq()) == 0)
    assert(Portfolio.totalPaymentReceived(Seq(note1, note2, note3, note4)) == (100 + 200 + 300 + 400))
  }

  behavior of "totalInvested"
  it should "return the total sum of notes amount for the notes in a given sequence whose loan status is not in (InReview,InFunding,Issuing,NotYetIssued,PartiallyFunded)" in {
    assert(Portfolio.totalInvested(Seq()) == 0)
    assert(Portfolio.totalInvested(Seq(note1, note2, note3, note4, note5, note6, note7)) == (600 + 700))
  }

  behavior of "totalPending"
  it should "return the total sum of notes amount for the notes in a given sequence whose loan status is in (InReview,InFunding,Issuing,NotYetIssued,PartiallyFunded)" in {
    assert(Portfolio.totalPending(Seq()) == 0)
    assert(Portfolio.totalPending(Seq(note1, note2, note3, note4, note5, note6, note7)) == (100 + 200 + 300 + 400 + 500))
  }

  behavior of "totalPrincipalOutstanding"
  it should "return the total sum of principal pending for the notes in a given sequence" in {
    assert(Portfolio.totalPrincipalOutstanding(Seq()) == 0)
    assert(Portfolio.totalPrincipalOutstanding(Seq(note1, note2, note3, note4, note5, note6, note7)) == (50 + 100 + 150 + 200 + 250 + 300 + 350))
  }

  behavior of "totalPrincipalReceived"
  it should "return the total sum of principal received for the notes in a given sequence" in {
    assert(Portfolio.totalPrincipalReceived(Seq()) == 0)
    assert(Portfolio.totalPrincipalReceived(Seq(note1, note2, note3, note4, note5, note6, note7)) == (10 + 20 + 30 + 40 + 50 + 60 + 70))
  }

  behavior of "totalInterestReceived"
  it should "return the total sum of interest received for the notes in a given sequence" in {
    assert(Portfolio.totalInterestReceived(Seq()) == 0)
    assert(Portfolio.totalInterestReceived(Seq(note1, note2, note3, note4, note5, note6, note7)) == (1 + 2 + 3 + 4 + 5 + 6 + 7))
  }

  behavior of "totalAvailableCash"
  it should "return the total of transations and received cash minus invested minus pending" in {
    assert(Portfolio.totalAvailableCash(100, 200, 50, 80) == 170)
  }

  behavior of "calculate account balance"
  it should "return the account balance corresponding to the sequence of transactions (transfers and withdrawls) and the sequence of owned notes" in {
    assert(Portfolio.calculateAccountBalance(PortfolioDetails(1, "zohar", "Test"), Seq(), Seq()) == AccountBalance("zohar", 0, 0, 0, 0, 0, 0, 0, 0))
    assert(Portfolio.calculateAccountBalance(PortfolioDetails(1, "zohar", "Test"),
      Seq(Transaction("a", ZonedDateTime.now, 200), Transaction("a", ZonedDateTime.now, -100)),
      Seq(note1, note2, note3, note4, note5, note6, note7)) == AccountBalance("zohar", 100, 1300, 1500, 1400, 280, 28, 2800, 0))
  }

  val order1 = OrderPlaced("zohar", 1, 1, Some(1), note1.noteAmount, note1.orderDate, None, note1.paymentsReceived, note1.loanStatus)
  val order7 = OrderPlaced("zohar", 7, 7, Some(7), note7.noteAmount, note7.orderDate, Some(""), note7.paymentsReceived, note7.loanStatus)

  behavior of "processNotesWithMissingOrders"
  it should "return a sequence of order placed instances matching newly created orders that have notes and are missing in the given orders list" in {
    assert(Portfolio.processNotesWithMissingOrders(PortfolioDetails(1, "zohar", "Test"), Seq(), Seq()) == Seq())
    assert(Portfolio.processNotesWithMissingOrders(PortfolioDetails(1, "zohar", "Test"), Seq(note1), Seq()) == Seq(order1))
    assert(Portfolio.processNotesWithMissingOrders(PortfolioDetails(1, "zohar", "Test"), Seq(note1), Seq(order1)) == Seq())
    assert(Portfolio.processNotesWithMissingOrders(PortfolioDetails(1, "zohar", "Test"), Seq(note1, note7), Seq(order1)) == Seq(order7))
    assert(Portfolio.processNotesWithMissingOrders(PortfolioDetails(1, "zohar", "Test"), Seq(note1, note7), Seq(order1, order7)) == Seq())
    assert(Portfolio.processNotesWithMissingOrders(PortfolioDetails(1, "zohar", "Test"), Seq(note1, note7), Seq(order7)) == Seq(order1))
  }
}