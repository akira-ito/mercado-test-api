const request = require('request-promise');
	_ = require('lodash'),
	async = require('async'),
	Bluebird = require('bluebird'),
	SitesService = require('../services/sites'),
	CurrenciesService = require('../services/currencies'),
	CategoriesService = require('../services/categories'),
	ItemsService = require('../services/items');

module.exports.search = (query, limit = 4) => {
	return SitesService.search(query, limit)
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
							free_shipping: result['shipping']['free_shipping'],
							state_name: result['address']['state_name']
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
		const find = _.find(data['filters'], {id: 'category'}); 
		//const find = _.find(data['available_filters'], {id: 'category'}); //TODO: Qual a diferença do site bar com o filter??
		return {
			author: {
				name: '',
				lastname: ''
			}, //TODO: Onde que consigo obter esse dados?
			categories: find ? _.map(_.get(find, 'values[0].path_from_root', []), 'name') : [],
			items: items
		}
	});
}

module.exports.find = id => {
	return ItemsService.get(id)
	.then(item => 
		[
			item,
			CategoriesService.getCategory(item.category_id), //TODO: Tenho que obter a categoria?
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
	).spread((item, category, currency, descriptions) => {
		return {
			author: {
				name: '',
				lastname: ''
			}, //TODO: Onde que consigo obter esse dados?
			id: item['id'],
			title: item['title'],
			price: {
				amount: item['price'],
				currency: currency['symbol'],
				decimals: currency['decimal_places']
			},
			categories: _.map(category['path_from_root'], 'name'), //TODO: Tenho que obter a categoria?
			picture: item['pictures'][0]['url'],
			condition: item['condition'],
			free_shipping: item['shipping']['free_shipping'],
			sold_quantity: item['sold_quantity'],
			description: descriptions[0] //TODO: Devo pegar sempre o primeiro?
			//seller_address_state: _.get(item, 'seller_address.state.name', '') //TODO: Preciso do state? (exe: Capital Federal, Mendoza)
		};
	})
};