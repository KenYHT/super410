var cluster = require('./routes/cluster');

module.exports = function(app, router) {
	// main page
	app.get('/', function(req, res) {
		res.render('index');
	});


};