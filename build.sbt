name := """dashboard"""

version := "1.0-SNAPSHOT"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.7"

libraryDependencies ++= Seq(
  jdbc,
  cache,
  ws,
  specs2 % Test
)

libraryDependencies ++= Seq(
  "org.reactivemongo" %% "play2-reactivemongo" % "0.11.7.play24",
  "org.mindrot" % "jbcrypt" % "0.3m",
  "org.scalatestplus" %% "play" % "1.4.0-M3" % "test",
  "org.scalaz" %% "scalaz-core" % "7.1.5"
)

libraryDependencies +=  "org.scalaj" %% "scalaj-http" % "1.1.5"
libraryDependencies += "org.scalatest" % "scalatest_2.11" % "2.2.4" % "test"

resolvers += "scalaz-bintray" at "http://dl.bintray.com/scalaz/releases"

// Play provides two styles of routers, one expects its actions to be injected, the
// other, legacy style, accesses its actions statically.
routesGenerator := InjectedRoutesGenerator


fork in run := true

javaOptions in Test += "-Dconfig.file=conf/application.test.conf"