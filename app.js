const API_URL = "https://api.github.com/users/";

const form = document.getElementById("form");
const search = document.getElementById("search");
const main = document.getElementById("main");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const user = search.value.trim();

  if (user) {
    getUser(user);

    search.value = "";
  }
});

async function getUser(username) {
  try {
    const { data } = await axios(API_URL + username);
    createUserCard(data);
    getRepos(username);
  } catch (error) {
    createErrorCard("User not found!");
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(API_URL + username + "/repos?sort=created");
    addReposToCard(data);
  } catch (error) {
    console.log(error);
  }
}

function createUserCard(user) {
  const userName = user.name ? `${user.name}` : `${user.login}`;
  const cardHTML = `
    <div class="card">
    <img
    class="user-image"
    src=${user.avatar_url}
    alt="user Image"
    />
    <div class="user-info">
    <div class="user-name">
    <h2>${userName}</h2>
    <small>@${user.login}</small>
    </div>
    </div>
    <p>
    ${user.bio || "Bio is not found!"}
    </p>
    
    <ul>
    <li>
    <i class="fa-solid fa-user-group"></i>${user.followers}
    followers
    </li>
    <li>${user.following} following</li>
    <li>
    <i class="fa-solid fa-bookmark"></i>${user.public_repos} repository
    </li>
    </ul>
    
    <div class="repos" id="repos">
    
    </div>
    </div>
    `;
  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  reposEl.innerHTML = ""; // eski repo'ları temizle
  const fragment = document.createDocumentFragment();
  repos
    .slice(0, 5) // sadece ilk 5 repo
    .forEach((repo) => {
      const repoEl = document.createElement("a");

      repoEl.href = repo.html_url;
      repoEl.target = "_blank";
      repoEl.innerHTML = `<i class="fa-solid fa-book-bookmark"></i> ${repo.name}`;
      fragment.appendChild(repoEl);
    });

  reposEl.appendChild(fragment); // 👈 TEK SEFERDE DOM'A BAS
}

// ❌ Hata kartı
function createErrorCard(msg) {
  main.innerHTML = `
    <div class="card">
      <h2>${msg}</h2>
    </div>
  `;
}
