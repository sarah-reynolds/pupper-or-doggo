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

var multer = require('multer');
var upload = multer({dest: 'public/images'});
var type = upload.single('imageToUpload');
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {



	var getImagesQuery = "SELECT * FROM images";

	getImagesQuery = "SELECT * FROM images WHERE id NOT IN (SELECT imageid FROM votes WHERE ip = '"+req.ip+"');"

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

// router.get('/vote/:voteDirection/:imageID', (req, res, next)=>{
// 	// res.json(req.params.voteDirection)
// 	var imageID = req.params.imageID;
// 	var voteD = req.params.voteDirection;
// 	var insertVoteQuery = "INSERT INTO votes (ip, imageid, votedirection) VALUES ('"+req.ip+"',"+imageID+",'"+voteD+"')"
// 	// res.send(insertVoteQuery)
// 	connection.query(insertVoteQuery, (error, results, fields)=>{
// 		if (error) throw error;
// 		res.redirect('/');
// 	})
// })

router.get('/vote/:voteDirection/:imageID', (req, res, next)=>{
	// res.json(req.params)
	var imageID = req.params.imageID;
	var voteD = req.params.voteDirection;
	var voteUp = 1;
	var insertVoteQuery = "INSERT INTO votes (ip, imageid, "+voteD+") VALUES ('"+req.ip+"',"+imageID+","+voteUp+");"
	// res.send(insertVoteQuery)
	connection.query(insertVoteQuery, (error, results, fields)=>{
		if (error) throw error;
		res.redirect('/');
	})
})

// router.get('/vote/:voteDirection/:imageID', (req, res, next)=>{
// 	// res.json(req.params.voteDirection)
// 	var imageID = req.params.imageID;
// 	var voteD = req.params.voteDirection;
// 	var insertVoteQuery = "INSERT INTO votes (ip, imageid, votedirection) VALUES ('"+req.ip+"',"+imageID+",'"+voteD+"')"
// 	// res.send(insertVoteQuery)
// 	connection.query(insertVoteQuery, (error, results, fields)=>{
// 		if (error) throw error;
// 		res.redirect('/');
// 	})
// })

/* GET standings page */
router.get('/standings', function(req, res, next) {
  // res.render('standings', { title: 'Standings' });
  var getStandingsQuery = "SELECT DISTINCT imageid, imageurl, SUM(votepupper) AS votepupper, SUM(votedoggo) AS votedoggo FROM votes LEFT JOIN images ON images.id = votes.imageid GROUP BY votes.imageid;"
  connection.query(getStandingsQuery, (error, results, fields)=>{
  	if (error) throw error;
  	// res.json(results)
  	res.render('standings', { results: results });
  })
  
});

router.get('/testQ', (req, res, next)=>{
	// var id = 2;
	// var query = "SELECT * FROM images WHERE id > ?";

	// connection.query(query, [id], (error, results, fields)=>{
	// 	res.json(results);
	// })
	var imageIdVoted = 3;
	var voteDirection = "doggo";
	var insertQuery = "INSERT INTO votes (ip, imageid, votedirection) VALUES (?,'2','doggo')"
	connection.query(insertQuery, [req.ip, imageIdVoted, voteDirection], (error, results, fields)=>{
		var query = "SELECT * FROM votes";
		connection.query(query, (error, results, fields)=>{
			res.json(results);
		})
	})
})

router.get('/uploadImage', (req, res, next)=>{
	res.render('uploadImage', {});
})

router.post('/formSubmit', type, (req, res, next)=>{
	var tempPath = req.file.path;
	var targetPath = 'public/images/'+req.file.originalname;
	fs.readFile(tempPath, (error, fileContents)=>{
		fs.writeFile(targetPath, fileContents, (error)=>{
			if (error) throw error;
			var insertQuery = "INSERT INTO images (imageurl) VALUE (?)";
			connection.query(insertQuery, [req.file.originalname], (dberror, results, fields)=>{
				if (error) throw error;
				res.redirect('/?file="uploaded"')
			})
			// res.json("uploaded")
		})
	})
	// res.json(req.file);
})

module.exports = router;
