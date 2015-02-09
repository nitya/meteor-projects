// 9.5.2 
// Moved nitya:error-tests.js to error-tests.js
// Write your tests here!


// Check collection interactions 
Tinytest.add("Errors - collection", function(test){

	// Assert that collection is empty
	test.equal(Errors.collection.find({}).count(), 0);

	// Test that 'throw' results in insert
	Errors.throw('A new error!');
	test.equal(Errors.collection.find({}).count(), 1);

	// Reset collection after test
	Errors.collection.remove({});
});

// Check template updates
TinyTest.addAsync("Errors - template", function(test, done){

	// Assert that collection contains only this one error
	Errors.throw('A new error!');
	test.equal(Errors.collection.find({}).count(), 1);

	// Render the template
	UI.insert(UI.render(Template.meteorErrors), document.body);

	// After 3.5 seconds, check that Error collection cleared
	// the last displayed error
	Meteor.setTimeout(function() { 
		test.equal(Errors.collection.find({}).count(), 0); 
		done();
	}, 3500);
});