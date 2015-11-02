package com.lattice.lib.integration.lc.impl

import org.scalatest._
import com.lattice.lib.integration.lc.model.LendingClubNote
import java.time.ZonedDateTime
import com.lattice.lib.integration.lc.model.LoanStatus
import models.Grade
import models.Term

/**
 * @author ze97286
 */
class PortfolioAnalyticsSpec extends FlatSpec {
  behavior of "principal outstanding"

  it should "return 0 given an empty sequence of notes" in {
    assert(PortfolioAnalytics.principalOutstanding(Seq()) === 0)
  }

  it should "return 900 given two notes with total principal outstanding (the sum of the individual principal outstanding" in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 110, 10, 500, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    assert(PortfolioAnalytics.principalOutstanding(Seq(note1, note2)) === 900)
  }

  behavior of "pending investment"

  it should "return 0 given an empty sequence of notes" in {
    assert(PortfolioAnalytics.pendingInvestment(Seq()) === 0)
  }

  it should "return 0 given a sequence of notes with with no note in a loan status of pending" in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 110, 10, 500, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    assert(PortfolioAnalytics.pendingInvestment(Seq(note1)) === 0)
    assert(PortfolioAnalytics.pendingInvestment(Seq(note1, note2)) === 0)
  }

  it should "return 100 given a sequence of notes with one note in pending loan status each with a note amount of 100 and another issued note in issued loan status with a note amount of 200" in {
    val inFunding = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.InFunding.toString, "A", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val inReview = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.InReview.toString, "B", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val issuing = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issuing.toString, "B", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val notYetIssued = LendingClubNote(4, 4, 4, Some("zohar"), 10d, 24, LoanStatus.NotYetIssued.toString, "B", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val partiallyFunded = LendingClubNote(5, 5, 5, Some("zohar"), 10d, 24, LoanStatus.PartiallyFunded.toString, "B", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val issued = LendingClubNote(5, 5, 5, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 200, None, 110, 10, 200, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)

    assert(PortfolioAnalytics.pendingInvestment(Seq(inFunding, issued)) === 100)
    assert(PortfolioAnalytics.pendingInvestment(Seq(inReview, issued)) === 100)
    assert(PortfolioAnalytics.pendingInvestment(Seq(issuing, issued)) === 100)
    assert(PortfolioAnalytics.pendingInvestment(Seq(notYetIssued, issued)) === 100)
    assert(PortfolioAnalytics.pendingInvestment(Seq(partiallyFunded, issued)) === 100)
  }

  it should "return 500 given a sequence of notes with one note in each of the pending loan status each with outsanding principal of 100 and another issued loan with note amount of 200" in {
    val inFunding = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.InFunding.toString, "A", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val inReview = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.InReview.toString, "B", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val issuing = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issuing.toString, "B", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val notYetIssued = LendingClubNote(4, 4, 4, Some("zohar"), 10d, 24, LoanStatus.NotYetIssued.toString, "B", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val partiallyFunded = LendingClubNote(5, 5, 5, Some("zohar"), 10d, 24, LoanStatus.PartiallyFunded.toString, "B", 1000, 100, None, 110, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val issued = LendingClubNote(5, 5, 5, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 200, None, 110, 10, 200, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)

    assert(PortfolioAnalytics.pendingInvestment(Seq(inFunding, inReview, issuing, notYetIssued, partiallyFunded, issued)) === 500)

  }

  behavior of "payment received"

  it should "return 0 given an empty sequence of notes" in {
    assert(PortfolioAnalytics.paymentsReceived(Seq()) === 0)
  }

  it should "return 300  given a sequence of notes with two notes with total payment received of 300 and one note with 0 payment received" in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 200, 10, 500, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 0, 10, 500, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)

    assert(PortfolioAnalytics.paymentsReceived(Seq(note1, note2, note3)) === 300)
  }

  behavior of "prinicipal received"

  it should "return 0 given an empty sequence of notes" in {
    assert(PortfolioAnalytics.principalReceived(Seq()) === 0)
  }

  it should "return 300 given an sequence of notes with one note with 100 principal received, one note with 200 prinicipal received and one note with 0 principal received" in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 200, 10, 500, 50, 200, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 0, 10, 500, 50, 0, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    assert(PortfolioAnalytics.principalReceived(Seq(note1, note2, note3)) === 300)
  }

  behavior of "interest received"

  it should "return 0 given an empty sequence of notes" in {
    assert(PortfolioAnalytics.interestReceived(Seq()) === 0)
  }

  it should "return 30 given an sequence of notes with one note with 10 interest received, one note with 20 interest received and one note with 0 interest received" in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 200, 20, 500, 50, 200, 20, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 0, 0, 500, 50, 300, 0, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    assert(PortfolioAnalytics.interestReceived(Seq(note1, note2, note3)) === 30)
  }

  behavior of "notes by grade"

  it should "return an empty map given an empty sequence of notes" in {
    assert(PortfolioAnalytics.notesByGrade(Seq()) === Map())
  }

  it should "return a map with key=grade and value is the number of notes per grade in the given sequence of note, so given 1 note of each of the grades in A,B,C,D,E,F,G it should return map of the grade to 1" in {
    val notes = Seq("A", "B", "C", "D", "E", "F", "G").zipWithIndex.toSeq.map {
      case (x, i) =>
        LendingClubNote(i + 1, i + 2, i + 3, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, x, 1000, 500, None, 100, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    }
    val gradeToNotes = Seq("A", "B", "C", "D", "E", "F", "G").map(x => Grade.withName(x) -> 1).toMap

    assert(PortfolioAnalytics.notesByGrade(notes) === gradeToNotes)
  }

  behavior of "notes by state"

  it should "return an empty map given an empty sequence of notes" in {
    assert(PortfolioAnalytics.notesByState(Seq()) === Map())
  }

  it should "return a map with key=state and value is the number of notes per state in the given sequence of notes, so given 1 note of each of the states in LoanStatus it should return map of the state to 1" in {
    val notes = LoanStatus.values.toSeq.zipWithIndex.toSeq.map {
      case (x, i) =>
        LendingClubNote(i + 1, i + 2, i + 3, Some("zohar"), 10d, 24, x.toString, "A", 1000, 500, None, 100, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    }
    val stateToNotes = LoanStatus.values.map(x => x.toString -> 1).toMap

    assert(PortfolioAnalytics.notesByState(notes) === stateToNotes)
  }

  behavior of "notes by state by grade"

  it should "return an empty map given an empty sequence of notes" in {
    assert(PortfolioAnalytics.notesByStateByGrade(Seq()) === Map())
  }

  it should "return a map of state string to a map of grade to 1 for each loan status and each grade in the set A,B,C,D,E,F,G" in {
    val notes = LoanStatus.values.toSeq.zipWithIndex.toSeq.map {
      case (x, i) =>
        Seq("A", "B", "C", "D", "E", "F", "G") map (grade => LendingClubNote(i + 1, i + 2, i + 3, Some("zohar"), 10d, 24, x.toString, grade, 1000, 500, None, 100, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now))
    }.flatten

    val notesByStateByGrade = LoanStatus.values.toSeq.map(x => x.toString -> Seq("A", "B", "C", "D", "E", "F", "G").map(grade => Grade.withName(grade) -> 1).toMap).toMap
    assert(PortfolioAnalytics.notesByStateByGrade(notes) === notesByStateByGrade)
  }

  behavior of "principal outstanding by grade"

  it should "return an empty map for an empty sequence of notes" in {
    assert(PortfolioAnalytics.principalOutstandingByGrade(Seq()) === Map())
  }

  it should "return a map of grade to outstanding principal, giving a sequence of notes with " in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 200, 20, 200, 50, 200, 20, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "C", 1000, 500, None, 100, 10, 300, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note4 = LendingClubNote(4, 4, 4, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "D", 1000, 500, None, 200, 20, 400, 50, 200, 20, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)

    val note5 = LendingClubNote(5, 5, 5, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 200, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note6 = LendingClubNote(6, 6, 6, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 200, 20, 300, 50, 200, 20, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val note7 = LendingClubNote(7, 7, 7, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "C", 1000, 500, None, 100, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note8 = LendingClubNote(8, 8, 8, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "D", 1000, 500, None, 200, 20, 500, 50, 200, 20, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)

    val notes = Seq(note1, note2, note3, note4, note5, note6, note7, note8)

    val gradeToOutstanding = Map(Grade.A -> 300, Grade.B -> 500, Grade.C -> 700, Grade.D -> 900)
    assert(PortfolioAnalytics.principalOutstandingByGrade(notes) === gradeToOutstanding)
  }

  behavior of "principal outstanding by yield"

  it should "return an empty map for an empty sequence of notes" in {
    assert(PortfolioAnalytics.principalOutstandingByYield(Seq()) === Map())
  }

  it should "" in {
    val notes = PortfolioAnalytics.InterestRateBuckets.map {
      case (low, high) => {
        Seq(
          LendingClubNote(1, 1, 1, Some("zohar"), low, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now),
          LendingClubNote(2, 2, 2, Some("zohar"), (low + high) / 2d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 200, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now),
          LendingClubNote(3, 3, 3, Some("zohar"), high, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 300, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now))
      }
    }.flatten
    val yieldToOutstanding = PortfolioAnalytics.InterestRateBuckets.map {
      case (low, high) => (low, high) -> (100 + 200 + 300)
    }.toMap

    assert(PortfolioAnalytics.principalOutstandingByYield(notes) === yieldToOutstanding)
  }

  behavior of "principal outstanding by term"

  it should "return an empty map for an empty sequence of notes" in {
    assert(PortfolioAnalytics.principalOutstandingByTerm(Seq()) === Map())
  }

  it should "" in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 200, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10, 60, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 300, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note4 = LendingClubNote(4, 4, 4, Some("zohar"), 10, 60, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)

    val notes = Seq(note1, note2, note3, note4)

    val termToOutstanding = Map(Term._24 -> 300, Term._60 -> 700)
    assert(PortfolioAnalytics.principalOutstandingByTerm(notes) === termToOutstanding)
  }

  behavior of "principal outstanding by state"

  it should "return an empty map for an empty sequence of notes" in {
    assert(PortfolioAnalytics.principalOutstandingByState(Seq()) === Map())
  }

  it should "" in {
    val notes = LoanStatus.values.toSeq.zipWithIndex.toSeq.map {
      case (x, i) =>
        Seq(LendingClubNote(i + 1, i + 2, i + 3, Some("zohar"), 10d, 24, x.toString, "A", 1000, 500, None, 100, 10, 100 * (i + 1), 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now),
          LendingClubNote(i + 2, i + 3, i + 4, Some("zohar"), 10d, 24, x.toString, "A", 1000, 500, None, 100, 10, 200 * (i + 2), 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now))
    }.flatten
    val stateToOutstanding = LoanStatus.values.zipWithIndex.toSeq.map { case (x, i) => x.toString -> (100 * (i + 1) + 200 * (i + 2)) }.toMap
    assert(PortfolioAnalytics.principalOutstandingByState(notes) === stateToOutstanding)
  }

  behavior of "principal outstanding by state by grade"

  it should "return an empty map for an empty sequence of notes" in {
    assert(PortfolioAnalytics.principalOutstandingByStateByGrade(Seq()) === Map())
  }

  it should "" in {
    val notes = LoanStatus.values.toSeq.zipWithIndex.toSeq.map {
      case (x, i) =>
        Seq("A", "B", "C", "D", "E", "F", "G") map (grade =>
          Seq(LendingClubNote(i + 1, i + 2, i + 3, Some("zohar"), 10d, 24, x.toString, grade, 1000, 500, None, 100, 10, 100 * (i + 1), 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now),
            LendingClubNote(i + 2, i + 3, i + 4, Some("zohar"), 10d, 24, x.toString, grade, 1000, 500, None, 100, 10, 200 * (i + 2), 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)))
    }.flatten.flatten

    val principalByStateByGrade = LoanStatus.values.toSeq.zipWithIndex.map { case (x, i) => x.toString -> Seq("A", "B", "C", "D", "E", "F", "G").map { case grade => Grade.withName(grade) -> (100 * (i + 1) + 200 * (i + 2)) }.toMap }.toMap
    assert(PortfolioAnalytics.principalOutstandingByStateByGrade(notes) === principalByStateByGrade)
  }

  behavior of "current notes"

  it should "return an 0 for an empty sequence of notes" in {
    assert(PortfolioAnalytics.currentNotes(Seq()) === 0)
  }

  it should "return an 0 for a sequence of notes where none has pendingPrincipal>0" in {

    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 0, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 0, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    assert(PortfolioAnalytics.currentNotes(Seq(note1, note2)) === 0)
  }

  it should "return 2 for a sequence of notes where 2 have pendingPrincipal > 0" in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 0, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 100, 10, 100, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)

    assert(PortfolioAnalytics.currentNotes(Seq(note1, note2, note3)) === 2)
  }

  behavior of "notes cache"

  it should "return an empty map" in {
    assert(PortfolioAnalytics.notesCache(Seq()) === Map())
  }

  it should "return a map with two entries" in {
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)

    val notes = Seq(note1, note2)
    assert(PortfolioAnalytics.notesCache(notes) === Map(note1.noteId -> note1, note2.noteId -> note2))
  }

  behavior of "notes by date"

  it should "return an empty map" in {
    assert(PortfolioAnalytics.notesByDate(Seq()) === Map())
  }

  it should "return an map indexed by date with two entries where key is the date and value is a sequence of notes with one entry each" in {
    val today = ZonedDateTime.now.toLocalDate
    val yesterday = today.minusDays(1)
    val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
    val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
    val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now.minusDays(1), "home_improvement", ZonedDateTime.now)
    assert(PortfolioAnalytics.notesByDate(Seq(note1, note2, note3)) === Map(today -> Seq(note1, note2), yesterday -> Seq(note3)))
  }

  behavior of "behavior of notes by notes for range"

  val today = ZonedDateTime.now
  val yesterday = today.minusDays(1)
  val note1 = LendingClubNote(1, 1, 1, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "A", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "medical", ZonedDateTime.now)
  val note2 = LendingClubNote(2, 2, 2, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now, "home_improvement", ZonedDateTime.now)
  val note3 = LendingClubNote(3, 3, 3, Some("zohar"), 10d, 24, LoanStatus.Issued.toString, "B", 1000, 500, None, 110, 10, 400, 50, 100, 10, None, Some(ZonedDateTime.now), ZonedDateTime.now.minusDays(1), "home_improvement", ZonedDateTime.now)
  it should "return only today's notes mapped to today's local date given a sequence of notes with various dates only 2 of which are today's and a date range from today to today" in {
    assert(PortfolioAnalytics.notesForRange(PortfolioAnalytics.notesByDate(Seq(note1, note2, note3)), today.toLocalDate,  today.toLocalDate) == Map(today.toLocalDate->Seq(note1,note2)))
  }

  it should "return no notes given notes and a date range for which none of the notes are in" in {
    assert(PortfolioAnalytics.notesForRange(PortfolioAnalytics.notesByDate(Seq(note1, note2, note3)), today.minusYears(2).toLocalDate,  today.minusYears(1).toLocalDate) == Map())
  }

  it should "return all notes given notes and a date range for which all of the notes are in" in {
    assert(PortfolioAnalytics.notesForRange(PortfolioAnalytics.notesByDate(Seq(note1, note2, note3)), yesterday.toLocalDate,  today.toLocalDate) == Map(today.toLocalDate->Seq(note1,note2),yesterday.toLocalDate->Seq(note3)))
  }
  
  behavior of "notes acquired today"
  
  it should "return 0 given an empty map of notes per date" in {
    assert(PortfolioAnalytics.notesAcquiredToday(Map())==0)
  }
  
  it should "return 0 given a map of date to note such that no notes are mapped to today" in {
    assert(PortfolioAnalytics.notesAcquiredToday(PortfolioAnalytics.notesByDate(Seq(note3)))==0)
  }
  
  it should "return the number size of the sequence of notes mapped to today in the given input map of date to sequence of notes" in {
    assert(PortfolioAnalytics.notesAcquiredToday(PortfolioAnalytics.notesByDate(Seq(note1,note2,note3)))==2)
  }
  
  //TODO
//  behavior of "notes acquired today by grade"
//
//  behavior of "notes acquired today by yield"
//  
//  behavior of "notes acquired today by purpose"
//  
//  behavior of "notes acquired within date range"
//  
//  behavior of "notes acquired within date range"
//
//  behavior of "notes acquired within date range by yield"
//  
//  behavior of "notes acquired within date range by purpose"

  
  
  //notesAcquired
  //notesAcquiredByGrade
  //notesAcquiredByYield
  //notesAcquiredByPurpose

}