// Declare layout template data helpers here
//
// 7. Add the modal dialogs here
Template.layout.helpers({
  showInviteDialog: function(){
    return Session.get("showInviteDialog");
  },
  showCreateDialog: function () {
    return Session.get("showCreateDialog");
  },
});
