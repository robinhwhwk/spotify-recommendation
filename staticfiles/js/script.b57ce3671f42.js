
window.onload = ()=> {
    const searchfield = document.getElementById('search-field')
    const csrftoken = Cookies.get('csrftoken');
    const dropdownmenu = document.getElementById('myDropdown')

    if (searchfield) {
        searchfield.addEventListener('keyup', async ()=> {
            // Perform a rolling search every time a key is pressed 
            document.getElementById('search-results').classList.remove('inactive');
            await delay(300);
            fetch('/core/recommendation/search/?' + new URLSearchParams({
                q: searchfield.value,
                type: dropdownmenu.dataset.type,
            }))
            .then(response => response.text())
            .then(html => {
              // Update the document with results
              let parser = new DOMParser();
              let doc = parser.parseFromString(html, 'text/html');
              let results = doc.getElementById('search-results');
              if (results)
                document.getElementById('search-results').innerHTML = results.innerHTML;
                document.getElementById('search-results').dataset.returned = "true";
            })
          });
    }
    
    //   const ytbuttons = document.querySelectorAll('.youtubebutton');
      
    //   if (ytbuttons) {
    //     ytbuttons.forEach(ytbutton => {
    //         ytbutton.addEventListener('click', async (e)=> {
    //             if (!ytbutton.dataset.videoId) {

    //             }
    //             e.preventDefault();

    //             const title = ytbutton.dataset.title;
    //             const artist = ytbutton.dataset.artist;
    //             const query = title + ' - ' + artist;
                
    //             fetch('/core/youtube/', {
    //                 method: 'POST',
    //                 body: JSON.stringify({
    //                   title: title,
    //                   artist: artist,
    //                 }),
    //                 headers: {
    //                   'Content-Type': 'application/json',
    //                   'X-CSRFTOKEN': csrftoken,
    //                 },
    //               })
    //             .then((response) => response.json())
    //             .then((data) => {
    //                 // Extract the video ID from the response
    //                 const videoId = data.video_id;
    //                 window.open('https://www.youtube.com/watch?v=' + videoId)
    //                 ytbutton.dataset.videoId = videoId;
    //             });
    //         })
    //   })
    // }
    
    const dropdownbuttons = document.querySelectorAll(".dropbtn");
    if (dropdownbuttons) {
        dropdownbuttons.forEach(button => {
        button.addEventListener('click', async (e) => {
          button.nextElementSibling.classList.toggle("show");
        })
      })
    }

    // Set the drop down text content
    // If you change the search type, clear the field.
    let searchtypes = document.querySelector("#myDropdown")
    if (searchtypes) {
      searchtypes = searchtypes.childNodes;
      searchtypes.forEach(searchtype => {
        searchtype.addEventListener('click', async (e) => {
          // get the value of the old search type
          const previoustype = searchtype.parentElement.dataset.type;
          // set the value of the new search type
          searchtype.parentElement.dataset.type = searchtype.dataset.type;
          if (previoustype != searchtype.dataset.type) {
            searchfield.value = '';
          }
          if (searchtype.dataset.type == 'track') {
            searchtype.parentElement.previousElementSibling.textContent = 'Song'
          }
          if (searchtype.dataset.type == 'artist') {
            searchtype.parentElement.previousElementSibling.textContent = 'Artist'
          }
          if (searchtype.dataset.type == 'genre') {
            searchtype.parentElement.previousElementSibling.textContent = 'Genre'
          }
        })
      })
    }
    

}

