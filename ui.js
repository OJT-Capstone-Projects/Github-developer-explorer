/* ================================================
   GitHub Developer Explorer  –  ui.js
   DOM Rendering Functions  |  CPR-level JS only
   No API calls  |  No fetch()  |  No frameworks
   ================================================ */


/* ================================================
   DARK / LIGHT MODE TOGGLE
   CPR DOM concepts used:
     - getElementById()
     - classList.add() / classList.remove() / classList.contains()
     - innerText
     - addEventListener()  (click event)
   ================================================ */
var themeToggleBtn = document.getElementById("themeToggleBtn");
var themeIcon      = document.getElementById("themeIcon");
var themeLabel     = document.getElementById("themeLabel");
var bodyEl         = document.getElementById("bodyRoot");

themeToggleBtn.addEventListener("click", function () {
  // Check if dark mode is currently ON
  if (bodyEl.classList.contains("dark")) {
    // Switch to LIGHT mode
    bodyEl.classList.remove("dark");
    themeIcon.innerText  = "\u263E";   // crescent moon character
    themeLabel.innerText = "Dark Mode";
  } else {
    // Switch to DARK mode
    bodyEl.classList.add("dark");
    themeIcon.innerText  = "\u2600";   // sun character
    themeLabel.innerText = "Light Mode";
  }
});


/* ------------------------------------------------
   DOM ELEMENT REFERENCES
   ------------------------------------------------ */
var loadingSection  = document.getElementById("loadingSection");
var errorSection    = document.getElementById("errorSection");
var errorMessage    = document.getElementById("errorMessage");
var resultsWrapper  = document.getElementById("resultsWrapper");

var profileAvatar   = document.getElementById("profileAvatar");
var profileName     = document.getElementById("profileName");
var profileUsername = document.getElementById("profileUsername");
var profileBio      = document.getElementById("profileBio");
var profileFollowers = document.getElementById("profileFollowers");
var profileFollowing = document.getElementById("profileFollowing");
var profileRepos    = document.getElementById("profileRepos");

var repoGrid        = document.getElementById("repoGrid");
var languageGrid    = document.getElementById("languageGrid");

var searchBtn       = document.getElementById("searchBtn");
var searchInput     = document.getElementById("searchInput");


/* ================================================
   1.  showLoader()
       Show the loading spinner section
   ================================================ */
function showLoader() {
  loadingSection.classList.remove("hidden");
  errorSection.classList.add("hidden");
  resultsWrapper.classList.add("hidden");
}


/* ================================================
   2.  hideLoader()
       Hide the loading spinner section
   ================================================ */
function hideLoader() {
  loadingSection.classList.add("hidden");
}


/* ================================================
   3.  showError(message)
       Show the error section with a message
   ================================================ */
function showError(message) {
  hideLoader();
  resultsWrapper.classList.add("hidden");

  errorMessage.innerText = message;
  errorSection.classList.remove("hidden");
}


/* ================================================
   4.  displayProfile(profileData)

       profileData shape:
       {
         avatar    : "https://..."      (string)
         name      : "Dan Abramov"      (string)
         username  : "gaearon"          (string)
         bio       : "..."              (string)
         followers : 74200              (number)
         following : 171                (number)
         publicRepos: 263               (number)
       }
   ================================================ */
function displayProfile(profileData) {
  // Avatar
  profileAvatar.src = profileData.avatar || "https://placehold.co/108x108/e8f4ea/2da44e?text=GH";
  profileAvatar.alt = profileData.name || "Avatar";

  // Name
  profileName.innerText = profileData.name || "No name provided";

  // Username
  profileUsername.innerText = "@" + (profileData.username || "unknown");

  // Bio
  if (profileData.bio) {
    profileBio.innerText = profileData.bio;
    profileBio.classList.remove("hidden");
  } else {
    profileBio.innerText = "No bio available.";
  }

  // Stats – format large numbers with commas
  profileFollowers.innerText = formatNumber(profileData.followers || 0);
  profileFollowing.innerText = formatNumber(profileData.following || 0);
  profileRepos.innerText     = formatNumber(profileData.publicRepos || 0);

  // Show the results wrapper
  resultsWrapper.classList.remove("hidden");
}


/* ================================================
   5.  displayRepositories(repoData)

       repoData is an Array of objects:
       [
         {
           name        : "redux"         (string)
           description : "..."           (string)
           stars       : 60500           (number)
           forks       : 15200           (number)
           language    : "JavaScript"    (string)
         },
         ...
       ]
   ================================================ */
