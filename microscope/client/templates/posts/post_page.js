// 10.2 Support comments section with helper
Template.postPage.helpers({ 
	comments: function() {
		return Comments.find({postId: this._id}); 
	}
});