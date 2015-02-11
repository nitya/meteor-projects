/*
 * 3. Use GitHub for Accounts
 *    (makes use of service-configuration meteor package)
 * 
 * Visit https://github.com/settings/applications/new
 * Set Homepage URL to: http://localhost:4000/
 * Set Authorization callback URL to: http://localhost:4000/_oauth/github
 *
 * Then copy over details for Client ID and Client Secret
*/

// Remove any older GitHub configuration if it exists
ServiceConfiguration.configurations.remove({
  service: "github"
});

// Then add in the new one we want to use -- you may need to create
// different profiles for "local" vs. "hosted" endpoints

// localhost:4000 
// Note that I am checking in this version for convenience but will
// be revoking token and resetting secret periodically to prevent 
// misuses (so please replace with your own version)
ServiceConfiguration.configurations.insert({
  service: "github",
  clientId: "6eb149250a22c2808aa2",
  secret: "9382bab604f9e377ab4dfdd4126b21d4eef5ffb7"
});


// Effectively ensures that Meteor's "user" profile (for currently-logged in user)
// is now set to the list of cherry-picked properties from that user's GitHub profile
// To get a sense of available properties look at any user's profile
//
// e.g., John Resig's Profile: 
//       https://api.github.com/users/jeresig 
Accounts.onCreateUser(function(options, user){
  var accessToken = user.services.github.accessToken,
    result,
    profile;

	result = Meteor.http.get("https://api.github.com/user", {
    headers: {"User-Agent": "Meteor/1.0"},
    params: {
      access_token: accessToken
    }
  });

  if (result.error) {
    throw error;
  }

  profile = _.pick(result.data,
    "login",
    "name",
    "avatar_url",
    "url",
    "company",
    "blog",
    "location",
    "email",
    "bio",
    "html_url");

  user.profile = profile;

  return user;
});
