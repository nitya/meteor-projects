// 3.1 Fixture data for initializing posts
var postsData = [ 
  {
    title: 'Introducing Telescope',
    url: 'http://sachagreif.com/introducing-telescope/'
  },
  {
    title: 'Meteor',
    url: 'http://meteor.com'
  }, 
  {
    title: 'The Meteor Book',
    url: 'http://themeteorbook.com'
  }
];


// 3.1 postsList template helper binds data to view variables
Template.postsList.helpers({
  posts: postsData
});