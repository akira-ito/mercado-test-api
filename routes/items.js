const express = require('express'),
	router = express.Router(),
	Errors = require('../lib/errors'),
	ItemsController = require('../controllers/items');

router.get('/', function(req, res, next) {
	const query = req.query.search || req.query.q || "";

	ItemsController.search(query)
		.then(data => {
  			res.json(data);
		}).catch(Errors.ErrorMercadoTest, err => {
			res.status(err.status).json(err);
		}).catch(err => {
			res.status(400).json(new Errors.ErrorMercadoTest('There was an unexpected problem', 'bad_request', 400));
		});
});

router.get('/:id', function(req, res, next) {
	const id = req.params.id;

	ItemsController.find(id)
		.then(data => {
  			res.json(data);
		}).catch(Errors.ErrorMercadoTest, err => {
			res.status(err.status).json(err);
		}).catch(err => {
			res.status(400).json(new Errors.ErrorMercadoTest('There was an unexpected problem', 'bad_request', 400));
		})
});

module.exports = router;
