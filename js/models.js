"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

// Story: a single story in the system

class Story {
  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  // Parses hostname out of URL and returns it.
  getHostName() {
    let url = new URL(this.url);
    return url.hostname;
  }
}

// List of Story instances: used by UI to show story lists in DOM.
class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  //gets a list of stories from the API and returns it
  //static so that its not called on the instance of storyList, instead its called on the class
  static async getStories(skip, limit) {
    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/stories?skip=${skip}&limit=${limit}`,
    });

    const stories = response.data.stories.map((story) => new Story(story));

    return new StoryList(stories);
  }

  // Adds story data to API, makes a Story instance, adds it to story list.
  async addStory(user, newStory) {
    const postStory = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: { token: user.loginToken, story: newStory },
    });

    return new Story(postStory.data.story);
  }

  //removes a story from the API
  async removeStory(user, storyId) {
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: { token: user.loginToken },
    });
  }

  //changes a story's data and updates the API,
  async changeStory(user, storyId, newStory) {

    const editedStory = await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "PATCH",
      data: { token: user.loginToken, story: newStory },
    });

    return new Story(editedStory.data.story);
  }

  //favorits a story
  async favoriteStory(user, storyId, addFav) {
    let method = addFav ? "POST" : "DELETE";

    await axios({
      method,
      url: `${BASE_URL}/users/${user.username}/favorites/${storyId}`,
      data: { token: user.loginToken },
    });
  }
}

 ////////////////////////////////////User Class used to represent the current user//////////////////////////////////

class User {
  constructor(
    { username, name, createdAt, favorites = [], ownStories = [] },
    token
  ) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map((s) => new Story(s));
    this.ownStories = ownStories.map((s) => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }


/////makes a new user on the API
  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }


//Login in user with API, make User instance & return it
  static async login(username, password) {
    try {
      const response = await axios({
        url: `${BASE_URL}/login`,
        method: "POST",
        data: { user: { username, password } },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        response.data.token
      );
    } catch (e) {
      alert("Wrong username or password plaease try again.");
    }
  }

// When we already have credentials in localStorage, log them in automatically.
  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories,
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }


///Changes the users name and password if they edit it
  static async changeUserInfo(token, username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/users/${username}`,
      method: "PATCH",
      data: { token, user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories,
      },
      response.data.token
    );
  }

  //Deletes the user and logs them out
  static async deleteUser(token, username) {
    await axios({
      url: `${BASE_URL}/users/${username}`,
      method: "DELETE",
      data: { token },
    });
///turns of the click listener off for the warning msg
//so that it can be used again for deleting a story or deleting a user
    $("#msgBtn").off("click");

    logout();
  }
}
