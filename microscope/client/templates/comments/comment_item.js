// 10.2 Helper for comments template
Template.commentItem.helpers({ 
	submittedText: function() {
		return this.submitted.toString(); 
	}
});