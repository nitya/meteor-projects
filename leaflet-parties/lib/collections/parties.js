// 5. Adding Parties Collection
//
/*
 * Parties Collection Schema
 *    owner       : Meteor.user id
 *    x           : Number (screen x-co-ordinate in the interval [0,1])
 *    y           : Number (screen y-co-ordinate in the interval [0,1])
 *    title       : String (title of the party)
 *    Description : String (description for the party)
 *    public      : Boolean (is party public or private)
 *    invited     : Array[Meteor.user ids] (if !public, specific users invited)
 *    rsvps       : Array[{user:userId, rsvp:"yes|no|maybe"}] (array of response by user ID)  
 */
Parties = new Meteor.Collection("parties");

// helper method to determine if anyone is attending a party
attending = function (party) {
  return (_.groupBy(party.rsvps, 'rsvp').yes || []).length;
};

// Since Parties collection is shared (client and server) specify which
// operations are directly permitted from client
Parties.allow({

  // no cowboy inserts -- use createParty method
  insert: function (userId, party) {
    return false; 
  },

  // only allow updates by owner
  // only allow updates to {title | description | x | y}
  update: function (userId, party, fields, modifier) {
    if (userId !== party.owner)
      return false; 

    var allowed = ["title", "description", "x", "y"];
    if (_.difference(fields, allowed).length)
      return false; 
    return true;
  },

  // only allow deletes if owner, and if no rsvps exist
  remove: function (userId, party) {
    return party.owner === userId && attending(party) === 0;
  }
});

// And provide server-side methods for other operations, that can 
// then be invoked from the client using Meteor.call
Meteor.methods({

  // INSERT PARTY: validate data then insert into Collection
  createParty: function (options) {
    options = options || {};

    // TODO: use check to validate options instead
    if (! (typeof options.title === "string" && options.title.length &&
           typeof options.description === "string" && options.description.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (options.title.length > 100)
      throw new Meteor.Error(413, "Title too long");
    if (options.description.length > 1000)
      throw new Meteor.Error(413, "Description too long");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    return Parties.insert({
      owner   : this.userId,
      latlng  : options.latlng,
      title   : options.title,
      description: options.description,
      public  : !! options.public,
      invited : [],
      rsvps   : []
    });
  },

  // INVITE: Adds the specified user to the specified party
  //         checks arguments are valid, then updates Parties collection for partyId
  invite: function (partyId, userId) {

    var party = Parties.findOne(partyId);
    if (! party || party.owner !== this.userId)
      throw new Meteor.Error(404, "No such party");
    if (party.public)
      throw new Meteor.Error(400,"That party is public. No need to invite people.");

    if (userId !== party.owner && 
      ! _.contains(party.invited, userId)) {

      // add the invited party to the collection
      Parties.update(partyId, { $addToSet: { invited: userId } });

      // then send out the actual invite via email
      // Note: This code is in /lib so it will be seen on client and server
      //       To restrict visibility, simply move this section to the 
      //       server/ directory in its own file (e.g., server/parties.js)
      var from = contactEmail(Meteor.users.findOne(this.userId)),
          to = contactEmail(Meteor.users.findOne(userId));
      if (Meteor.isServer && to) {
        Email.send({
          from    : "noreply@example.com",
          to      : to,
          replyTo : from || undefined,
          subject : "PARTY: " + party.title,
          text    : "Hey, I just invited you to '" + 
                    party.title + 
                    "' on Leaflet-Powered Parties." +
                    "\n\nCome check it out: " + 
                    Meteor.absoluteUrl() + "\n"
        });
      }
    }
  },

  // RSVP: Adds the specified RSVP (userId=responder, rsvp=yes|no|maybe) to 
  //       the specified partyId
  rsvp: function (partyId, rsvp) {

    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in to RSVP");
    if (! _.contains(['yes', 'no', 'maybe'], rsvp))
      throw new Meteor.Error(400, "Invalid RSVP");

    var party = Parties.findOne(partyId);
    if (! party)
      throw new Meteor.Error(404, "No such party");
    if (! party.public && party.owner !== this.userId &&
        !_.contains(party.invited, this.userId))
      // private, but let's not tell this to the user
      throw new Meteor.Error(403, "No such party"); 

    // ==> update existing rsvp entry if it exists
    var rsvpIndex = _.indexOf(_.pluck(party.rsvps, 'user'), this.userId);
    if (rsvpIndex !== -1) {
      if (Meteor.isServer) {     
        // (on Server) update the appropriate rsvp entry with $
        Parties.update(
          {_id: partyId, "rsvps.user": this.userId},
          {$set: {"rsvps.$.rsvp": rsvp}});
      } 
      else {
        // (on Client) minimongo doesn't yet support $ in modifier. 
        // as a temporary workaround, make a modifier that uses an index.
        // this is safe on the client since there's only one thread.
        var modifier = {$set: {}};
        modifier.$set["rsvps." + rsvpIndex + ".rsvp"] = rsvp;
        Parties.update(partyId, modifier);
      }
      // Possible improvement: send email to the other people that are
      // coming to the party (to indicate this person's updated rsvp)
    } 

    // ==> else add new rsvp entry
    else {
      Parties.update(partyId,
                     {$push: {rsvps: {user: this.userId, rsvp: rsvp}}});
    }
  }
});
