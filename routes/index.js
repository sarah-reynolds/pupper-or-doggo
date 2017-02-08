var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET standings page */
router.get('/standings', function(req, res, next) {
  res.render('standings', { title: 'Express' });
});

module.exports = router;
