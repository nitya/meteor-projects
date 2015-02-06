// 4.4 Publications specify reactive collections/subsets that a client
//    can subscribe to, to obtain auto-synched data
Meteor.publish('posts', function(){
	return Posts.find();
});