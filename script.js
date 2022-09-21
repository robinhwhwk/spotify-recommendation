const songCardTemplate = document.querySelector("[data-song-template]");
const songCardContainer = document.querySelector("[data-song-card-container]");
const recommendationTemplate = document.querySelector("[data-recommendations]");
const searchInput = document.querySelector("[data-search]");
const searchBar = document.getElementById("search_bar");
const seedTemplate = document.querySelector("[data-selected-songs-template]");
const seedContainer = document.querySelector("#selected_songs");

window.onscroll = function () {
  stickNavbar();
};

// get the navbar
const navbar = document.getElementById("navbar");

// get the offset position of the navbar
const sticky = navbar.offsetTop;

// add the sticky class to navbar
function stickNavbar() {
  if (window.scrollY >= sticky) {
    navbar.classList.add("sticky");
  } else {
    navbar.classList.remove("sticky");
  }
}

const APIController = (function () {
  const clientId = "07cb160ca31e4211a4e9dccff9254a8c";
  const clientSecret = "bc0841f84e9f4eb781bb0e9b665cdfc7";

  // private methods
  const _getToken = async () => {
    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
      },
      body: "grant_type=client_credentials",
    });

    const data = await result.json();
    return data.access_token;
  };

  const _getFeaturedTracks = async (token) => {
    const limit = 10;

    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories/kpop/playlists/tracks?limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "applicaiton/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await result.json();
    return data.items;
  };

  const _getPopularTracks = async (token) => {
    const limit = 10;

    const result = await fetch(
      `https://api.spotify.com/v1/playlists/37i9dQZEVXbKXQ4mDTEBXq`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "applicaiton/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await result.json();
    return data.tracks.items;
  };

  const _getPlaylistByGenre = async (token) => {
    const limit = 10;

    const result = await fetch(
      `https://api.spotify.com/v1/browse/categories/dinner/playlists?limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.playlists.items;
  };

  const _getGenres = async (token) => {
    const result = await fetch(
      "https://api.spotify.com/v1/browse/categories?locale=sv_US",
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.categories.items;
  };

  const _getSearch = async (token, searchTerm) => {
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${searchTerm}&type=track&limit=10`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );

    const data = await result.json();
    return data.tracks.items;
  };

  const _getRecommendations = async (token, seedTracks) => {
    const result = await fetch(
      `https:api.spotify.com/v1/recommendations?limit=10&seed_tracks=${seedTracks}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const data = await result.json();
    return data.tracks;
  };

  const _getPlaylistsWithSong = async (token, seedTrack) => {
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${seedTrack}&type=playlist&limit=20`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const data = await result.json();
    return data.items;
  };

  const _getNewTracks = async (token) => {
    const limit = 20;

    const result = await fetch(
      `https://api.spotify.com/v1/playlists/37i9dQZF1DWSt89CX9de4L`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "applicaiton/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const data = await result.json();
    return data.tracks.items;
  };

  return {
    getToken() {
      return _getToken();
    },
    getFeaturedTracks() {
      return _getFeaturedTracks();
    },
    getPlaylistByGenre() {
      return _getPlaylistByGenre();
    },
    getGenres() {
      return _getGenres();
    },
    getSearch(token, searchTerm) {
      return _getSearch(token, searchTerm);
    },
    getRecommendations(token, seedTracks) {
      return _getRecommendations(token, seedTracks);
    },
    getPopularTracks(token) {
      return _getPopularTracks(token);
    },
    getPlaylistsWithSong(token, seedTrack) {
      return _getPlaylistsWithSong(token, seedTrack);
    },
    getNewTracks(token) {
      return _getNewTracks(token);
    },
  };
})();

const UIController = (function () {
  const DOMElements = {
    buttonSubmit: "#btn_submit",
    hfToken: "#hidden_token",
    divSonglist: "#search-cards",
    recommendList: "#recommendations",
    seedContainer: "#selected_songs",
  };

  let seedTracks = [];
  let audio = new Audio();

  const _displayTracks = (songs) => {
    songs.forEach((song) => {
      // make a copy of a card
      const card = songCardTemplate.content.cloneNode(true).children[0];
      let artists = [];
      // get all artist names
      if (song != null) {
        for (let i = 0; i < song.artists.length; ++i) {
          artists.push(song.artists[i].name);
        }
        // add artist names to song card
        const artist = artists.join(", ");

        // add preview play button
        const preview = `<input type="button" class="playbutton" onclick='UIController.playAudio("${song.preview_url}")' value="" title="Play a preview">`;

        const content = `<div class="songinfo">${preview}<div class="song"><div class="title">${song.name}</div><div class="artist">${artist}</div></div>`;

        card.insertAdjacentHTML("beforeend", content);

        // add card to song card container
        songCardContainer.append(card);

        // create image html
        const img = `<div><img src="${song.album.images[0].url}" alt="" height="100px" width="100px"></div>`;
        card.insertAdjacentHTML("afterbegin", img);

        // add youtube button
        const yt = YoutubeController.getSearch(`${song.name} + ${artist}`);
        const ytbutton = `<input type="button" class="ytbutton" onclick='window.open('https://www.youtube.com/watch?v=${yt}')' value="" title="Open in YouTube">`;
        
        card.children[1].insertAdjacentHTML("afterbegin", ytbutton);

        // when you click on cards, add it to the seed track list
        card.children[0].addEventListener("click", async (e) => {
            
          // if there are already 5 seed tracks then return
          if (seedTracks.length >= 5) {
            console.log("You can have up to 5 seed tracks.");
            return;
          }
          // call addSeedTrack and add the song id to the list
          UIController.addSeedTrack(song.id);

          // make a label clone from the template
          const label = seedTemplate.content.cloneNode(true).children[0];
          // add the song name to the
          label.textContent = song.name;
          label.addEventListener("click", async (e) => {
            seedContainer.removeChild(label);
            const index = seedTracks.indexOf(song.id);
            seedTracks.splice(index, 1);
          });
          seedContainer.append(label);
        });
      }
      // when you hover over song cards darken the card
      card.children[0].children[0].addEventListener("mouseover", async (e) => {
        card.classList.add("mouseover");
      });
      card.children[0].children[0].addEventListener("mouseout", async (e) => {
        card.classList.remove("mouseover");
      });
      return { name: song.name, artist: song.artists[0].name, element: card };
    });
  };
  let ranking = 0;

  const _displayPopularTracks = (songs) => {
    songs.forEach((song) => {
      const track = song.track;
      // make a copy of a card
      const card = songCardTemplate.content.cloneNode(true).children[0];
      if (track !== null) {
        let artists = [];
        // get all artist names
        for (let i = 0; i < track.artists.length; ++i) {
          artists.push(track.artists[i].name);
        }
        // add artist names to song card
        const artist = artists.join(", ");

        // add preview play button
        const preview = `<input type="button" class="playbutton" onclick='UIController.playAudio("${song.preview_url}")' value="" title="Play a preview">`;

        const content = `<div class="songinfo">${preview}<div class="song"><div class="title">${song.name}</div><div class="artist">${artist}</div></div>`;

        card.insertAdjacentHTML("beforeend", content);

        // add card to song card container
        songCardContainer.append(card);

        // create image html
        const img = `<div><img src="${track.album.images[0].url}" alt="" height="100px" width="100px"></div>`;
        card.insertAdjacentHTML("afterbegin", img);

        // add youtube button
        const yt = YoutubeController.getSearch(`${track.name} + ${artist}`);
        const ytbutton = `<input type="button" class="ytbutton" onclick='window.open('https://www.youtube.com/watch?v=${yt}')' value="" title="Open in YouTube">`;
        
        card.children[1].insertAdjacentHTML("afterbegin", ytbutton);

        ranking += 1;
        card.insertAdjacentHTML("beforebegin", ranking);
        if (track.preview_url == null) {
          card.children[0].insertAdjacentHTML(
            "beforeend",
            "<div><b>No preview available<b></div>"
          );
        }

        card.children[0].addEventListener("click", async (e) => {
          // prevent page reset
          e.preventDefault();
          // get stored token
          const token = UIController.getStoredToken().token;
          // get recommendations using seed tracks
          const recommendations = await APIController.getRecommendations(
            token,
            track.id
          );
          // display recommendations
          UIController.displayRecommendations(recommendations);
          // reset seed tracks
          UIController.resetSeedTracks();
          // go to recommendations page
          window.location.href = "recommendations.html";
        });

        return {
          name: track.name,
          artist: track.artists[0].name,
          element: card,
        };
      }
    });
  };

  const _displayRecommendations = (songs) => {
    songs.forEach((song) => {
      // make rec list visible
      const recommendList = document.querySelector(DOMElements.recommendList);
      recommendList.classList.remove("inactive");
      // make a copy of a card
      const card = recommendationTemplate.content.cloneNode(true).children[0];
      let artists = [];
      // get all artist names
      for (let i = 0; i < song.artists.length; ++i) {
        artists.push(song.artists[i].name);
      }
      // add preview play button
      const preview = `<input type="button" class="playbutton" onclick='UIController.playAudio("${song.preview_url}")' value="" title="Play a preview">`;

      const content = `<div class="songinfo">${preview}<div class="song"><div class="title">${song.name}</div><div class="artist">${artist}</div></div>`;

      card.insertAdjacentHTML("beforeend", content);

      // add card to song card container
      songCardContainer.append(card);

      // create image html
      const img = `<div><img src="${song.album.images[0].url}" alt="" height="100px" width="100px"></div>`;
      card.insertAdjacentHTML("afterbegin", img);

      // add youtube button
      const yt = YoutubeController.getSearch(`${song.name} + ${artist}`);
      const ytbutton = `<input type="button" class="ytbutton" onclick='window.open('https://www.youtube.com/watch?v=${yt}')' value="" title="Open in YouTube">`;
      
      card.children[1].insertAdjacentHTML("afterbegin", ytbutton);
      if (song.preview_url == null) {
        card.insertAdjacentHTML(
          "beforeend",
          "<p><b>No preview available<b><p>"
        );
      }
      return { name: song.name, artist: song.artists[0].name, element: card };
    });
  };

  return {
    inputField() {
      return {
        submit: document.querySelector(DOMElements.buttonSubmit),
        tracks: document.querySelector(DOMElements.divSonglist),
        rec: document.querySelector(DOMElements.recommendList),
        seeds: document.querySelector(DOMElements.seedContainer),
      };
    },
    createTrack(id, name) {
      const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
      document
        .querySelector(DOMElements.divSonglist)
        .insertAdjacentHTML("beforeend", html);
    },
    storeToken(value) {
      document.querySelector(DOMElements.hfToken).value = value;
    },
    getStoredToken() {
      return {
        token: document.querySelector(DOMElements.hfToken).value,
      };
    },
    resetTracks() {
      this.inputField().tracks.innerHTML = "";
    },
    resetRecommendations() {
      this.inputField().rec.innerHTML = "Recommendations:";
    },
    displayTracks(songs) {
      return _displayTracks(songs);
    },
    displayRecommendations(songs) {
      return _displayRecommendations(songs);
    },
    displayPopularTracks(songs) {
      return _displayPopularTracks(songs);
    },
    addSeedTrack(id) {
      // add the song id to the seed track list
      seedTracks.push(id);
    },
    getSeedTracks() {
      return seedTracks.join(",");
    },
    resetSeedTracks() {
      seedTracks = [];
      this.inputField().seeds.innerHTML = "";
    },
    playAudio(preview_url) {
      if (preview_url == null) return;
      if (!audio.paused && audio.src == preview_url) return audio.pause();
      audio.src = preview_url;
      audio.play();
    },
  };
})();
