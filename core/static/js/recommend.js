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
                alert('success');
                const html = response
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let results = doc.querySelector('.recommend-results');
                document.querySelector('.recommend-results').innerHTML = results.innerHTML;
                // if (seedArtists.length > 1) {
                //     document.querySelector('.seeds-info')
                // }
                
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