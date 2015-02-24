BuilderLib = {};

"use strict";

BuilderLib.isInternal = function(name) {
    return (name === 'buildbot' || _.startsWith(name, 'buildslave-') || _.startsWith(name, 'lib'));
};

BuilderLib.filters = ['project', 'os', 'branch'];

BuilderLib.oses = ['Linux', 'OSX', 'Windows'];

BuilderLib.getOs = function(name) {
    if (_.startsWith(name, "Linux ")) {
        return "Linux";
    } else if (_.startsWith(name, "OSX ")) {
        return "OSX";
    } else if (_.startsWith(name, "Windows ")) {
        return "Windows";
    } else {
        return "unknown";
    }
};

BuilderLib.branches = ['master', 'develop', 'pull-requests'];

BuilderLib.getBranch = function(name) {
    if (_.str.include(name, " master")) {
        return "master";
    } else if (_.str.include(name, " develop")) {
        return "develop";
    } else if (_.endsWith(name, " pull requests") || _.endsWith(name, " PRs")  ) {
        return "pull-requests";
    } else {
        return "unknown";
    }
}

BuilderLib.projects = ['go-ethereum', 'cpp-ethereum', 'pyethereum', 'ethereumj', 'serpent'];

BuilderLib.getProject = function(name) {
    if (_.str.include(name, " C++ ")) {
        return "cpp-ethereum";
    } else if (_.str.include(name, " Go ")) {
        return "go-ethereum";
    } else if (_.str.include(name, " PyEthereum ")) {
        return "pyethereum";
    } else if (_.str.include(name, " EthereumJ ")) {
        return "ethereumj";
    } else if (_.str.include(name, " Serpent ")) {
        return "serpent";
    } else {
        return "unknown";
    }
};

BuilderLib.updateBuilder = function(name, builder) {

    if (BuilderLib.isInternal(name)) {
        console.log("Skipping internal builder: " + name);
        return;
    }

    console.log("Updating builder: " + name);

    var lastBuild = _.max(builder.cachedBuilds);

    var project = BuilderLib.getProject(name);
    var os = BuilderLib.getOs(name);
    var branch = BuilderLib.getBranch(name);

    HTTP.call("GET", BUILDBOT_BASE_URL + "/json/builders/" + encodeURIComponent(name) + "/builds/" + lastBuild, function (error, result) {
        if (!error) {

            var buildStart = new Date(result.data.times[0]);
            var buildEnd = result.data.times[1];
            if (buildEnd) {
                buildEnd = new Date(buildEnd);
            }

            Builders.upsert({name: name}, {
                name: name,
                project: project,
                os: os,
                branch: branch,
                state: builder.state,
                results: result.data.results,
                text: result.data.text,
                buildStart: buildStart,
                buildEnd: buildEnd,
                lastBuild: lastBuild,
                lastUpdated: new Date()
            });
        }
    });
};

BuilderLib.updateBuilders = function() {
    console.log("Updating Builders");
    HTTP.call("GET", BUILDBOT_BASE_URL + "/json/builders", function (error, result) {
        if (!error) {
            _.each(result.data, function(builder, name) {
                BuilderLib.updateBuilder(name, builder);
            });
        }
    });
};
