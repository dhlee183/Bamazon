var Table = require('cli-table');
 
var table = new Table({
    head: ['DeptID', 'DeptName', 'OHCosts', 'ProdSales', 'TotProf']
  , colWidths: [8, 17, 12, 12, 12]
});

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
		message: 'What executive option would you like to perform?',
		type: 'list',
		choices: ['View Product Sales by Department', 'Create New Department']
	}).then(function(answer) {
		if (answer.menuOptions == 'View Product Sales by Department') {
			viewSalesDept();
		}
		if (answer.menuOptions == 'Create New Department') {
			createDept();
		}
	});
}

var viewSalesDept = function() {
	var query = 'SELECT' 
	+ ' dept.DepartmentID,'
	+ ' dept.DepartmentName,'
	+ ' SUM(dept.OverHeadCosts*prod.StockQuantity) AS TotalOverHeadCosts,'
	+ ' SUM(dept.TotalSales) AS ProductSales,'
	+ ' SUM(dept.TotalSales - (dept.OverHeadCosts*prod.StockQuantity)) AS TotalProfit'
	+ ' FROM Departments AS dept'
	+ ' JOIN Products AS prod'
	+ ' ON dept.DepartmentName=prod.DepartmentName'
	+ ' GROUP BY dept.DepartmentID';
	connection.query(query, function(err, res) {
		for (var i = 0; i < res.length; i++) {
    		table.push([res[i].DepartmentID, res[i].DepartmentName, res[i].TotalOverHeadCosts, res[i].ProductSales, res[i].TotalProfit]);
		}
		console.log(table.toString());	
		returnMenu();
	});
}

var createDept = function() {
	inquirer.prompt([{
		name: 'deptID',
		message: 'Enter the department ID you would like to use',
		type: 'input'
	}, {
		name: 'deptName',
		message: 'Enter the department name',
		type: 'input'
	}, {
		name: 'overHead',
		message: 'Enter the overhead cost',
		type: 'input'
	}	
	]).then(function(answer) {
		connection.query('INSERT INTO Departments SET ?', {
			DepartmentID: answer.deptID,
			DepartmentName: answer.deptName,
			OverHeadCosts: answer.overHead,
			TotalSales: 0
		}, function(err, res) {
			console.log(answer.deptName + ' Has been added to the system');
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