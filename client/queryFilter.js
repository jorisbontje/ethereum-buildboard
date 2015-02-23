"use strict";

Template.queryFilter.helpers({
    items: function() {
        if (this.type === "project") {
            return BuilderLib.projects;
        } else if (this.type === "os") {
            return BuilderLib.oses;
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
        } else {
            Session.set("toggle-" + type, undefined);
        }
    }
});
