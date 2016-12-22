var express = require('express');
var router = express.Router();

/* GET api page. */
router.get('/api', function(req, res, next) {
  res.render('api', { title: 'Welcome to API' });
});

module.exports = router;
