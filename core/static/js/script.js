

searchfield.addEventListener('keydown', ()=> {
  // Perform a rolling search every time a key is pressed 
  console.log('here');
  fetch(`{% url 'searchtracks' %}?q=${searchfield.value}`)
  .then(response => response.text())
  .then(html => {
    // Update the document with results
    document.getElementById('search-results').innerHTML = html;
  })
})();

function search() {
  const searchfield = document.getElementById('search-field')
  $.ajax({
    url: 'search/',
    type: 'POST',
    data: {
        query: `${searchfield.value}`,
    },
    success: function (response) {
        // handle the response here
        return response 
    }
});
}