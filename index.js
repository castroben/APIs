var express = require('express');
var app = express();
/*app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));*/

var Animal = require('./Animal.js');
var Toy = require('./Toy.js');

/*app.use('/', express.static('public'));
app.use('/create', (req,res) => {
	var newToy = new Toy({
		id: req.body.id,
		name: req.body.name,
		price: req.body.price
	});
	newToy.save( (err) => {
		if(err){
			res.type('html').status(500);
			res.send('Error: ' + err);
		}
		else{
			res.render('created', {toy: newToy});
		}
	})
})
*/

app.use('/findToy', (req,res) => {
	console.log(req.query);
	var query = {};
	if(req.query.id){
		query.id = req.query.id;
		Toy.findOne({id:query.id}, (err, toy) => {
			if(err){
				res.type('html').status(500);
				res.send('Error: ' + err);
			}
			else if(!toy){
				res.json({});
			}
			else{
				res.json(toy);
			}
		})
	}else{
		res.json({});
	}
});

app.use('/findAnimals', (req,res) => {
	var query = {};
	if (req.query.species) {
		query.species = req.query.species;
	}
	if (req.query.trait) {
		query.traits = req.query.trait;
	}
	if (req.query.gender) {
		query.gender = req.query.gender;
	}

	console.log(query);

	if(query.species || query.traits || query.gender){
		Animal.find(query, (err, animals) => {
			if(err){
				res.type('html').status(500);
				res.send('Error: ' + err);
			}
			else if(animals.length == 0){
				res.json({});
			}
			else{
				result = [];
				animals.forEach( (animal) => {
					result.push({name:animal.name, species:animal.species, breed: animal.breed, gender: animal.gender, age: animal.age});
				});
				res.json(result);
			}
		});
	}
	else{
		res.json({});
	}
});

app.use('/animalsYoungerThan', (req,res) => {
	if(req.query.age === 'undefined' || isNaN(req.query.age)){
		res.json({});
	}
	else{
		var query = {age : {$lt:req.query.age}};
		Animal.find(query, (err, animals) => {
			if(err){
				res.type('html').status(200);
				res.send('Error: ' + err);
			}
			else if(animals.length == 0){
				res.json({
					count : 0
				});
			}
			else{
				var count = 0;
				var nameArray = [];
				animals.forEach( (animal) => {
					count++;
					nameArray.push(animal.name);
				});
				res.json({
					count: count,
					names: nameArray
				});
			}
		});
	}
});

app.use('/calculatePrice', (req, res) => {
	if(Object.keys(req.query).length == 0 || req.query.id.length !== req.query.qty.length){
		res.json({});
	}
	else{
		var ids = req.query.id;
		var qtys = req.query.qty;
		var idToQty = new Map();

		for(var i =0; i < ids.length; i++){
			if(qtys[i] > 0 && !isNaN(qtys[i])){
				var q = Number(qtys[i]);
				if(idToQty.has(ids[i])){
					console.log(q);
					q += Number(idToQty.get(ids[i]));
					console.log(q);
				}
				idToQty.set(ids[i], q);
			}
		}
		var query = {id: {$in : Array.from(idToQty.keys())}};
		Toy.find(query, (err, toys) => {
			if(err){
				res.type('html').status(200);
				res.send('Error: ' + err);
			}
			else{
				var result = [];
				var total = 0;
				toys.forEach( (toy) => {
					var q = idToQty.get(toy.id);
					result.push({item: toy.id, qty: q, subtotal: q * toy.price});
					total += q * toy.price;
				});
				if(result.length == 0){
					res.json({totalPrice : 0, items : []})
				}
				else{
					res.json({items : result, totalPrice : total});
				}
			}
		});


	}
	var query = {};

});

app.listen(3000, () => {
	console.log('Listening on port 3000');
    });


// Please do not delete the following line; we need it for testing!
module.exports = app;