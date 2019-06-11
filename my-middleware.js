var connection = require('./config/database');
module.exports = function (options) {
    
	return function (req, res, next) {
        connection.dbconnect(function(db){
            /*console.log(db);
            console.log('12345');*/
        });
        if(!db) {
            db = connection.getConnection();
        }
		// Implement the middleware function based on the options object
		db.collection('users').find().toArray(function (err, result) {
	       if (err) throw err
	           console.log(result)
	    })
		console.log("logged");
		next()
	}
}