
// 3.1 postsList template helper binds data to view variables
//
// 4.3 replaced the static data with a dyanmic database query
//     note that find() returns a cursor = reactive data source
//      if you want to get static data, add .fetch()
//
// 7.8 add sort parameters to find, to get sorted results
Template.postsList.helpers({
  posts: function(){
    return Posts.find({}, {sort: {submitted: -1}});
  }
});