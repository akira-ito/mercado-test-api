const request = require('request-promise'),
	Errors = require('../lib/errors');

function search(query = "", limit){
	return request.get({
		uri: `${process.env.API_MERCADOLIVRE}/sites/MLA/search?q=${query}&limit=${limit}`,
		json: true
	}).catch(err => {
		if (err.statusCode == 404)
			throw Errors.Sites.notFound('Search not found.');
		else
			throw Errors.Sites.badRequest(); 
	});
}

module.exports = {
	search: search
}