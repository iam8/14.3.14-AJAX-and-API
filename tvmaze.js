// Ioana Alex Mititean
// 11/18/22
// 14.3.14: AJAX and API Exercise (TV Maze)

"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");


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

        // Catch any errors in retrieving image URL, as some shows do not have an available image
        try {
            image = show.show.image.medium;
        } catch(err) {
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


/** Given a list of shows, create markup for each and add to the DOM.
 * If an empty array of shows is passed in, append a 'no results' message to the DOM.
*/
function populateShows(shows) {
    $showsList.empty();

    if (!shows.length) {
        $showsList.append($("<h3>", {id: "no-shows-msg", text: "No results"}));
        return;
    }

    for (let show of shows) {
        const $show = $(
            `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
                <div class="media">
                    <img
                        src=${show.image}
                        alt="Poster image for show '${show.name}'"
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


/** Given a show ID, get the show from API and return (promise) array of episodes with the info:
 *  { id, name, season, number }
 */
async function getEpisodesOfShow(showId) {
    const epResponse = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`);

    const epArray = [];
    for (let ep of epResponse.data) {

        const epInfo = {
            id: ep.id,
            name: ep.name,
            season: ep.season,
            number: ep.number
        }

        epArray.push(epInfo);
    }

    return epArray;
}


/** Given an array of episodes info, add this info to the episodes list in the DOM (with one episode per list item) and reveal the episodes section on the page.
 * The previous episodes list will be emptied prior to addition of the new episodes.
*/
function populateEpisodes(episodes) {
    $episodesList.empty();
    $("#no-eps-msg").remove();

    if (!episodes.length) {
        $episodesArea.append($("<h5>", {id: "no-eps-msg", text: "No results"}));
    }

    for (let ep of episodes) {
        $episodesList.append($("<li>",
                             {text: `${ep.name} (season ${ep.season}, number ${ep.number})`}));
    }

    $episodesArea.css("display", "block");
}

/** Upon submitting the search form, retrieve shows from the API and display them on the page. */
$searchForm.on("submit", async function (evt) {
    evt.preventDefault();
    await searchForShowAndDisplay();
});


/** Upon clicking the 'get episodes' button for a show, retrieve episode info for that show and display the episodes on the page. */
$showsList.on("click", ".Show-getEpisodes", async function() {
    const $showDiv = $(this).closest("div.Show");
    const showId = $showDiv.data("show-id");

    const epInfo = await getEpisodesOfShow(showId);
    populateEpisodes(epInfo);
})
