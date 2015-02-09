// To use this package, "meteor add nitya:errors" to make
// the relevant package objects (e.g., Errors object) now
// available to the application.

Package.describe({

  // 9.5 name of package (used in atmosphere)
  name: 'nitya:errors',
  
  // 9.5 version number (initialized to 0.0.1 by default)
  version: '0.0.1',

  // Brief, one-line summary of the package.
  summary: 'A test package to learn package usage',

  // URL to the Git repository containing the source code 
  //for this package.
  git: '',

  // By default, Meteor will default to using README.md for 
  // documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

// 9.5 Update this to configure package source
//    the files used 
//    the minimum Meteor version supported 
Package.onUse(function(api) {

  api.versionsFrom('0.9.0');

  api.use(
    ['minimongo', 'mongo-livedata', 'templating'], 
    'client'
  );

  api.addFiles(
    ['errors.js', 'errors_list.html', 'errors_list.js'], 
    'client'
  );

  if (api.export)
    api.export('Errors');
});

// 9.5 Update this to configure package tests (if any)
// 9.5.2 Updated to run tests
Package.onTest(function(api) {
   api.use('nitya:errors', 'client'); 
   api.use(['tinytest', 'test-helpers'], 'client');
   api.addFiles('errors_tests.js', 'client');
});
