/* ================================================
   GitHub Developer Explorer  –  app.js
   Business Logic: search, sort, language breakdown
   Connects api.js  ←→  ui.js
   ================================================ */


/* ================================================
   STATE
   Holds the current repositories array so the
   sort functions can re-render without re-fetching.
   ================================================ */
let currentRepositories = [];


/* ================================================
   1. calculateLanguageBreakdown(repos)

      Accepts an array of raw GitHub repo objects.
      Returns a sorted array of language objects:
        [
          { language: "JavaScript", count: 10 },
          { language: "HTML",       count:  4 },
          { language: "CSS",        count:  4 },
          { language: "Python",     count:  2 },
        ]

      Topics covered:
        - Array.reduce()  – build a frequency object
        - Object.keys()   – extract language names
        - Array.filter()  – remove repos with no language
        - Array.sort()    – rank by count (desc)
        - Arrow Functions, Template Literals
   ================================================ */
const calculateLanguageBreakdown = (repos) => {
  // Step 1 – keep only repos that have a language set
  const reposWithLanguage = repos.filter((repo) => repo.language !== null);

  // Step 2 – reduce the array into a frequency object
  //   e.g. { JavaScript: 10, HTML: 4, CSS: 4, Python: 2 }
  const languageCounts = reposWithLanguage.reduce((accumulator, repo) => {
    const lang = repo.language;

    if (accumulator[lang]) {
      // Language already seen – increment its count
      accumulator[lang] = accumulator[lang] + 1;
    } else {
      // First time seeing this language – start count at 1
      accumulator[lang] = 1;
    }

    return accumulator;
  }, {}); // {} is the initial value of the accumulator

  // Step 3 – convert the object into a sorted array of objects
  const languageArray = Object.keys(languageCounts)
    .map((lang) => ({
      language: lang,
      count: languageCounts[lang]
    }))
    .sort((a, b) => b.count - a.count); // sort descending by count

  return languageArray;
};


/* ================================================
   2. sortRepositories(sortBy)

      Sorts the currentRepositories array and
      re-renders the repo grid via displayRepositories().

      sortBy values:
        "stars"  – sort by stargazers_count (desc)
        "forks"  – sort by forks_count (desc)
        "name"   – sort alphabetically by name (asc)

      Topics covered:
        - Array.sort()
        - Arrow Functions, Destructuring
   ================================================ */
const sortRepositories = (sortBy) => {
  // Guard: nothing to sort yet
  if (currentRepositories.length === 0) return;

  // Make a shallow copy so we don't mutate the stored array
  const sorted = [...currentRepositories];

  if (sortBy === "stars") {
    sorted.sort((a, b) => b.stars - a.stars);
  } else if (sortBy === "forks") {
    sorted.sort((a, b) => b.forks - a.forks);
  } else if (sortBy === "name") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Re-render the repository grid with the sorted list
  displayRepositories(sorted);
};


/* ================================================
   3. mapProfileData(rawProfile)

      Transforms the raw GitHub API profile object
      into the shape that displayProfile() expects.
   ================================================ */
const mapProfileData = (rawProfile) => {
  const {
    avatar_url,
    name,
    login,
    bio,
    followers,
    following,
    public_repos
  } = rawProfile;

  return {
    avatar:      avatar_url,
    name:        name,
    username:    login,
    bio:         bio,
    followers:   followers,
    following:   following,
    publicRepos: public_repos
  };
};


/* ================================================
   4. mapRepoData(rawRepos)

      Transforms the raw GitHub API repos array
      into the shape that displayRepositories() expects.
   ================================================ */
const mapRepoData = (rawRepos) => {
  return rawRepos.map((repo) => ({
    name:        repo.name,
    description: repo.description,
    stars:       repo.stargazers_count,
    forks:       repo.forks_count,
    language:    repo.language
  }));
};


/* ================================================
   5. searchUser()

      Core orchestration function.
      1. Reads the username from the search input
      2. Validates it is not empty
      3. Shows the loader
      4. Fires BOTH profile and repos requests in parallel
         using Promise.all()
      5. Maps raw data → display-ready shapes
      6. Calculates the language breakdown
      7. Calls the ui.js display functions
      8. Fetches & logs rate limit info
      9. Hides the loader in the finally block

      Topics covered:
        - async / await
        - try / catch / finally
        - Promise.all()  (parallel fetch)
        - Error object
        - Template Literals, Destructuring
   ================================================ */
const searchUser = async () => {
  // Read the username from the input field
  const inputEl = document.getElementById("searchInput");
  const username = inputEl.value.trim();

  // Validate – do not proceed with an empty string
  if (username === "") {
    showError("Please enter a GitHub username before searching.");
    return;
  }

  try {
    // Show the loading spinner (from ui.js)
    showLoader();

    // Fetch profile and repositories in PARALLEL for speed
    const [rawProfile, rawRepos] = await Promise.all([
      fetchProfile(username),
      fetchRepositories(username)
    ]);

    // Transform raw API data into display-ready shapes
    const profileData  = mapProfileData(rawProfile);
    const repoData     = mapRepoData(rawRepos);
    const languageData = calculateLanguageBreakdown(rawRepos);

    // Save repos to state so sortRepositories() can reuse them
    currentRepositories = repoData;

    // Render everything via ui.js functions
    displayProfile(profileData);
    displayRepositories(repoData);
    displayLanguages(languageData);

    // Fetch and log rate limit info (non-blocking, no await needed
    // at the top level – we fire-and-forget then update the UI)
    fetchRateLimit().then((rateInfo) => {
      console.log(
        `GitHub API Rate Limit — ` +
        `Used: ${rateInfo.used} / ${rateInfo.limit} | ` +
        `Remaining: ${rateInfo.remaining} | ` +
        `Resets at: ${rateInfo.resetTime}`
      );
    });

  } catch (error) {
    // Pass the Error object's message to the UI error display
    showError(error.message);

  } finally {
    // Always hide the loader whether the request succeeded or failed
    hideLoader();
  }
};


/* ================================================
   EVENT LISTENERS
   - click  on the Search button
   - input  on the search field (clears old errors)
   - change on the sort dropdown

   Topics covered:
     - addEventListener()
     - click event
     - input event
     - change event
   ================================================ */

// Search button – click event
const appSearchBtn = document.getElementById("searchBtn");
appSearchBtn.addEventListener("click", () => {
  searchUser();
});

// Search input – input event
// Clears the error section as the user starts typing again
const appSearchInput = document.getElementById("searchInput");
appSearchInput.addEventListener("input", () => {
  const errorSection = document.getElementById("errorSection");
  if (errorSection && !errorSection.classList.contains("hidden")) {
    errorSection.classList.add("hidden");
  }
});

// Sort dropdown – change event
// The HTML element with id="sortSelect" is expected in index.html.
// If Member 1 adds that element, this listener wires it up automatically.
const sortSelect = document.getElementById("sortSelect");
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    sortRepositories(sortSelect.value);
  });
}


/* ================================================
   EXPORTS  (browser-safe, no module bundler needed)
   ================================================ */
window.searchUser               = searchUser;
window.sortRepositories         = sortRepositories;
window.calculateLanguageBreakdown = calculateLanguageBreakdown;
