"use strict";

Meteor.subscribe("builders");

Template.buildboard.helpers({
    filters: function() {
        return BuilderLib.filters;

    },
    fromNow: function(date) {
        return moment(date).fromNow();
    },
    builders: function () {
        var query = {};
        _.each(BuilderLib.filters, function(filter) {
            var value = Session.get("toggle-" + filter);
            if (value) {
                query[filter] = value;
            }
        });
        return Builders.find(query, { sort: { buildStart: -1, name: 1 } });
    },
    lastUpdated: function() {
        var last = Builders.find({}, {sort: {lastUpdated: -1}, limit: 1}).fetch();
        if (_.size(last)) {
            return last[0].lastUpdated;
        }
    }
});

Template.buildboard.events({
    'click .clear': function () {
        _.each(BuilderLib.filters, function(filter) {
            Session.set("toggle-" + filter, undefined);
            localStorage.removeItem("toggle-" + filter);
        });
    },
    'click .refresh': function () {
        Meteor.call("refresh");
    }
});
