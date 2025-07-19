import {getUser, getRepo} from "./apis.js";

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
let canShow = true;
async function showUser(userName) {
    try {
        const info = await getUser(userName);
        let div = document.getElementById("profile");
        div.innerHTML = prfileWrite(info.name, info.avatar_url, info.login, info.bio, info.location, info.followers, info.following, info.url)

    } catch {
        let notFoundMsg = document.createElement("h2");
        notFoundMsg.innerText = "User not found!";
        notFoundMsg.className = "notFoundMsg";
        document.body.append(notFoundMsg);
        canShow = false;
    }
}

async function showRepo(userName) {
    if(canShow) {
        try {
            const repos = await getRepo(userName);
            let div = document.querySelector(".repos");
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
    }
}

//show information on click
let submitButton = document.getElementById("submitUserName");

function search(userName) {
    showUser(userName);
    showRepo(userName);
}

submitButton.onclick = () => {
    let userName = document.getElementById("username").value;
    search(userName);
}