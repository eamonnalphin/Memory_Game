var express = require('express');
var router = express.Router();

/* GET Summary page. */
router.get('/', function(req, res, next) {
    res.render('summary', {
        title: 'Summary'
    });
});



module.exports = router;
