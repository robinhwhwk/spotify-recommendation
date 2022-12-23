// This script inserts new songs into the new songs page
document.addEventListener("DOMContentLoaded", () => {
    const loadPage = (async () => {
        const token = await APIController.getToken();
        console.log("token: " + token);
        UIController.storeToken(token);
        const newTracks = await APIController.getNewTracks(token);
        UIController.displayPopularTracks(newTracks);
    });
    loadPage();
    // how to insert? Get the popular songs container then call the function in script.js
})