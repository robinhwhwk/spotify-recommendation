
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
    
      const ytbuttons = document.querySelectorAll('.youtubebutton');
      
      if (ytbuttons) {
        ytbuttons.forEach(ytbutton => {
            ytbutton.addEventListener('click', async (e)=> {

                e.preventDefault();

                const title = ytbutton.dataset.title;
                console.log(title)
                const artist = ytbutton.dataset.artist;
                const query = title + ' - ' + artist;
                
                fetch('/core/youtube/', {
                    method: 'POST',
                    body: JSON.stringify({
                      title: title,
                      artist: artist,
                    }),
                    headers: {
                      'Content-Type': 'application/json',
                      'X-CSRFTOKEN': csrftoken,
                    },
                  })
                .then((response) => response.json())
                .then((data) => {
                    // Extract the video ID from the response
                    const videoId = data.video_id;
                    window.open('https://www.youtube.com/watch?v=' + videoId)
                });
            })
      })
    }
    
    const dropdownbuttons = document.querySelectorAll(".dropbtn");
    if (dropdownbuttons) {
        dropdownbuttons.forEach(button => {
        button.addEventListener('click', async (e) => {
          button.nextElementSibling.classList.toggle("show");
        })
      })
    }

    const searchtypes = document.querySelector("#myDropdown").childNodes
    if (searchtypes) {
      searchtypes.forEach(searchtype => {
        searchtype.addEventListener('click', async (e) => {
          // set the value of the option
          searchtype.parentElement.dataset.type = searchtype.dataset.type;
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

  const searchresults = document.getElementById('search-results')
    if (searchresults.dataset.returned == "true") {
      if (e.target.matches('#search-field')) {
        searchresults.classList.toggle('inactive');
      } else {
        searchresults.classList.add('inactive');
      }
    }
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

