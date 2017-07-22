const request = require('request-promise'),
	Errors = require('../lib/errors');

function get(id){
	return request.get({
		uri: `${process.env.API_MERCADOLIVRE}/items/${id}`,
		json: true
	}).catch(err => {
		if (err.statusCode == 404)
			throw Errors.Items.notFound(`Item with id ${id} not found.`);
		else
			throw Errors.Items.badRequest(); 
	});
}
function getDescription(description_id){
	let description = description_id.split('-')[0];

	return request.get({
		uri: `${process.env.API_MERCADOLIVRE}/items/${description}/description`,
		json: true
	}).catch(err => {
		if (err.statusCode == 404)
			throw Errors.Items.notFound(`Description of item with id ${description_id} not found`);
		else
			throw Errors.Items.badRequest(); 
	});
}

module.exports = {
	get: get,
	getDescription: getDescription
}