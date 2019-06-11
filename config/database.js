var dbVars = require('./constants');
var MongoClient = require('mongodb').MongoClient;
var _db=false;
var _client=false;
module.exports.dbconnect = function(callback) {
    MongoClient.connect(dbVars.URL, { useNewUrlParser: true }, function (err, client) {
	    if (err) throw err;
	    _client = client;
	    _db = client.db(dbVars.DB_NAME);
	    callback(_db);
    })
}
module.exports.getConnection = function(){
    return _db;
}
module.exports.closeConnection = function(){
    _client.close();
}