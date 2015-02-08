// 9.1 Creating a client-side "local" collection
//
// These are useful to storing state at the client in the
// mini-mongo db (making them reactive and API-accessible) but
// without them existing (or being synched) on server
// Think of this as a way to create per-client (or per-user)
// behaviors that are relevant only for the life of a session
Errors = new Mongo.Collection(null);

// locally define helper methods for this collection
throwError = function(message) {
	Errors.insert({ message: message});
};