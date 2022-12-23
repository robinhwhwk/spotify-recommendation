let audio = new Audio();

function playAudio(preview_url) {
    if (preview_url == null) return;
    if (!audio.paused && audio.src == preview_url) return audio.pause();
    audio.src = preview_url;
    audio.play();
}