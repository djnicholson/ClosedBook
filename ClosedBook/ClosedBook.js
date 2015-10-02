var appId = 559895940818205; // TODO: Allow easy customization

var login = function (currentStatus) {
    if (currentStatus.status !== "connected") {
        // not signed into FB (or app not authorized)
        alert("not logged in or authorized: " + currentStatus.status);
    } else {
        alert("api");
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

    alert("init");
    FB.init({
        appId: appId,
        xfbml: true,
        version: 'v2.4',
    });

    alert("login");
    FB.getLoginStatus(login);
});

