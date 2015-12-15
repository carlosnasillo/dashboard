import com.lattice.lib.integration.lc.LendingClubFactory
import play.api.{GlobalSettings, Logger}
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.libs.Akka
import com.lattice.lib.utils.DbUtil
import scala.language.postfixOps

import scala.concurrent.duration.DurationInt

class AppGlobal extends GlobalSettings {

  override def onStart(app: play.api.Application) {
    Logger.info("Application has started")
//    start
  }
  
  def start() {
    Akka.system.scheduler.schedule(0 seconds, 2 hours) {
      Logger.info("reconciling loans")
      LendingClubFactory.analytics.loadLoansFromMarket
    }
    Akka.system.scheduler.schedule(0 seconds, 6 hours) {
      LendingClubFactory.portfolio.reconcilePortfolio
    }
  }
  
  override def onStop(app: play.api.Application) {
    Logger.info("Application shutdown...")
    DbUtil.closeDriver
  }
}


    