function displayRepositories(repoData) {
  // Clear previous cards
  repoGrid.innerHTML = "";

  if (!repoData || repoData.length === 0) {
    var empty = document.createElement("p");
    empty.innerText = "No repositories found.";
    empty.className = "no-data-text";
    repoGrid.appendChild(empty);
    return;
  }

  // Build one card per repo
  repoData.forEach(function (repo) {

    // Card wrapper
    var card = document.createElement("div");
    card.classList.add("repo-card");

    // Repo name
    var nameEl = document.createElement("p");
    nameEl.classList.add("repo-name");
    nameEl.innerText = repo.name || "Unnamed repo";

    // Description
    var descEl = document.createElement("p");
    descEl.classList.add("repo-desc");
    descEl.innerText = repo.description || "No description provided.";

    // Meta row (stars, forks, language)
    var metaRow = document.createElement("div");
    metaRow.classList.add("repo-meta");

    // Stars
    var starsEl = document.createElement("span");
    starsEl.classList.add("repo-meta-item");
    starsEl.innerHTML = "<span class='icon-star'></span> " + formatNumber(repo.stars || 0);

    // Forks
    var forksEl = document.createElement("span");
    forksEl.classList.add("repo-meta-item");
    forksEl.innerHTML = "<span class='icon-fork'></span> " + formatNumber(repo.forks || 0);

    // Language
    var langEl = document.createElement("span");
    langEl.classList.add("repo-meta-item");

    if (repo.language) {
      var dot = document.createElement("span");
      dot.classList.add("lang-dot");

      var langText = document.createTextNode(repo.language);

      langEl.appendChild(dot);
      langEl.appendChild(langText);
    } else {
      langEl.innerText = "Language N/A";
    }

    // Assemble meta row
    metaRow.appendChild(starsEl);
    metaRow.appendChild(forksEl);
    metaRow.appendChild(langEl);

    // Assemble card
    card.appendChild(nameEl);
    card.appendChild(descEl);
    card.appendChild(metaRow);

    // Add card to grid
    repoGrid.appendChild(card);
  });
}


/* ================================================
   6.  displayLanguages(languageData)

       languageData is an Array of objects:
       [
         { language: "JavaScript", count: 12 },
         { language: "TypeScript", count: 5  },
         ...
       ]
   ================================================ */
function displayLanguages(languageData) {
  // Clear previous cards
  languageGrid.innerHTML = "";

  if (!languageData || languageData.length === 0) {
    var empty = document.createElement("p");
    empty.innerText = "No language data available.";
    empty.className = "no-data-text";
    languageGrid.appendChild(empty);
    return;
  }

  // Colour class pool  (matches .lc-0 … .lc-10 in style.css)
  var colorClasses = [
    "lc-0", "lc-1", "lc-2", "lc-3", "lc-4",
    "lc-5", "lc-6", "lc-7", "lc-8", "lc-9", "lc-10"
  ];

  languageData.forEach(function (item, index) {

    // Card wrapper
    var card = document.createElement("div");
    card.classList.add("lang-card");

    // Coloured circle with 2-letter abbreviation
    var circle = document.createElement("div");
    circle.classList.add("lang-circle");

    // Pick colour class by cycling through the pool
    var colorClass = colorClasses[index % colorClasses.length];
    circle.classList.add(colorClass);

    // Abbreviation: first 2 letters of language name
    var abbr = (item.language || "??").substring(0, 2).toUpperCase();
    circle.innerText = abbr;

    // Language name
    var nameEl = document.createElement("p");
    nameEl.classList.add("lang-name");
    nameEl.innerText = item.language || "Unknown";

    // Repo count
    var countEl = document.createElement("p");
    countEl.classList.add("lang-count");
    countEl.innerText = item.count + (item.count === 1 ? " repo" : " repos");

    // Assemble card
    card.appendChild(circle);
    card.appendChild(nameEl);
    card.appendChild(countEl);

    // Add to grid
    languageGrid.appendChild(card);
  });
}


/* ================================================
   HELPER – formatNumber()
   Adds commas to large numbers  e.g. 74200 → 74,200
   ================================================ */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


/* ================================================
   SEARCH BUTTON  &  ENTER KEY  EVENT LISTENERS
   Now handled by app.js (searchUser function).
   The demo wiring below has been removed.
   ================================================ */


/* ================================================
   EXPORTS
   Member 2 can import these functions directly.

   Usage in another file:
     displayProfile(profileData);
     displayRepositories(repoData);
     displayLanguages(languageData);
     showLoader();
     hideLoader();
     showError("message");
   ================================================ */
// Browser-safe export  (works without a module bundler)
window.displayProfile      = displayProfile;
window.displayRepositories = displayRepositories;
window.displayLanguages    = displayLanguages;
window.showLoader          = showLoader;
window.hideLoader          = hideLoader;
window.showError           = showError;
