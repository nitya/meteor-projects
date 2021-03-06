
// 9.5 handling errors
Template.postEdit.created = function() { 
  Session.set('postEditErrors', {});
}

Template.postEdit.helpers({ 
  errorMessage: function(field) {
    return Session.get('postEditErrors')[field]; 
  },
  errorClass: function (field) {
    return !!Session.get('postEditErrors')[field] ? 'has-error' : '';
  } 
});

// 8.1 Editing Posts
//
// 9.2 update to use throwError instead of alert
Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = this._id;
    
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    // 9.5 Validate errors client side
    var errors = validatePost(postProperties); 
    if (errors.title || errors.url)
      return Session.set('postEditErrors', errors);
    
    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        // 9.5 Change to use the nitya:errors package instead
        Errors.throw(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});

