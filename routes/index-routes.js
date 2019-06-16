module.exports = function(app) {
	require("./scrape-routes")(app);
	require("./saved-routes")(app)
};