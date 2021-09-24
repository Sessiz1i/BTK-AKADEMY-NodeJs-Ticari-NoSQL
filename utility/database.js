const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient
let _db
const mongoConnect = (callback) =>
{
	//MongoClient.connect("mongodb://localhost/node-app")
	MongoClient.connect("mongodb+srv://sessiz1i:aA1190358*@sessiz1i.gv2vx.mongodb.net/node-app?retryWrites=true&w=majority",
		{useNewUrlParser: true})
	.then(client =>
	{
		console.log("Connected to MongoDB")
		_db = client.db()
		callback()
	})
	.catch(err => console.error(err))
}

const getdb = () =>
{
	if (_db)
	{
		return _db
	}
	throw "No Database"
}

exports.mongoConnect = mongoConnect
exports.getdb = getdb

