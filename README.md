Dashboard
=========
[![Circle CI](https://circleci.com/gh/latticemarkets/dashboard.svg?style=svg&circle-token=3b3c7b821631e065d45a49e3960e361f56f7717d)](https://circleci.com/gh/latticemarkets/dashboard)

##TODO

At some point, description of the project structure + instructions of how to run + guidelines + etc

##How to run

###Front-end
 
 * Go to `./public`
 * Install all NPM dependencies : `npm install`
 * Prepare the front end : `grunt` (you can also use `grunt dev` to avoid js minification). This will run JsHint on the code, install required Bower dependencies, concat and minify the front-end. You can then let the watch running to let it run the Grunt tasks when a file is modified.
 
###Back-end
 * Go back to root directory
 * Run MongoDB's deamon : `mongod`.
 * Create the tailable collection in Mongo : `use lattice; db.createCollection('rfqs', { capped: true, size: 10000 })` in Mongo console.
 * Run play. In dev mode, the best way is to run `./activator ui` and use it to compile and run. For an unknown reason this is the only way to use automatic compilation and avoid crashes ...
 * You can access the application following `http://localhost:9000`