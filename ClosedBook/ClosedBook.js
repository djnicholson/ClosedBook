// TODO: Init FB API

// Get a list of all posts by active user:
FB.api(
  '/me',
  'GET',
  { "fields": "posts{id}" },
  function (response) {
      alert(JSON.stringify(response));
  }
);