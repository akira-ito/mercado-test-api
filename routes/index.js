const express = require('express'),
	router = express.Router(),
 	ItemsRouter = require('./items');

//router.all('*', requireAuthentication);
router.use('/items', ItemsRouter);

module.exports = router;
