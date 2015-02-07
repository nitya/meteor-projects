// 6.1 Configure the Accounts UI usage
//     See http://docs.meteor.com/#/full/accounts_ui_config
//
// Note: Accounts autopublishes currently logged in user to client
//   so THAT user's details are always visible on browser side
//	 but as a secure subset of the server-side User record 
//   Use: Meteor.users.find() to explore usage
Accounts.ui.config({
	passwordSignupFields:  'USERNAME_ONLY'
});