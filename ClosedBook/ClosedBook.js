var appId = 559895940818205; // TODO: Allow easy customization
var requiredPermissions = "user_posts";

var startLogin = function () {
    FB.login(processLoginResponse, { scope: requiredPermissions });
};

var processLoginResponse = function (currentStatus) {
    if (currentStatus.status !== "connected") {
        // not signed into FB (or app not authorized)
        alert("You are not logged into Facebook, or have not authorized this app to view your posts (\"" +
            currentStatus.status + "\") please login.");
        startLogin();
    } else {
        // Get a list of all posts by active user:
        FB.api(
            '/me',
            'GET',
            { "fields": "posts{id}" },
            function (response) {
                alert(JSON.stringify(response));
            }
        );
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

