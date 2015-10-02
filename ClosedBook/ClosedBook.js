var appId = 559895940818205; // TODO: Allow easy customization
var requiredPermissions = "user_posts,publish_actions";
var graphApiPath = "/me";
var graphApiFields = "posts{id}";
var denyList = "934624074069"; // TODO: Needs to be set ot the individual users "Aquaintances" list ID

var startLogin = function () {
    FB.login(processLoginResponse, { scope: requiredPermissions });
};

var changePrivacySettingForPost = function (postId) {
    var postUrl = "/" + postId;
    FB.api(postUrl, "POST", { "privacy.value": "CUSTOM", "privacy.allow": "ALL_FRIENDS", "privacy.deny": denyList });
};

var receivePostsPage = function (apiResponse) {
    var data = {};

    if (!apiResponse) {
        alert("Error: No JSON response received.");
        return;
    }

    if (!apiResponse.posts) {
        if (!apiResponse.data) {
            alert("Error: JSON response does not have a top-level 'posts' or 'data' field. " + JSON.stringify(apiResponse));
            return;
        }
        data = apiResponse.data;
    } else {
        if (!apiResponse.posts.data) {
            alert("Error: No posts data. " + JSON.stringify(apiResponse));
            return;
        }
        data = apiResponse.posts.data;
    }

    if (Object.prototype.toString.call(data) !== '[object Array]') {
        alert("Error: Posts data is not an array. " + JSON.stringify(apiResponse));
        return;
    }

    for (var i = 0; i < data.length; i++) {
        console.log("Post: " + data[i].id);
        changePrivacySettingForPost(data[i].id);
    }

    var nextPageUrl;

    if (apiResponse.posts && apiResponse.posts.paging && apiResponse.posts.paging.next) {
        nextPageUrl = apiResponse.posts.paging.next;
    }

    if (apiResponse.paging && apiResponse.paging.next) {
        nextPageUrl = apiResponse.paging.next;
    }

    if (nextPageUrl) {
        console.log("(next page)");
        $.getJSON(nextPageUrl, receivePostsPage);
    }
};

var processLoginResponse = function (currentStatus) {
    if (currentStatus.status !== "connected") {
        // not signed into FB (or app not authorized)
        alert("You are not logged into Facebook, or have not authorized this app to view your posts (\"" +
            currentStatus.status + "\") please login.");
        startLogin();
    } else {
        // Get a list of all posts by active user:
        FB.api(graphApiPath, "GET", { fields: graphApiFields }, receivePostsPage);
    }
};

$(document).ready(function () {

    FB.init({
        appId: appId,
        xfbml: true,
        version: 'v2.4',
    });

    startLogin();
});
