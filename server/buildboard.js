SyncedCron.add({
    name: 'Sync with the buildserver',
    schedule: function(parser) {
        return parser.text('every 5 minutes');
    },
    job: function() {
        BuilderLib.updateBuilders();
        return true;
    }
});

Meteor.startup(function () {
    if (Builders.find().count() === 0) {
        BuilderLib.updateBuilders();
    }

    SyncedCron.start();
});

Meteor.methods({
    refresh: function () {
        console.log("refreshing");
        BuilderLib.updateBuilders();
    }
});

Meteor.publish("builders", function () {
    return Builders.find();
});
