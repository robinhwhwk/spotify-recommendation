
window.onload = ()=> {
    const searchfield = document.getElementById('search-field')
    const csrftoken = Cookies.get('csrftoken');

    if (searchfield) {
        searchfield.addEventListener('keyup', ()=> {
            // Perform a rolling search every time a key is pressed 
    
            fetch(`?q=${searchfield.value}`)
            .then(response => response.text())
            .then(html => {
              // Update the document with results
              let parser = new DOMParser();
              let doc = parser.parseFromString(html, 'text/html');
              let results = doc.getElementById('search-results');
              if (results)
                document.getElementById('search-results').innerHTML = results.innerHTML;
            })
          });
    }
    
      const ytbuttons = document.querySelectorAll('.youtubebutton');
      
      if (ytbuttons) {
        ytbuttons.forEach(ytbutton => {
            ytbutton.addEventListener('click', (e)=> {

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
}