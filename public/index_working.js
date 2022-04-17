#!/usr/bin/nodejs


// -------------- load packages -------------- //
var express = require('express');
var app = express();

var hbs = require('hbs');
var https = require('https');

var data = '';
const Geocodio = require('geocodio-library-node');
const geocoder = new Geocodio('0b1859b134514599962b15635bf933423b356b2');

// const {google} = require('googleapis');
// const civicinfo = google.civicinfo('v2');

// -------------- express initialization -------------- //

// tell express that the view engine is hbs
app.set('view engine', 'hbs');

// serve files from the static directory (https://expressjs.com/en/starter/static-files.html)
// the following line is a directive to serve all files in all subfolders 
app.use(express.static('static'));


// -------------- express 'get' handlers -------------- //

app.get('/', function(req, res){

	// get latitute and longitude


    // render the template
    res.render('index');

});

app.get('/reps', function(req, res){


		if('lat' in req.query){

			var lat = Number(req.query.lat);
			var long = Number(req.query.long);

			geocoder.reverse(""+lat +"," + long)
			  .then(response => {
			     // address = response[0].formatted_address;
			     var data = response.results[0].formatted_address;
			     console.log(data.replace(' ', '%20'));
			  })
			  .catch(err => {
			    console.error(err);
			  }
			);
		}


    console.log(data)

/*
//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
var options = {
	host: 'www.googleapis.com',
	path: '/civicinfo/v2/representatives?key=AIzaSyCrL1K45L0blXvtPod35xY1Bo0-qBJAOOc&address=1263%20Pacific%20Ave.%20Kansas%20City%20KS'
  };

var repsJSON;
  
  callback = function(response) {
	var str = '';
  
	//another chunk of data has been received, so append it to `str`
	response.on('data', function (chunk) {
	  str += chunk;
	});
  
	//the whole response has been received, so we just print it out here
	response.on('end', function () {
		repsJSON = JSON.parse(str);
	  console.log(repsJSON);
	});
  }
  
  https.request(options, callback).end();
  */

 	res.render('reps')
});
 

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});