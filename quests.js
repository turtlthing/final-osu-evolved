




const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

const username = loggedUser;
const token = localStorage.getItem("osuToken");
const topplay = JSON.parse(localStorage.getItem("topPlayData"));
const test = localStorage.getItem("test");

console.log(test);
console.log(loggedUser);

console.log(username);

if (loggedUser) {
  document.getElementById("loginButton").textContent = `Logged in as ${loggedUser}`;
}

else {
    window.location.href = "index.html";
}



async function loadProfile() {

  const errorBox = document.getElementById("errorMessage");

  errorBox.textContent = "";

  // 1. Empty input
  if (!username) {
    errorBox.textContent = "Please enter a valid username.";
    return;
  }

  try {
    // 2. Fetch profile
    const user = await getUserByUsername(loggedUser);
    console.log(user);  
    // If API returns HTML instead of JSON
    if (!user || typeof user !== "object") {
      errorBox.textContent = "Unexpected response from server.";
      return;
    }

    // If user not found
    if (user.error || user.status === 404) {
      errorBox.textContent = "User not found.";
      return;
    }

    const profileLink = `https://osu.ppy.sh/users/${user.id}`;
    document.getElementById("profilemain_a").innerHTML = `
      <h2>${user.username}
        <a href="${profileLink}" target="_blank" class="osulink">View osu! Profile</a>
      </h2>
      <img src="${user.avatar_url}" width="200">
      <span class="inline-text">
      <p>Global Rank: ${user.statistics.global_rank ?? "Inactive"}</p>
      <p>PP: ${user.statistics.pp}</p>
      <p>Ranked Score: ${user.statistics.ranked_score}</p>
      <p>Play Time: ${wow_playtime(user.statistics.play_time)}</p>
      <p>Join Date: ${new Date(user.join_date).toLocaleDateString()}</p>
      </span>
    `;

  } catch (err) {
    // 5. Catch server errors, JSON errors, network errors
    errorBox.textContent = "Something went wrong. Please try again.";
    console.error(err);
  }
}






function accuracy_fixed(accuracy) {
  return (accuracy * 100).toFixed(2) + " %";
}
function wow_playtime(playtime) {
  const hours = Math.floor(playtime / 3600).toFixed(2);
  const days = (hours / 24).toFixed(2);

  let statement = "";

  if (days < 1) {
    statement = "wow, you have played less than a day!";
  } else if (days < 7) {
    statement = "wow, you have played less than a week!";
  } else if (days < 30) {
    statement = "wow, you have a decent playtime!";
  } else {
    statement = "wow, you have a lot of playtime! get off the game and go outside!";
  }

  return days + " days: " + statement;
}

function wow_joindate(joinDate, days) {
  const join = new Date(joinDate);
  const now = new Date();
  const diffTime = Math.abs(now - join);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let statement = "";

  if (diffDays < 30) {
    statement = "wow, you joined not long ago!";
  } else if (diffDays < 365) {
    statement = "wow, you've been with us for a bit!";
  } else if (diffDays < 730) {
    statement = "wow, you're getting the hang of it!";
  } else if (diffDays < 3500) {
    statement = "wow, you're a true legend!";
  } else {
    statement = "wow, uncle you need to get a life!";
  }

  return diffDays + " days: " + statement;
}

async function getToken() {
  const response = await fetch("http://localhost:3000/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: 65956,
      client_secret: "wZI0OksPUV9BRzPGW8FSCzVC19DA5Fu1pj9rGdkT",
      grant_type: "client_credentials",
      scope: "public"
    })
  });

  return await response.json();
}



// 2. define getUserByUsername SECOND
async function getUserByUsername(username) {
  const token = await getToken();

  const response = await fetch(
    `http://localhost:3000/user/${encodeURIComponent(username)}`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`
      }
    }
  );

  return await response.json();
}

if (loggedUser) {
  loadProfile();
}

