var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: "LocalHost",
	port: 3306,
	user: "root",
	password: "",
	database: "Bamazon"
});

connection.connect(function(err) {
	if (err) throw err;
	console.log("connected as id " + connection.threadId);
});

connection.query('SELECT * FROM Products', function(err, res) {
	for (var i = 0; i < res.length; i++) {
		console.log('ID: ' + res[i].ItemID + ' || Product: ' + res[i].ProductName + ' || Price: $' + res[i].Price + '\n');
	}
	console.log('-----------------------------------------------------------');
	console.log('WELCOME TO BAMAZON! THE PLACE TO FIND THE BEST PRODUCTS!');
	console.log('-----------------------------------------------------------');
	start();
});

var start = function() {
	inquirer.prompt([{
		name: 'idChoice',
		message: 'Enter the ID of the Product you would like to purchase',
		type: 'input'
	}, {
		name: 'numUnits',
		message: 'Enter the purchase quantity',
		type: 'input'
	}
	]).then(function(answer) {
		connection.query('SELECT * FROM Products WHERE ItemID=?', [answer.idChoice], function(err, res) {
			if (res[0].StockQuantity < answer.numUnits) {
				console.log('Insufficient quantity!');
				console.log('Please choose again');
				start();
			} else {
				var query = 'UPDATE Products SET StockQuantity = StockQuantity-? WHERE ItemID=?'
				connection.query(query, [answer.numUnits, answer.idChoice], function(err, res) {
				})
				console.log('Total Cost of Purchase: $' + res[0].Price * answer.numUnits)
				returnMenu();
			}		
		})
		});
}

var returnMenu = function() {
	inquirer.prompt({
		name: 'menuReturn',
		message: 'What would like to make additional purchases?',
		type: 'list',
		choices: ['Yes', 'No']
	}).then(function(answer) {
		if (answer.menuReturn == "Yes") {
			start();
		}
	});
}




