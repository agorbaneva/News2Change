#!/usr/bin/nodejs


// -------------- load packages -------------- //
var express = require('express');
var app = express();

const path = require('path');
var https = require('https');
const fs = require('fs')
const request = require('request')


const Geocodio = require('geocodio-library-node');
const geocoder = new Geocodio('0b1859b134514599962b15635bf933423b356b2');

// -------------- express initialization -------------- //

// tell express that the view engine is hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));
app.use('/js', express.static(__dirname + '/js'));

// serve files from the static directory (https://expressjs.com/en/starter/static-files.html)
// the following line is a directive to serve all files in all subfolders 
app.use(express.static('static'));

// -------------- express 'get' handlers -------------- //

app.get('/', function(req, res){
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
				if(!response || !response.results || !response.results[0]){
					res.send('<p>Error loading coordinates, most likely outside the US</p>');
				}
				var actualAddress = response.results[0].formatted_address;
				const search = ' ';
				const replaceWith = '%20';
				var address = actualAddress.split(search).join(replaceWith);
				console.log(address)


			var url = "www.googleapis.com/civicinfo/v2/representatives?key=AIzaSyCrL1K45L0blXvtPod35xY1Bo0-qBJAOOc&address=" + address
			console.log(url)

			const options = {
			  hostname: 'www.googleapis.com',
			  port: 443,
			  path: '/civicinfo/v2/representatives?key=AIzaSyCrL1K45L0blXvtPod35xY1Bo0-qBJAOOc&address=' + address,
			  method: 'GET',
			  headers: {
				'Accept': 'plain/html',
				'Accept-Encoding': '*',
			  }
			}


					https.get(options, function(response) {


						var rawData = '';

						response.on('data', function(chunk) {
							rawData += chunk;

						});

						response.on('end', function() {

						  obj = JSON.parse(rawData);
						  var senator1 = obj.officials[2]
						  var senator2 = obj.officials[3]
						  var local_rep = obj.officials[4]
						  var governor = obj.officials[5]

							const download = (url, path, callback) => {
							  request.head(url, (err, res, body) => {
								request(url)
								  .pipe(fs.createWriteStream(path))
								  .on('close', callback)
							  })
							}

							const reps = [senator1, senator2, local_rep, governor]
							const titles = ["Senator 1", "Senator 2", "House of Representatives", "Governor"]
							const paths = ['./static/img/senator1.png', './static/img/senator2.png', './static/img/local_rep.png', './static/img/governor.png']

							out = {address: actualAddress, representatives:[]}

							reps.forEach(function (rep, i) {
								var item = {name:rep.name, 
												photoUrl:rep.photoUrl ? rep.photoUrl : "https://upload.wikimedia.org/wikipedia/commons/4/4b/Seal_of_the_United_States_Congress.svg", 
												party:rep.party, 
												site:rep.urls[0],
												email: rep.emails ? rep.emails[0] : null,
												position:titles[i]}
								out.representatives.push(item)

							});
							res.render("reps", {object: out})
					});

				}).on('error', function(e){
					console.error(e);

				}).end();

		  })
		  .catch(err => {
			console.error(err);
		  }
		);

	}
});
 

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});
