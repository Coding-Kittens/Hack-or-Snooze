//////////////////////Handling navbar clicks and updating navbar/////////////////////////////

"use strict";

// Show main list of all stories when click site name
function navAllStories(evt) {
  hidePageComponents();
  getAndShowStoriesOnStart();
  $StoryContainer.show();
}

$body.on("click", "#nav-all", navAllStories);

//Show login/signup on click on "login"
function navLoginClick() {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

// When a user first logins in, update the navbar to reflect that.
function updateNavOnLogin() {
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  navAllStories();
  $navUserProfile.text(`${currentUser.username}`).show();
  $navFavorits.show();
  $navUserStories.show();
  $navUserSubmit.show();
}

$navUserSubmit.on("click", navAddStory);

//shows the add story form
function navAddStory() {
  $(".main-nav-links").show();
  hidePageComponents();
  $addStoryForm.show();
  //changes the sumbit button to add story
  $("#addOrEditBtn").text("Post Story");
  $addStoryForm.off("submit");
  $addStoryForm.on("submit",postNewStory);
}

$navUserProfile.on("click", navShowUserPage);

//shows the users profile page
function navShowUserPage() {
  hidePageComponents();
  $userProfilePage.show();
  $divUserPage.show();
  putStoriesOnPage(
    $userStoriesList,
    userStoriesMarkup,
    ...currentUser.ownStories
  );
}

$navFavorits.on("click", navFavoritStories);

//shows the users favorites
function navFavoritStories() {
  hidePageComponents();
  $StoryContainer.show();
  putStoriesOnPage(
    $allStoriesList,
    generateStoryMarkup,
    ...currentUser.favorites
  );
}

$navUserStories.on("click", navUserStories);

//show the Users stories on the main page
function navUserStories(evt) {
  hidePageComponents();
  $StoryContainer.show();
  putStoriesOnPage(
    $allStoriesList,
    generateStoryMarkup,
    ...currentUser.ownStories
  );
}

$(".backBtn").on("click", navShowUserPage);
