// This script inserts popular songs into the popular songs page
document.addEventListener("DOMContentLoaded", () => {
    const loadPage = (async () => {
        const token = await APIController.getToken();
        console.log("token: " + token);
        UIController.storeToken(token);
        const popularTracks = await APIController.getPopularTracks(token);
        UIController.displayPopularTracks(popularTracks);
    });
    loadPage();
    // how to insert? Get the popular songs container then call the function in script.js
})