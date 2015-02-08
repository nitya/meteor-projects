// 8.2
// check that the userId specified owns the documents
ownsDocument = function(userId, doc) { 
	return doc && doc.userId === userId;
}