"use strict";

Meteor.subscribe("builders");

Template.buildboard.helpers({
    filters: function() {
        return BuilderLib.filters;

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
    }
});

Template.buildboard.events({
    'click .clear': function () {
        _.each(BuilderLib.filters, function(filter) {
            Session.set("toggle-" + filter, undefined);
        });
    },
    'click .refresh': function () {
        Meteor.call("refresh");
    }
});
