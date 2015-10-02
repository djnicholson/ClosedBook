var appId = 559895940818205; // TODO: Allow easy customization
var requiredPermissions = "user_posts";
var graphApiPath = "/me";
var graphApiMethod = "GET";
var graphApiFields = "posts{id}";

var startLogin = function () {
    FB.login(processLoginResponse, { scope: requiredPermissions });
};

var receivePostsPage = function (apiResponse) {
    alert(JSON.stringify(apiResponse));
};

var processLoginResponse = function (currentStatus) {
    if (currentStatus.status !== "connected") {
        // not signed into FB (or app not authorized)
        alert("You are not logged into Facebook, or have not authorized this app to view your posts (\"" +
            currentStatus.status + "\") please login.");
        startLogin();
    } else {
        // Get a list of all posts by active user:
        FB.api(graphApiPath, graphApiMethod, { fields: graphApiFields }, receivePostsPage);
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
