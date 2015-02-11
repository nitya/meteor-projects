// 5. Helper methods around using Meteor.users
// 

// Given a user record, return a user-friendly name if it exists, 
//  else return his/her email address as the display name
displayName = function (user) {
	if (user.profile && user.profile.name)
		return user.profile.name;
	return contactEmail;
  //return user.emails[0].address;
};

// User may have created a profile either directly (Accounts) or using a
// third party service (GitHub) where email may not be available.
// Take that into account
// TODO: Later on, ensure that an email address is provided before 
//  allowing user to RSVP
contactEmail = function (user) {
  if (user.emails && user.emails.length)
    return user.emails[0].address;
  if (user.services && user.services.github && user.services.github.email)
    return user.services.github.email;
  return null;
};
