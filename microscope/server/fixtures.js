// 4-2: Initialize collection with data for testing
// 10-1: Updating fixtures with comments data as well
if (Posts.find().count() === 0) { 

	// set an update time
	var now = new Date().getTime();

	// setup two users
	var tomId = Meteor.users.insert({
		profile: {name: 'Tom Coleman'}
	});
	var tom = Meteor.users.findOne(tomId);

	var sachaId = Meteor.users.insert({
		profile: {name: 'Tom Coleman'}
	});
	var sacha = Meteor.users.findOne(sachaId);

	// setup posts
	var telescopeId = Posts.insert({
	    title: 'Introducing Telescope',
	    url: 'http://sachagreif.com/introducing-telescope/',
	    userId: sacha._id,
	    author: sacha.profile.name,
	    submitted: new Date(now - 7*3600*1000)
	});

	Posts.insert({
	    title: 'Meteor',
	    url: 'http://meteor.com',
	    userId: tom._id,
	    author: tom.profile.name,
	    submitted: new Date(now - 10*3600*1000)
	});

	Posts.insert({
	    title: 'The Meteor Book',
	    url: 'http://themeteorbook.com',
	    userId: tom._id,
	    author: tom.profile.name,
	    submitted: new Date(now - 12*3600*1000)
	}); 


	// setup comments for a post
	Comments.insert({
		postId: telescopeId,
		userId: tom._id,
		author: tom.profile.name,
		submitted: new Date(now - 5 * 3600 * 1000),
		body: 'Interesting project Sacha, can I get involved?'
	});

	Comments.insert({
		postId: telescopeId,
		userId: sacha._id,
		author: sacha.profile.name,
		submitted: new Date(now - 3 * 3600 * 1000), 
		body: 'You sure can Tom!'
	});
}