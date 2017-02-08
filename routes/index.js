var express = require('express');
var router = express.Router();
var config = require('../config/config');
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
})

connection.connect();

/* GET home page. */
router.get('/', function(req, res, next) {



	var getImagesQuery = "SELECT * FROM images";

	getImagesQuery = "SELECT * FROM images WHERE id NOT IN (SELECT imageid FROM votes WHERE ip = '"+req.ip+"')"

	connection.query(getImagesQuery, (error, results, fields)=>{
		var randomIndex = (Math.floor(Math.random() * results.length));
		// res.json(results);
		// res.json(results[randomIndex])
		
		if(results.length === 0){
			res.render('index', { msg: "noImages" });
		}else{

			res.render('index', { 
				title: 'Pupper or Doggo',
				imageToRender: '/images/'+results[randomIndex].imageurl,
				imageID: results[randomIndex].id
			});
		}
	});
});

router.get('/vote/:voteDirection/:imageID', (req, res, next)=>{
	// res.json(req.params.voteDirection)
	var imageID = req.params.imageID;
	var voteD = req.params.voteDirection;
	var insertVoteQuery = "INSERT INTO votes (ip, imageid, votedirection) VALUES ('"+req.ip+"',"+imageID+",'"+voteD+"')"
	// res.send(insertVoteQuery)
	connection.query(insertVoteQuery, (error, results, fields)=>{
		if (error) throw error;
		res.redirect('/');
	})
})

/* GET standings page */
router.get('/standings', function(req, res, next) {
  res.render('standings', { title: 'Standings' });
});

module.exports = router;
