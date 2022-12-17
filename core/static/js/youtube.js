const YoutubeController = function () {
  const clientId =
    "96372871277-2ogqobv13mpmvcafdtfhgvkukhvnas7a.apps.googleusercontent.com";
  const clientSecret = "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";
  const key = "AIzaSyD35rpbGE67JMpWkpMN7VwSZ-2H1n-wjGs";

  const _getSearch = async (query) => {
    const result = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?key=${key}&q=${query}&type=video&part=snippet`,
      {
        method: "GET"
      }
    );
    const data = await result.json()
    return data.items[0].id.videoId;
  };
  return {
    getSearch(query) {
        return _getSearch(query);
    }
  }
}();
