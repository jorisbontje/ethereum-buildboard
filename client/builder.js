"use strict";

Template.builder.helpers({
    elapsed: function() {
        var duration;
        if (this.buildEnd) {
            duration = this.buildEnd - this.buildStart;
        } else {
            var now = new Date().getTime() / 1000;
            duration = now - this.buildStart;
        }
        return moment.duration(duration, "seconds");
    },
    ended: function() {
        if (this.buildEnd) {
            return moment.unix(this.buildEnd).toDate();
        } else {
            return moment().add(this.eta, 'seconds').toDate();
        }
    },
    eta: function() {
        return moment.duration(this.eta, "seconds");
    },
    formatDuration: function(duration) {
        return duration.format("hh:mm:ss", { trim: false });
    },
    isBuilding: function() {
        return this.state === 'building';
    },
    isIdle: function() {
        return this.state === 'idle';
    },
    lastBuildLabel: function() {
        switch (this.results) {
            case 0:
                return 'label-success';
            case 1:
                return 'label-warning';
            case 2:
                return 'label-danger';
            default:
                return 'label-info';
        };
    },
    stateLabel: function() {
        switch (this.state) {
            case 'building':
                return 'label-warning';
            case 'idle':
                return 'label-default';
            default:
                return 'label-info';
        };
    },
    text: function() {
        return this.text.join(' ');
    },
    builderUrl: function() {
        return BUILDBOT_BASE_URL + '/builders/' + encodeURIComponent(this.name) + '/';
    },
    lastBuildUrl: function() {
        return BUILDBOT_BASE_URL + '/builders/' + encodeURIComponent(this.name) + '/builds/' + this.lastBuild;
    }
});
