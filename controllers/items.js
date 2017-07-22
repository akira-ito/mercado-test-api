const request = require('request-promise');
	_ = require('lodash'),
	async = require('async'),
	Bluebird = require('bluebird'),
	SitesService = require('../services/sites'),
	CurrenciesService = require('../services/currencies'),
	ItemsService = require('../services/items');

module.exports.search = query => {
	return SitesService.search(query, 2)
	.then(data => 
		new Bluebird(resolve => {
			async.map(data['results'], (result, callback) => {
				async.waterfall([
					call => {
						CurrenciesService.getCurrency(result.currency_id)
							.then(currency => {
								call(null, {
									currency: currency['symbol'],
									decimals: currency['decimal_places']
								});
							})
					},
					(currency, call) => {
						call(null, {
							id: result['id'],
							title: result['title'],
							price: _.extend({amount: result['price']}, currency),
							picture: result['thumbnail'],
							condition: result['condition'],
							free_shipping: result['shipping']['free_shipping']
						});
					}
				], (err, item) => {
					callback(null, item);
				})
			}, (err, items) => {
				resolve([data, items ]);
			})
		})
	).spread((data, items) => {
		const find = _.find(data['available_filters'], {id: 'category'}); 
		return {
			author: {},
			categories: find ? _.map(find['values'], 'name') : [],
			items: items
		}
	});
}

module.exports.find = id => {
	return ItemsService.get(id)
	.then(item => 
		[
			item,
			CurrenciesService.getCurrency(item.currency_id),
			new Bluebird(resolve => {
				async.map(item.descriptions, (description, callback) => {
					ItemsService.getDescription(description.id)
						.then(data => {
							callback(null, data['plain_text']);
						})
				}, (err, res) => {
					resolve(res);
				})
			})
		]
	).spread((item, currency, descriptions) => {
		return {
			author: {},
			id: item['id'],
			title: item['title'],
			price: {
				amount: item['price'],
				currency: currency['symbol'],
				decimals: currency['decimal_places']
			},
			picture: item['pictures'][0]['url'],
			condition: item['condition'],
			free_shipping: item['shipping']['free_shipping'],
			sold_quantity: item['sold_quantity'],
			description: descriptions[0]
		};
	})
};