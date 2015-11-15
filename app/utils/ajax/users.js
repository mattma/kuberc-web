import ajax from 'ts/utils/ajax/ajax';

// "dashboard.friends" route. Unfriend with this friend
// "components/dashboard-friends/component.js", Unfriend button action
function unfriendBtnClick(data) {
  let url = `/users/${data.username}/friends/${data.friend_name}`;
  let opts = {
    type: "DELETE"
  };

  return ajax(url, opts);
}

// "dashboard.edit" route: update current user setting
// "components/dashboard-edit/component.js", Update button action
function updateUser(currentUser, updateData) {
  let url = `/users/${currentUser.username}`;
  let opts =  {
    type: "PUT",
    data: {
      username: currentUser.id,
      update: updateData
    }
  };

  return ajax(url, opts);
}

// export function
export {
  unfriendBtnClick,
  updateUser
};
