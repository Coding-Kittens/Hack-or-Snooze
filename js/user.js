///////////////////////User login/signup/login/////////////////////////

"use strict";

let currentUser;

//Handle login form submission. If login ok, sets up the user instance
async function login(evt) {
  evt.preventDefault();

  const username = $("#login-username").val();
  const password = $("#login-password").val();

  currentUser = await User.login(username, password);

  if (currentUser) {
    saveUserCredentialsInLocalStorage();
    updateUIOnUserLogin();
  }

  $loginForm.trigger("reset");
}

$loginForm.on("submit", login);

// Handle signup form submission.
async function signup(evt) {
  evt.preventDefault();

  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

$signupForm.on("submit", signup);

// Remove user credentials from localStorage and refresh page
function logout(evt) {
  localStorage.clear();
  location.reload();
}

$navLogOut.on("click", logout);

/////////////////////Storing/recalling previously-logged-in-user with localStorage//////////////////////////

//Check If there are user credentials in local storage
async function checkForRememberedUser() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // try to log in with these credentials (will be null if login failed)
  currentUser = await User.loginViaStoredCredentials(token, username);
}

//Sync current user information to localStorage.
function saveUserCredentialsInLocalStorage() {
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

//////////////////////////////////////General UI stuff about users//////////////////////////////////////////

//show the stories list,update nav bar
function updateUIOnUserLogin() {
  $allStoriesList.show();
  updateNavOnLogin();
}

//show the form to change the users name and password
$("#changeUserProfile").on("click", () => {
  $divUserPage.hide();
  $editProfileForm.show();
});

$editProfileForm.on("submit", submitEditedProfile);

//changes the users name and password
async function submitEditedProfile(evt) {
  evt.preventDefault();

  const name = $("#newName").val();
  const password = $("#newPassword").val();

  currentUser = await User.changeUserInfo(
    currentUser.loginToken,
    currentUser.username,
    password,
    name
  );

  saveUserCredentialsInLocalStorage();
  updateUIOnUserLogin();

  $signupForm.trigger("reset");
}

///show wanrning before deleting a user
$("#deleteUser").on("click", () => {
  showWarningMsg(
    "Are you sure you want to delete your profile? This action can not be undone!",
    () => {
      User.deleteUser(currentUser.loginToken, currentUser.username);
    }
  );
});

/////////////////////////////////User favorits///////////////////////////////////////

$allStoriesList.on("click", "img", toggleFavorit);
//favorits/unfavorits a story
function toggleFavorit(evt) {
  if (currentUser) {
    $(evt.target).toggleClass("favorited");

    if ($(evt.target).hasClass("favorited")) {
      storyList.favoriteStory(currentUser, evt.target.id, true);

      let favStory = storyList.stories.find(
        (val) => evt.target.id === val.storyId
      );

      currentUser.favorites.push(favStory);
    } else {
      storyList.favoriteStory(currentUser, evt.target.id, false);

      let favId = currentUser.favorites.findIndex(
        (val) => evt.target.id === val.storyId
      );
      currentUser.favorites.splice(favId, 1);
    }
  } else {
    alert("login to favorite stories");
  }
}

//used to check if a story is a Favorite to updates the UI for the users favorite stories
function checkIfFavorite(storyId) {
  for (let story of currentUser.favorites) {
    if (storyId === story.storyId) {
      return true;
    }
  }
}
