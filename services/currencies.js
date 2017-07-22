const request = require('request-promise'),
	Errors = require('../lib/errors');

function getCurrency(currency_id){
	return request.get({
		uri: `${process.env.API_MERCADOLIVRE}/currencies/${currency_id}`,
		json: true
	}).catch(err => {
		if (err.statusCode == 404)
			throw Errors.Currencies.notFound(`Currency with id ${id} not found.`);
		else
			throw Errors.Currencies.badRequest(); 
	});
}

module.exports = {
	getCurrency: getCurrency
}