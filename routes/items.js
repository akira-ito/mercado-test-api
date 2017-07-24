const express = require('express'),
	router = express.Router(),
	util = require('util'),
	Errors = require('../lib/errors'),
	ItemsController = require('../controllers/items');

router.get('/', function(req, res, next) {
	const query = req.sanitize('q').escape() || "";
	req.checkQuery('limit', 'Limit inválido').notEmpty().isInt();

	req.getValidationResult().then(result => {
		if (!result.isEmpty()) {
			res.status(400).json(util.inspect(result.array()));
	    }else {
			const limit = req.query.limit;
			ItemsController.search(query, limit)
				.then(data => {
		  			res.json(data);
				}).catch(Errors.ErrorMercadoTest, err => {
					res.status(err.status).json(err);
				}).catch(err => {
					res.status(400).json(new Errors.ErrorMercadoTest('There was an unexpected problem', 'bad_request', 400));
				});
	    }
	});

});

router.get('/:id', function(req, res, next) {
	req.sanitize('id').escape();
	req.sanitize('id').trim();
	req.checkParams('id', 'Id inválido').notEmpty();

	req.getValidationResult().then(result => {
		if (!result.isEmpty()) {
			res.status(400).json(util.inspect(result.array()));
	    }else {
			const id = req.params.id;
			ItemsController.find(id)
				.then(data => {
		  			res.json(data);
				}).catch(Errors.ErrorMercadoTest, err => {
					res.status(err.status).json(err);
				}).catch(err => {
					res.status(400).json(new Errors.ErrorMercadoTest('There was an unexpected problem', 'bad_request', 400));
				})
		}
	});
});

module.exports = router;
