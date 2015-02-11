// 8. Adding details helpers 

Template.details.helpers({
  party: function(){
    return Parties.findOne(Session.get("selected"));
  },
  anyParties: function () {
    return Parties.find().count() > 0;
  },
  creatorName: function () {
    var owner = Meteor.users.findOne(this.owner);
    if (owner._id === Meteor.userId())
      return "me";
      return displayName(owner);
  },
  canRemove: function () {
    return this.owner === Meteor.userId() && attending(this) === 0;
  },
  maybeChosen: function () {
    var myRsvp = _.find(this.rsvps, function (r) {
      return r.user === Meteor.userId();
    }) || {};

    return what == myRsvp.rsvp ? "chosen btn-inverse" : "";
  }
});