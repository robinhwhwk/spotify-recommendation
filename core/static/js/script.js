

window.onload = ()=> {
    const searchfield = document.getElementById('search-field')

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

function get_youtube() {
    const button = document.querySelector('.youtubebutton')
    const title = button.dataset.title
    const artist = button.dataset.artist
    const query = title + ' - ' + artist
    fetch((`?youtube=${query}`))
        .then(response => response.text())
        .then(html => {
          // Update the document with results
          let parser = new DOMParser();
          let doc = parser.parseFromString(html, 'text/html');
          let results = doc.querySelector('.youtubebutton');
          if (results)
            document.getElementById('search-results').innerHTML = results.innerHTML;
        })
}