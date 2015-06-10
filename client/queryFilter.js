"use strict";

Meteor.startup(function() {
    _.each(BuilderLib.filters, function(filter) {
        Session.set("toggle-" + filter, localStorage.getItem("toggle-" + filter) || undefined);
    });
});

Template.queryFilter.helpers({
    items: function() {
        if (this.type === "project") {
            return BuilderLib.projects;
        } else if (this.type === "arch") {
            return BuilderLib.archs;
        } else if (this.type === "branch") {
            return BuilderLib.branches;
        } else {
            throw new Meteor.Error("invalid-type");
        }
    },
    isActive: function(type) {
        return Session.get("toggle-" + type) === this;
    }
});

Template.queryFilter.events({
    'click': function (evt, template) {
        var type = template.data.type;
        var value = $(evt.target).data('value');

        var currentValue = Session.get("toggle-" + type);
        if (currentValue !== value) {
            Session.set("toggle-" + type, value);
            localStorage.setItem("toggle-" + type, value);
        } else {
            Session.set("toggle-" + type, undefined);
            localStorage.removeItem("toggle-" + type);
        }
    }
});
