$(window).on('load', ()=> {
    $('#btn_submit').click(()=> {
        const seedlist = document.querySelector('.seed-list')

        const artistlist = seedlist.querySelectorAll('[data-is-track="artist"]')
        const genrelist = seedlist.querySelectorAll('[data-is-track="genre"]')
        const tracklist = seedlist.querySelectorAll('[data-is-track="track"]')

        if (tracklist.length<1 && genrelist.length<1 && artistlist.length<1) {
            return;
        }

        let track_ids = []
        tracklist.forEach(track => {
            track_ids.push(track.dataset.trackId)
        })
        let artist_ids = []
        artistlist.forEach(artist => {
            artist_ids.push(artist.dataset.artistId)
        })
        let genrenames = []
        genrelist.forEach(genre => {
            genrenames.push(genre.dataset.nameGenre)
        })

        track_ids = track_ids.join(',')
        artist_ids = artist_ids.join(',')
        genrenames = genrenames.join(',')


        $.ajaxSetup({
            headers: {
                'X-CSRFTOKEN': Cookies.get('csrftoken'),
            }
            });
        $.ajax({
            type: 'POST',
            url: "/core/recommendation/tracks/",
            data: JSON.stringify({
                'seedArtists' : artist_ids,
                'seedTracks' : track_ids,
                'seedGenres' : genrenames,
            }),
            success: (function(response) {
                const html = response
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let results = doc.querySelector('.recommend-results');
                // copy the results from the response to the recommendations page
                document.querySelector('.recommend-results').innerHTML = results.innerHTML;

                const artistlist = seedlist.querySelectorAll('[data-is-track="artist"]')
                const genrelist = seedlist.querySelectorAll('[data-is-track="genre"]')
                const tracklist = seedlist.querySelectorAll('[data-is-track="track"]')
                const seedsinfo = document.querySelector('.seeds-info')

                if (tracklist.length == 1 && artistlist.length == 0 && genrelist.length == 0) {
                    seedsinfo.innerHTML = `
            <h3>Similar Songs to </h3>
            <h3>${tracklist[0].dataset.nameTrack} - ${tracklist[0].dataset.nameArtist}:</h3>
            <img src="${tracklist[0].dataset.imageUrl}" alt="track picture" id="bigimage">
                    `
                }
                else if (artistlist.length == 1 && tracklist.length == 0 && genrelist.length == 0) {
                    seedsinfo.innerHTML = `
            <h3>Recommendations based on</h3>
            <h3>${artistlist[0].dataset.nameArtist}:</h3>
            <img src="${artistlist[0].dataset.imageUrl}" alt="artist picture" id="bigimage" class="center">
                    `
                }
                else if (artistlist.length == 0 && tracklist.length == 0 && genrelist.length == 1) {
                    seedsinfo.innerHTML = `
            <h3>Recommendations based on</h3>
            <h3>${genrelist[0].dataset.nameGenre}:</h3>
            <img alt="" id="bigimage" class="genrepicture">
                    `
                } else {
                    let tracknames = []
                    tracklist.forEach(track => {
                        tracknames.push(track.dataset.nameTrack + ' - ' + track.dataset.nameArtist)
                    })
                    let artistnames = []
                    artistlist.forEach(artist => {
                        artistnames.push(artist.dataset.nameArtist)
                    })
                    let genrenames = []
                    genrelist.forEach(genre => {
                        genrenames.push(genre.dataset.nameGenre)
                    })
                    seedsinfo.innerHTML = `
            <h3>Recommendations based on</h3>
            ${tracknames.length == 0 ? '': `<p>Songs: ${tracknames.join(', ')}</p>`}
            ${artistnames.length == 0 ? '': `<p>Artists: ${artistnames.join(', ')}</p>`}
            ${genrenames.length == 0 ? '': `<p>Genres: ${genrenames.join(', ')}</p>`}
            <img alt="" id="bigimage" class="genrepicture">
                    `
                }
                
            }
            )
        })
    })
})