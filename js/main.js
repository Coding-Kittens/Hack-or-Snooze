"use strict";

// So we don't have to keep re-finding things on page, find DOM elements once:

const $body = $("body");

const $storiesLoadingMsg = $("#stories-loading-msg");
const $allStoriesList = $("#all-stories-list");
const $userStoriesList = $("#user-stories-list");

const $loginForm = $("#login-form");
const $signupForm = $("#signup-form");
const $addStoryForm = $("#addStoryForm");
const $editProfileForm = $("#edit-profile-form");

const $userProfilePage = $(".user-page-container");
const $StoryContainer = $(".stories-container");
const $navFavorits = $("#nav-user-favorites");
const $navUserStories = $("#nav-user-stories");
const $navLogin = $("#nav-login");
const $navUserProfile = $("#nav-user-profile");
const $navLogOut = $("#nav-logout");
const $navUserSubmit = $("#nav-user-submit");
const $divUserPage = $("#userProfilePage");
const $warningMsg = $("#warningMsg");

//hides everything
function hidePageComponents() {
  const components = [
    $StoryContainer,
    $editProfileForm,
    $divUserPage,
    $userProfilePage,
    $allStoriesList,
    $loginForm,
    $signupForm,
    $addStoryForm,
    $warningMsg,
  ];
  components.forEach((c) => c.hide());
}

//shows a waning message and adds an event to the Delete button
//used to delete the user or a ceritan story depending on the msg and func passed in
function showWarningMsg(msg, func) {
  $warningMsg.show();
  $("#warningMsg p").text(msg);
  $("#msgBtn").on("click", func);
}

// Starts the app.
async function start() {
  await checkForRememberedUser();
  await getAndShowStoriesOnStart();

  if (currentUser) updateUIOnUserLogin();
}

$(start);