window.addEventListener('click', (e) => {
  if (!e.target.matches('.dropbtn')) {
    // close dropdowns on click outside
    const dropdownbuttons = document.querySelectorAll(".dropbtn");
    if (dropdownbuttons) {
        dropdownbuttons.forEach(button => {
          if (button.nextElementSibling.classList.contains("show")) {
            button.nextElementSibling.classList.toggle("show");
          }
        })
    }
  }
  // toggle search suggestion cards
  const searchresults = document.getElementById('search-results')
    if (searchresults && searchresults.dataset.returned == "true") {
      if (e.target.matches('#search-field')) {
        searchresults.classList.toggle('inactive');
      } else {
        searchresults.classList.add('inactive');
      }
    }

    // Add to seed list when suggestions are clicked
    if (searchresults) {
      const songcards = searchresults.querySelectorAll('.song-cards')

      if (songcards && searchresults) {
        songcards.forEach(songcard => {
          if (songcard.contains(e.target)) {
          // get the value of the search type
          const searchtype = songcard.dataset.isTrack
          const seedlist = document.querySelector('.seed-list')
          const numseeds = document.querySelectorAll('#search-keyword').length;
          if (numseeds < 5) {
            // cloning the template
            const template = document.querySelectorAll('template')[0]
            const div = template.content.querySelector('div')
            const span  = template.content.querySelector('span')
            const clone = document.importNode(div, true);
            const xbutton = document.importNode(span, true)
    
            clone.dataset.isTrack = searchtype;
            clone.dataset.seedIndex = numseeds;
            xbutton.dataset.seedIndex = numseeds;

            // getting the input fields for the request
            let seed_tracks = document.querySelector('#btn_submit').children[0]
            let seed_artists = document.querySelector('#btn_submit').children[1]
            let seed_genres = document.querySelector('#btn_submit').children[2]
    
            if (searchtype == 'track') {
              clone.dataset.nameTrack = songcard.dataset.nameTrack;
              clone.dataset.nameArtist = songcard.dataset.nameArtist;
              clone.dataset.trackId = songcard.dataset.trackId;
              clone.dataset.artistId = songcard.dataset.artistId;
    
              clone.textContent = clone.dataset.nameTrack + '-' + clone.dataset.nameArtist;
    
              xbutton.dataset.trackId = songcard.dataset.trackId;
              xbutton.addEventListener('click', ()=> {
                 removeSeed(trackId=songcard.dataset.trackId, null, null);
              });
    
              seedlist.dataset.seedTracks += (songcard.dataset.trackId) + ',';
              seed_tracks.value += (songcard.dataset.nameTrack) + ',';
            }
            if (searchtype == 'artist') {
              clone.dataset.nameArtist = songcard.dataset.nameArtist;
              clone.dataset.artistId = songcard.dataset.artistId;
    
              clone.textContent = clone.dataset.nameArtist;
    
              xbutton.dataset.artistId = songcard.dataset.artistId;
    
              xbutton.addEventListener('click', ()=> {
                removeSeed(trackId=null, artistId=songcard.dataset.artistId, genre=null);
              });
    
              seedlist.dataset.seedArtists +=(songcard.dataset.artistId) + ',';
              seed_artists.innerHTML += (songcard.dataset.artistId) + ',';
            }
            if (searchtype == 'genre') {
              clone.dataset.nameGenre = songcard.dataset.nameGenre;
    
              clone.textContent = clone.dataset.nameGenre;
    
              xbutton.dataset.nameGenre = songcard.dataset.nameGenre;
              xbutton.addEventListener('click', ()=> {
                removeSeed(null, null, genre=songcard.dataset.nameGenre);
              });
              seedlist.dataset.seedGenres+=(songcard.dataset.nameGenre) + ',';
              seed_genres.innerHTML += (songcard.dataset.nameGenre) + ',';
            }
            seedlist.appendChild(clone);
            seedlist.appendChild(xbutton);
          } 
        }
      })
      }
    }

  // Add youtubue links to buttons when clicked
  const ytbuttons = document.querySelectorAll('.youtubebutton');
      
  if (ytbuttons) {
    ytbuttons.forEach(ytbutton => {
      if (ytbutton.contains(e.target)) {
        if (!ytbutton.dataset.videoId) {
          e.preventDefault();

            const title = ytbutton.dataset.title;
            const artist = ytbutton.dataset.artist;
            const query = title + ' ' + artist;
            let type = title.length > 1 ? 'video' : 'channel'
            
            fetch('/core/youtube/', {
                method: 'POST',
                body: JSON.stringify({
                  title: title,
                  artist: artist,
                  type: type,
                }),
                headers: {
                  'Content-Type': 'application/json',
                  'X-CSRFTOKEN': Cookies.get('csrftoken'),
                },
              })
            .then((response) => response.json())
            .then((data) => {
                // Extract the video ID from the response
                if (type == 'video') {
                  const videoId = data.video_id;
                  window.open('https://www.youtube.com/watch?v=' + videoId)
                  ytbutton.dataset.videoId = videoId;
                }
                else if (type == 'channel') {
                  const channelId = data.channel_id;
                  window.open('https://www.youtube.com/channel/' + channelId)
                  ytbutton.dataset.channelId = channelId;
                }
            });
          } else {
            window.open('https://www.youtube.com/watch?v=' + ytbutton.dataset.videoId);
          }
        
      }
  })
}

  // const playlistbutton = document.querySelector('.playlistbutton')
  // if (playlistbutton) {
  //   if (playlistbutton.contains(e.target)) {
  //     console.log('click  ')
  //   fetch('/core/playlist/', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'X-CSRFTOKEN': Cookies.get('csrftoken'),
  //     },
  //   })
  // .then((response) => response.json())
  // .then((data) => {
  //     // Extract the auth url
  //     const auth_url = data.auth_url;
  //     window.open(auth_url)
  // });
  //   }
  // }

});


function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function showSuggestions() {
  document.getElementById("search-results").classList.toggle("show");
}

function removeSeed(trackId=null, artistId=null, genre=null) {
  if (trackId) {
    const seed = document.querySelector(`#search-keyword[data-track-id="${trackId}"]`);
    const xbutton = document.querySelector(`#seed-remover[data-track-id="${trackId}"]`);
    seed.remove();
    xbutton.remove();
    
  }
  if (artistId) {
    const seed = document.querySelector(`#search-keyword[data-artist-id="${artistId}"]`);
    const xbutton = document.querySelector(`#seed-remover[data-artist-id="${artistId}"]`);
    seed.remove();
    xbutton.remove();
  }
  if (genre) {
    const seed = document.querySelector(`#search-keyword[data-name-genre="${genre}"]`);
    const xbutton = document.querySelector(`#seed-remover[data-name-genre="${genre}"]`);
    seed.remove();
    xbutton.remove();
  }
}

function AuthorizeUser() {
  fetch('/core/playlist/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFTOKEN': Cookies.get('csrftoken'),
    },
  })
.then((response) => response.json())
.then((data) => {
    // Extract the auth url
    const auth_url = data.auth_url;
    window.open(auth_url)
});
}