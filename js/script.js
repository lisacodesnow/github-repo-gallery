
const overview = document.querySelector(".overview"); // profile information will appear
const username = "lisacodesnow";
const repoList = document.querySelector(".repo-list");
const displayRepoInfo = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");

const profileInfo = async function(){
	const githubInfo = await fetch(`https://api.github.com/users/${username}`);
	const data = await githubInfo.json();
	console.log(data);
	displayInfo(data);
};

profileInfo();

const displayInfo = function(data){
	let userInfoDiv = document.createElement("div");
	userInfoDiv.classList.add("user-info");
	userInfoDiv.innerHTML = ` <figure>
      <img alt="user avatar" src=${data.avatar_url} />
    </figure>
    <div>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Bio:</strong> ${data.bio}</p>
      <p><strong>Location:</strong> ${data.location}</p>
      <p><strong>Number of public repos:</strong> ${data.public_repos}</p>
    </div> `;
	overview.append(userInfoDiv);
	myRepos();
}

// list of my repos

const myRepos = async function(){
	let myRepoList = await fetch(` https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
	let repoData = await myRepoList.json();
	//console.log(repoData);
	repoDisplay(repoData);
}
// Display Repo Info by calling the list of repos
const repoDisplay = function(repoData){
	for (let repo of repoData){
		const repoItem = document.createElement("li");
		repoItem.classList.add("repo");
		repoItem.innerHTML = `<h3>${repo.name}</h3>`;
		repoList.append(repoItem);
	}
	
}

repoList.addEventListener("click", function(e){
	if(e.target.matches("h3")){
		let repoName = e.target.innerText;
		//console.log(repoName);
		specificRepoInfo(repoName);
	}
	
})

//Function to get specific repo info

const specificRepoInfo = async function(repoName){
	const specificRepo = await fetch(` https://api.github.com/repos/${username}/${repoName}`);
	const repoInfo = await specificRepo.json();
	console.log(repoInfo);
	
	//array of languages
	const fetchLanguages = await fetch(repoInfo.languages_url) //why don't you have to write the entire url to fetch the languages? How do you know when you fetch to either write the entire url or not?
	const languageData = await fetchLanguages.json();
	console.log(languageData);
	
	//store each language in an array
	const languages = [];
	
	for(let language in languageData){
		languages.push(language);
	}
	
	console.log(languages);
	displaySpecificRepoInfo(repoInfo, languages);
}


//Function to display specific repo info

const displaySpecificRepoInfo = function(repoInfo, languages){
	repoData.innerText = "";
	repoData.classList.remove("hide");
	displayRepoInfo.classList.add("hide");
	
	const newDiv = document.createElement("div");
	newDiv.innerHTML = `<h3>Name: ${repoInfo.name}</h3>
    <p>Description: ${repoInfo.description}</p>
    <p>Default Branch: ${repoInfo.default_branch}</p>
    <p>Languages: ${languages.join(", ")}</p>
    <a class="visit" href="${repoInfo.clone_url}" target="_blank" rel="noreferrer noopener">View Repo on GitHub!</a>`
	
	repoData.append(newDiv);
};