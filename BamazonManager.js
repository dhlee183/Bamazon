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
	start();
});

var start = function() {
	inquirer.prompt({
		name: 'menuOptions',
		message: 'What would you like to manage?',
		type: 'list',
		choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
	}).then(function(answer) {
		if (answer.menuOptions == 'View Products for Sale') {
			prodforSale();
		}
		if (answer.menuOptions == 'View Low Inventory') {
			lowInv();
		}
		if (answer.menuOptions == 'Add to Inventory') {
			addInv();
		}
		if (answer.menuOptions == 'Add New Product') {
			addProd();
		}
	});
}

var prodforSale = function() {
	connection.query('SELECT * FROM Products', function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log('ID: ' + res[i].ItemID + ' || Product: ' + res[i].ProductName + ' || Dept: ' + res[i].DepartmentName + ' || Price: $' + res[i].Price + ' || Quantity: $' + res[i].StockQuantity + '\n');
		}
		returnMenu();
	});
}

var lowInv = function() {
	connection.query('SELECT * FROM Products WHERE StockQuantity < 5', function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log('ID: ' + res[i].ItemID + ' || Product: ' + res[i].ProductName + ' || Quantity: ' + res[i].StockQuantity + '\n');
		}
		returnMenu();
	});
}

var addInv = function() {
	connection.query('SELECT * FROM Products', function(err, res) {
		for (var i = 0; i < res.length; i++) {
			console.log('ID: ' + res[i].ItemID + ' || Product: ' + res[i].ProductName + ' || Quantity: ' + res[i].StockQuantity + '\n');
		}
	inquirer.prompt([{
		name: 'addMore',
		message: 'Enter the Item ID of the product to add to the inventory?',
		type: 'input'
	}, {
		name: 'addQuant',
		message: 'Please enter the quantity to add',
		type: 'input'
	}
	]).then(function(answer) {
		var query = 'UPDATE Products SET StockQuantity=StockQuantity+? WHERE ItemID=?'
		connection.query(query, [answer.addQuant, answer.addMore], function(err, res) {
			console.log('Your request has been processed')
			returnMenu();
		});
	});
	});
}

var addProd = function() {
	inquirer.prompt([{
		name: 'prodName',
		message: 'Enter the name of the product you would like to add',
		type: 'input'
	}, {
		name: 'deptName',
		message: 'Enter the department name',
		type: 'input'
	}, {
		name: 'prodPrice',
		message: 'Enter the price of the product',
		type: 'input'
	}, {
		name: 'prodQuant',
		message: 'Enter the quantity to add',
		type: 'input'
	}	
	]).then(function(answer) {
		connection.query('INSERT INTO Products SET ?', {
			ProductName: answer.prodName,
			DepartmentName: answer.deptName,
			Price: answer.prodPrice,
			StockQuantity: answer.prodQuant
		}, function(err, res) {
			console.log(answer.prodName + ' Has been added to the inventory');
			returnMenu();
		});
		
	});
}

var returnMenu = function() {
	inquirer.prompt({
		name: 'menuReturn',
		message: 'What would like to go back to the menu?',
		type: 'list',
		choices: ['Yes', 'No']
	}).then(function(answer) {
		if (answer.menuReturn == "Yes") {
			start();
		}
	});
}