if (window.location.href.match("debug=1")) {
    alert("Launching JavaScript debugger due to presence of debug=1 in URL");
    debugger;
}

var appId = 559895940818205; // TODO: Allow easy customization
var requiredPermissions = "user_posts,publish_actions";
var graphApiPath = "/me/feed";
var graphApiFields = "id,privacy";

var targetValue = "CUSTOM";
var targetFriends = "ALL_FRIENDS";
var targetDeny = "934624074069"; // TODO: Needs to be set to the individual users "Aquaintances" list ID

var startLogin = function () {
    FB.login(processLoginResponse, { scope: requiredPermissions });
};

var processUpdateResponse = function (post, response) {
    (response && response.success && response.success === true) ||
        console.error("Error updating " + JSON.stringify(post) + ": " + JSON.stringify(response));
};

var changePrivacySettingForPost = function (post) {

    if (!post.privacy || !post.privacy.value || post.privacy.value === "SELF" || post.privacy.value === "CUSTOM")
    {
        console.log(post.id + ": Not touching: " + JSON.stringify(post));
        return;
    }

    console.log(post.id + ": Updating: " + JSON.stringify(post));
    var postUrl = "/" + post.id;//.split("_")[1];
    FB.api(
        postUrl,
        "POST",
        { "privacy.value": targetValue, "privacy.friends": targetFriends, "privacy.deny": targetDeny, "privacy.description": "ClosedBook.js", "privacy.allow": "" },
        function (response) { processUpdateResponse(post, response); });
};

var receivePostsPage = function (apiResponse) {
    if (!apiResponse) {
        alert("Error: No JSON response received.");
        return;
    }

    if (!apiResponse.data) {
        alert("Error: JSON response does not have a top-level 'feed' or 'data' field. " + JSON.stringify(apiResponse));
        return;
    }
    var data = apiResponse.data;
    
    if (Object.prototype.toString.call(data) !== '[object Array]') {
        alert("Error: Posts data is not an array. " + JSON.stringify(apiResponse));
        return;
    }

    for (var i = 0; i < data.length; i++) {
        changePrivacySettingForPost(data[i]);
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

        // Deliberately not using the latest version of the API.  Beyond
        // v2.2 Facebook blocked apps from editing posts that they did not
        // create.
        version: 'v2.2',
    });

    startLogin();
});
