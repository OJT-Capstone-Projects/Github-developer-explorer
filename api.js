/* ================================================
   GitHub Developer Explorer  –  api.js
   API Layer: All GitHub REST API calls live here.
   Uses fetch() + async/await + try/catch/finally
   ================================================ */

// Base URL for the GitHub REST API
const BASE_URL = "https://api.github.com";

/* ------------------------------------------------
   Build request headers.
   If a token is provided in config.js, attach it
   so the rate limit rises from 60 → 5,000 / hour.
   ------------------------------------------------ */
const getHeaders = () => {
  const headers = {
    "Accept": "application/vnd.github+json"
  };

  // Only add the Authorization header if a token is set
  if (typeof CONFIG !== "undefined" && CONFIG.GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${CONFIG.GITHUB_TOKEN}`;
  }

  return headers;
};


/* ================================================
   1. fetchProfile(username)
      Fetches a GitHub user's public profile data.

      Returns the raw API response object on success.
      Throws an Error with a user-friendly message
      on failure (404, 403, network error, etc.).
   ================================================ */
const fetchProfile = async (username) => {
  const response = await fetch(`${BASE_URL}/users/${username}`, {
    headers: getHeaders()
  });

  // GitHub returns 404 when the username does not exist
  if (response.status === 404) {
    throw new Error(`User "${username}" not found. Please check the username and try again.`);
  }

  // 403 usually means the API rate limit has been exceeded
  if (response.status === 403) {
    throw new Error("GitHub API rate limit exceeded. Please wait a moment and try again.");
  }

  // Catch any other non-OK status codes
  if (!response.ok) {
    throw new Error(`Failed to fetch profile. (HTTP ${response.status})`);
  }

  const data = await response.json();
  return data;
};


/* ================================================
   2. fetchRepositories(username)
      Fetches up to 100 public repositories for a
      given GitHub user, sorted by last updated.

      Returns an array of raw repo objects on success.
      Throws an Error on failure.
   ================================================ */
const fetchRepositories = async (username) => {
  // per_page=100 gives us the maximum repos in one request
  const response = await fetch(
    `${BASE_URL}/users/${username}/repos?per_page=100&sort=updated`,
    { headers: getHeaders() }
  );

  if (response.status === 404) {
    throw new Error(`Repositories for "${username}" could not be found.`);
  }

  if (response.status === 403) {
    throw new Error("GitHub API rate limit exceeded. Please wait a moment and try again.");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch repositories. (HTTP ${response.status})`);
  }

  const data = await response.json();
  return data;
};


/* ================================================
   3. fetchRateLimit()
      Fetches the current GitHub API rate limit info.

      Returns an object with:
        {
          limit     : number  – max requests allowed
          used      : number  – requests used so far
          remaining : number  – requests left
          resetTime : string  – human-readable reset time
        }

      Does NOT throw on failure – returns a fallback
      object so the UI is never broken by rate-limit
      lookup errors.
   ================================================ */
const fetchRateLimit = async () => {
  try {
    const response = await fetch(`${BASE_URL}/rate_limit`, {
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error("Could not retrieve rate limit data.");
    }

    const data = await response.json();

    // Destructure the core rate-limit info from the response
    const { limit, used, remaining, reset } = data.rate;

    // Convert the Unix timestamp to a readable local time string
    const resetDate = new Date(reset * 1000);
    const resetTime = resetDate.toLocaleTimeString();

    return { limit, used, remaining, resetTime };

  } catch (error) {
    // Return a safe fallback so the rest of the app keeps working
    return {
      limit: "N/A",
      used: "N/A",
      remaining: "N/A",
      resetTime: "N/A"
    };
  }
};


/* ================================================
   EXPORTS  (browser-safe, no module bundler needed)
   ================================================ */
window.fetchProfile      = fetchProfile;
window.fetchRepositories = fetchRepositories;
window.fetchRateLimit    = fetchRateLimit;
