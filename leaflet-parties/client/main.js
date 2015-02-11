//5. Client startup
Meteor.startup(function () {

	// Reactive computation with a dependency on the Session state
	// (variable "selected"). Anytime the "selected" value is absent
	// this automatically picks a random party to selected value
	Tracker.autorun(function () {
		if (! Session.get("selected")) {
			var party = Parties.findOne();
			if (party) {
				Session.set("selected", party._id);
			}
	    }
	});
});


