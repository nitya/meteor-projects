// 4.4 Publications specify reactive collections/subsets that a client
//    can subscribe to, to obtain auto-synched data
//    Note that the publish function can be any complex query on collection
//     or could be a data array created on the fly (e.g., fixture)
//	  How does this work:
//      When a client subscribes to this publication, IF the function returns
//      a cursor (as is the case here) then Meteor automagically publishes
//      all subsequent changes to that cursor result set to the client as
//      they happen on the server - effectively client has reactive query result
Meteor.publish('posts', function(){
	return Posts.find();
});

// 10.1 Add publication for Comments
Meteor.publish('comments', function(){
	return Comments.find();
});