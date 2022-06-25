"use strict";

let storyList;

// Get and show stories when site first loads.
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories(0, 25);
  $storiesLoadingMsg.remove();

  putStoriesOnPage($allStoriesList, generateStoryMarkup, ...storyList.stories);
}

//Returns the markup for the story on main page
function generateStoryMarkup(story) {
  let storyClass = "";

  if (currentUser) {
    if (checkIfFavorite(story.storyId)) {
      storyClass = "favorited favoritArrow";
    }
  }
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <img id="${story.storyId}" class ='${storyClass} favoritArrow' src='sprites/upArrow.png'>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//Returns the markup for the story on user page
function userStoriesMarkup(story) {
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
        <img id="${story.storyId}" class ='editStory' src='sprites/ink.png'>
        <img id="${story.storyId}" class ='deleteStory' src='sprites/x.png'>
      </li>
    `);
}

// Gets list of stories, generates their HTML, and puts on page.
function putStoriesOnPage(page, func, ...storiesList) {
  page.empty();

  for (let story of storiesList) {
    const $story = func(story);
    page.append($story);
  }
  page.show();
}

//posts a new story
async function postNewStory(evt) {
  evt.preventDefault();

  let title = $("#titleTxt").val();
  let author = $("#authorTxt").val();
  let url = $("#storyUrl").val();

  const newStory = await storyList.addStory(currentUser, {
    username: currentUser.username,
    title,
    author,
    url,
  });

  currentUser.ownStories.push(newStory);
  $addStoryForm.trigger("reset");
  navAllStories();
}

///shows a warning msssage before deleting
$userStoriesList.on("click", ".deleteStory", (evt) => {
  showWarningMsg(
    "Are you sure you want to delete this story? This action can not be undone!",
    () => {
      let deleteStoryId = currentUser.ownStories.findIndex(
        (val) => evt.target.id === val.storyId
      );
      currentUser.ownStories.splice(deleteStoryId, 1);
      deleteStory(evt.target.id);
      $(evt.target).parent().remove();
    }
  );
});

//deletes a story
function deleteStory(id) {
  $("#msgBtn").off("click");
  storyList.removeStory(currentUser, id);
  navShowUserPage();
}

$userStoriesList.on("click", ".editStory", (evt) => {
  navAddStory();
  const storyId = evt.target.id;

  let currentStory = currentUser.ownStories.find(
    (val) => storyId === val.storyId
  );

  $("#titleTxt").val(currentStory.title);
  $("#authorTxt").val(currentStory.author);
  $("#storyUrl").val(currentStory.url);

  //changes the sumbit button to edit story
  $("#addOrEditBtn").text("Edit Story");
  $addStoryForm.off("submit");
  $addStoryForm.on("submit", (evt) => {
    evt.preventDefault();
    editStory(storyId);
  });
});

//edits a story
async function editStory(id) {
  let title = $("#titleTxt").val();
  let author = $("#authorTxt").val();
  let url = $("#storyUrl").val();

  let storyId = currentUser.ownStories.findIndex((val) => id === val.storyId);

  currentUser.ownStories[storyId].title = title;
  currentUser.ownStories[storyId].author = author;
  currentUser.ownStories[storyId].url = url;

  storyList.changeStory(currentUser, id, {
    username: currentUser.username,
    title,
    author,
    url,
  });
  $addStoryForm.trigger("reset");
  navShowUserPage();
}
