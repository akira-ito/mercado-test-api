const request = require('request-promise'),
	Errors = require('../lib/errors');

function getCategory(category_id){
	return request.get({
		uri: `${process.env.API_MERCADOLIVRE}/categories/${category_id}`,
		json: true
	}).catch(err => {
		if (err.statusCode == 404)
			throw Errors.Categories.notFound(`Currency with id ${id} not found.`);
		else
			throw Errors.Categories.badRequest(); 
	});
}

module.exports = {
	getCategory: getCategory
}