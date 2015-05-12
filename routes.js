var cluster = require('./routes/cluster');

module.exports = function(app, router) {
	// main page
	app.get('/', function(req, res) {
		res.render('index');
	});

	// get request to make a query to the cluster
	var queryRoute = router.route('/query');
	queryRoute.post(cluster.query);
};