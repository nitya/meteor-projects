// Declare page template data helpers here
//
// 2. Bind page title
// 7. Add the modal dialogs here
Template.page.helpers({
  showInviteDialog: function(){
    return Session.get("showInviteDialog");
  },
  showCreateDialog: function () {
    return Session.get("showCreateDialog");
  },
});
