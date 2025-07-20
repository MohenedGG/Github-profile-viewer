import {getUser, getRepo, connectAPI} from "./apis.js";

//creat profile function
function prfileWrite(name, photoUrl, userName, Bio, loc, followers, following, url) {
    return `<div class="profile" id="profile">
        <div class="nameAndPhoto">
        <img id="profileImage" src="${photoUrl}" alt="Profile Image">
        <p id="profileName">${name}</p>
    </div>
    <div class="infos">
        <p id="profileUsername">Username: ${userName}</p>
        <p id="profileBio">Bio: ${Bio}</p>
        <p id="profileLocation">Location: ${loc}</p>
    </div>
        <div class="follow">
        <p id="profileFollowers">Followers: ${followers}</p>
        <p id="profileFollowing">Following: ${following}</p>
    </div>
    
        <a id="profileLink" href="${url}" target="_blank">View Profile on GitHub</a>
    </div>`
}

function reposWrite(num, name, url, owner) {
    let tbody = document.createElement("tbody");
    let tr = document.createElement("tr");
    let numEle = document.createElement("td");
    let nameEle = document.createElement("td");
    let ownerEle = document.createElement("td");
    let nameEleUrl = document.createElement("a");
    tbody.className = "repo";
    nameEleUrl.href = `${url}`;
    numEle.innerHTML = `${num}`;
    nameEleUrl.innerHTML = `${name}`;
    ownerEle.innerHTML = `${owner}`;
    ownerEle.id = "ownerName";
    ownerEle.onclick = () => {
        search(ownerEle.innerText);
    }
    nameEle.append(nameEleUrl);
    tr.append(numEle);
    tr.append(nameEle);
    tr.append(ownerEle);
    tbody.append(tr);
    return tbody;
}

//apis 
let canShow;
async function showUser(userName) {
    canShow = true
    let div = document.getElementById("profile");
    if(!await connected()) {
        div.innerHTML = "";
        await noInternet();
        canShow = false;
    } else {
        try {
            const info = await getUser(userName);
            div.innerHTML = prfileWrite(info.name, info.avatar_url, info.login, info.bio, info.location, info.followers, info.following, info.html_url)

        } catch {
            div.innerHTML = "";
            canShow = false;
            let userName = document.getElementById("username").value;
            if(userName.trim() !== "") {
                let notFoundMsg = document.createElement("h2");
                notFoundMsg.innerText = "User not found!";
                notFoundMsg.className = "notFoundMsg";
                document.body.append(notFoundMsg);
            }
        }
    }
}

async function showRepo(userName) {
    let div = document.querySelector(".repos");
    if(canShow) {
        try {
            const repos = await getRepo(userName);
            div.innerHTML = `
            <h2>Repositories</h2>
            <table>
            <thead>
            <th>N</th>
            <th>Name</th>
            <th>Owner</th>
            </thead>`;
            let table = document.querySelector(".repos table");
            for(let i = 0; i < repos.length; i++) {
                table.append(reposWrite((i+1), repos[i].name, repos[i].html_url, repos[i].owner.login));
            }
        } catch {
            console.log("User not found!")
        }
    } else {
        div.innerHTML = ``;
    }
}

//check internet function
async function connected() {
    try {
      const res = await fetch(connectAPI);
      if (res.ok) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

//no internet msg
async function noInternet() {
    let div = document.createElement("div");
    let img = document.createElement("img");
    let h2 = document.createElement("h2");
    let button = document.createElement("button");
    div.id = "noInternet";
    img.id = "noInternetImg";
    h2.id = "noInternetMsg"
    button.id = "reload";
    img.src = "./photos/noWifi.png";
    img.alt = "no internet";
    h2.innerText = "Please check your internet connection!"
    button.innerText = "reload page";
    button.onclick = () => location.reload();
    div.append(img);
    div.append(h2);
    div.append(button);
    let mainDiv = document.getElementById("profile");
    mainDiv.append(div);
}

//check internet on open the page
window.onload = async () => {
    if (!await connected()) {
        noInternet();
    }
}

//preload no unternt img
const preloadImage = (url) => {
  const img = new Image();
  img.src = url;
};

preloadImage("./photos/noWifi.png");


//show information on click
let submitButton = document.getElementById("submitUserName");

async function search(userName) {
    if(document.querySelector(".notFoundMsg") !== null) {
        document.querySelector(".notFoundMsg").remove();
    }
    await showUser(userName);
    showRepo(userName);
}

submitButton.onclick = async () => {
    let userName = document.getElementById("username").value;
    search(userName);
}
document.onkeydown = (event) => {
    if(event.key === "Enter") {
    let userName = document.getElementById("username").value;
    search(userName);
    }
}