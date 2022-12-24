$(window).on('load', ()=> {
    $('#btn_submit').click(()=> {
        const seedlist = document.querySelector('.seed-list')
        const seedArtists = seedlist.dataset.seedArtists
        const seedTracks = seedlist.dataset.seedTracks
        const seedGenres = seedlist.dataset.seedGenres
        if (seedArtists.length==0 && seedTracks.length==0 && seedGenres.length==0) {
            return;
        }
        $.ajaxSetup({
            headers: {
                'X-CSRFTOKEN': Cookies.get('csrftoken'),
            }
            });
        $.ajax({
            type: 'POST',
            url: "/core/recommendation/tracks/",
            data: JSON.stringify({
                'seedArtists' : seedArtists,
                'seedTracks' : seedTracks,
                'seedGenres' : seedGenres,
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
    // const seedlist = document.querySelector('.seed-list')
    // if (seedlist) {
    //         let tracks = seedlist.dataset.seedTracks;
    //         tracks = tracks.split(',')
    //         console.log(tracks)
    //         tracks.forEach(track => {
    //         if (track.length > 1) {
    //             const template = document.querySelectorAll('template')[0];
    //             const div = template.content.querySelector('div')
    //             const span  = template.content.querySelector('span')
    //             const clone = document.importNode(div, true);
    //             const xbutton = document.importNode(span, true)
    
    //             clone.dataset.nameTrack = seedlist.dataset.nameTrack;
    //             clone.dataset.nameArtist = seedlist.dataset.nameArtist;
    //             clone.dataset.trackId = track
    //             clone.dataset.artistId = seedlist.dataset.artistId;
    
    //             clone.textContent = clone.dataset.nameTrack + '-' + clone.dataset.nameArtist;
    
    //             xbutton.dataset.trackId = seedlist.dataset.trackId;
    
    //             xbutton.addEventListener('click', ()=> {
    //                 removeSeed(trackId=track);
    //             });
    //             seedlist.appendChild(clone);
    //             seedlist.appendChild(xbutton);
    //         }
    //     });
    // }
    //     if (seedlist) {
    //         let artists = seedlist.dataset.seedArtists;
    //         artists = artists.split(',')
    //         artists.forEach(artist => {
    //             if (artist.length > 1) {
    //                 const template = document.querySelectorAll('template')[0];
    //                 const div = template.content.querySelector('div')
    //                 const span  = template.content.querySelector('span')
    //                 const clone = document.importNode(div, true);
    //                 const xbutton = document.importNode(span, true)
        
    //                 clone.dataset.nameArtist = seedlist.dataset.nameArtist;
    //                 clone.dataset.artistId = artist;
          
    //                 clone.textContent = clone.dataset.nameArtist;
          
    //                 xbutton.addEventListener('click', ()=> {
    //                    removeSeed(artistId=artist);
    //                 });
    //                 seedlist.appendChild(clone);
    //                 seedlist.appendChild(xbutton);
    //             }
                
    //         });
    //     }
    
    //     if (seedlist) {
    //         let genres = seedlist.dataset.seedGenres;
    //         genres = genres.split(',')
    //         genres.forEach(genre => {
    //             if (genre.length > 1) {
    //                 const template = document.querySelectorAll('template')[0];
    //                 const div = template.content.querySelector('div')
    //                 const span  = template.content.querySelector('span')
    //                 const clone = document.importNode(div, true);
    //                 const xbutton = document.importNode(span, true)
        
    //                 clone.dataset.nameGenre = seedlist.dataset.nameGenre;
            
    //                 clone.textContent = clone.dataset.nameGenre;
        
    //                 xbutton.dataset.nameGenre == seedlist.dataset.nameGenre;
        
    //                 xbutton.addEventListener('click', ()=> {
    //                 removeSeed(genre=genre);
    //                 });
    //                 seedlist.appendChild(clone);
    //                 seedlist.appendChild(xbutton);
    //             }
                
    //         });
    //     }
    
})