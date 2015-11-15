import ajax from 'ts/utils/ajax/ajax';

// Routes ajax

// "dashboard.nearby" route
// "routes", Add the user to the poll
function publishCurrentLocation (username) {
  let url = '/geopoll';
  let opts =  {
    type: "POST",
    data: {
      username: username,
      lat: 37.54727278066122,
      lon: -122.2784007005615
    }
  };

  return ajax(url, opts);
}

// "dashboard.nearby" route
// "routes", Delete the user from the poll
function unpublishCurrentLocation(username) {
  let url = '/geopoll';
  let opts =  {
    type: "DELETE",
    data: {
      username: username
    }
  };

  return ajax(url, opts);
}

// "dashboard.nearby" route
// "routes", searching nearby users. list them
function findNearbyUsers(host) {
  let url = `/geopoll/${host}`;
  let opts =  {
    type: "GET"
  };
  // return nearbyUsers object or undefined
  return ajax(url, opts);
}

// Controller ajax

// "dashboard.nearby" controller
// "routes", update the Current user with the property "requester" contain as flyin username
function sendCardToNearbyUser(data) {
  const url = `/friends/${data.requester}`;
  let opts =  {
    type: "PUT",
    data: {
      requester: data.requester,
      receiver: data.receiver
    }
  };

  // linkedUser will be returned from the server
  return ajax(url, opts);
}

// "dashboard.nearby" controller
// "routes", update the current user by removing the property "requester"
function removeRequesterFlagOnServer(data) {
  let url = '/geopoll';
  let opts =  {
    type: "PUT",
    data: data
  };

  return ajax(url, opts);
}

// export function
export {
  publishCurrentLocation,
  unpublishCurrentLocation,
  findNearbyUsers,
  sendCardToNearbyUser,
  removeRequesterFlagOnServer
};
