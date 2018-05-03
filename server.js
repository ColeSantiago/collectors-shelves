const express = require("express");
const bodyParser = require("body-parser");
const session = require('client-sessions');
const env = require('dotenv').config();

const PORT = process.env.PORT || 3001;

let models = require('./models');
models.sequelize.sync();

// Creating express app and configuring middleware needed for authentication
let app = express();

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("client/build"));

// session handler middleware
app.use(
	session({
  		cookieName: 'mySession', // cookie name dictates the key name added to the request object 
  		secret: 'thisisasecretkept', // should be a large unguessable string 
  		duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms 
  		activeDuration: 1000 * 60 * 5 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds 
	})
);

const routes = require("./routes");

app.use(routes);

models.sequelize.sync().then(function () {
	app.listen(PORT, function() {
      	console.log("App now listening at localhost:" + PORT);
  	});
});
