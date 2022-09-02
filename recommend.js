document.addEventListener("DOMContentLoaded", () => {
    const loadPage = (async () => {
        const token = await APIController.getToken();
        console.log("token: " + token);
        // const featuredTracks = await APIController.getFeaturedTracks(token);
        // _displayTracks(featuredTracks);
        UIController.storeToken(token);
        // const playlists = await APIController.getPlaylistByGenre(token);
        // prevent search form from resetting page every time it submits
        searchBar.addEventListener('submit', async (e) => {
            e.preventDefault();
        })
    });
    loadPage();
})
const APPController = (function(UICtrl, APICtrl) {

    // get input field object reference
    const DOMInputs = UICtrl.inputField();

    // create submit button click event listner
    // when you press submit, generate song recommendations
    DOMInputs.submit.addEventListener('click', async (e) => { 
        // prevent page reset
        e.preventDefault();
        // get stored token
        const token = UICtrl.getStoredToken().token;
        // get stored seed tracks
        const seedTracks = UICtrl.getSeedTracks();
        // if there are no seed tracks return
        if (seedTracks == "") return;
        // reset search results
        UICtrl.resetTracks();
        // reset recommendation list
        UICtrl.resetRecommendations();
        // get recommendations using seed tracks
        const recommendations = await APICtrl.getRecommendations(token, seedTracks);
        // display recommendations
        UICtrl.displayTracks(recommendations);
        // reset seed tracks
        UICtrl.resetSeedTracks();
    })

    document.addEventListener('input', async (e) => {
        e.preventDefault();
        if (searchInput.value == "") return;
        // reset search results
        UICtrl.resetTracks();
        UICtrl.inputField().rec.classList.add("inactive");
        // get stored token
        const token = UICtrl.getStoredToken().token;
        // get search term
        const searchTerm = searchInput.value;
        // get tracks
        const searchResults = await APICtrl.getSearch(token, searchTerm);
        // display tracks
        UICtrl.displayTracks(searchResults);
    })

    return {
        init() {
            console.log("App is starting")
        }
    }
})(UIController, APIController);

APPController.init();   
/* 
When button is clicked, use spotify search API and search 
*/