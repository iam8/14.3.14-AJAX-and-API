// Ioana Alex Mititean
// 11/18/22
// 14.3.14: AJAX and API Exercise (TV Maze)

"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");


/** Given a search term, search for tv shows that match that query.
 *
 *    Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}.
 *    If no image URL is given by API, put in a default image URL.
 */
async function getShowsByTerm(searchTerm) {

    const response = await axios.get("http://api.tvmaze.com/search/shows", {
        params: {
            q: searchTerm
        }
    })

    const showsArr = [];
    for (let show of response.data) {

        let image;
        // image = show.show.image ? show.show.image.medium : "https://tinyurl.com/tv-missing"

        try {
            image = show.show.image.medium;
        } catch(err) {
            console.log(err);
            image = "https://tinyurl.com/tv-missing";
        }

        const showInfo = {
            id: show.show.id,
            name: show.show.name,
            summary: show.show.summary,
            image
        };

        showsArr.push(showInfo);
    }

    return showsArr;
}


/** Given a list of shows, create markup for each and add to the DOM. */
function populateShows(shows) {
    $showsList.empty();

    for (let show of shows) {
        const $show = $(
            `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
                <div class="media">
                <img
                    src=${show.image}
                    alt="Show image"
                    class="w-25 me-3">
                <div class="media-body">
                    <h5 class="text-primary">${show.name}</h5>
                    <div><small>${show.summary}</small></div>
                    <button class="btn btn-outline-light btn-sm Show-getEpisodes">
                        Episodes
                    </button>
                </div>
                </div>
            </div>
        `);

        $showsList.append($show);
    }
}


/** Handle search form submission: get shows from API and display them.
 *    Hide the episodes area (that only gets shown if they ask for episodes).
 */
async function searchForShowAndDisplay() {
    const term = $("#searchForm-term").val();
    const shows = await getShowsByTerm(term);

    $episodesArea.hide();
    populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
    evt.preventDefault();
    await searchForShowAndDisplay();
});


/** Given a show ID, get the show from API and return (promise) array of episodes:
 *  { id, name, season, number }
 */
async function getEpisodesOfShow(id) {}


/** Write a clear docstring for this function... */
function populateEpisodes(episodes) {}
