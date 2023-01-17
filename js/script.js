
const overview = document.querySelector(".overview"); // profile information will appear
const username = "lisacodesnow";
const repoList = document.querySelector(".repo-list");
const displayRepoInfo = document.querySelector(".repos");
const repoData = document.querySelector(".repo-data");
const backButton = document.querySelector(".view-repos");
const filterInput = document.querySelector("input")

const profileInfo = async function(){
	const githubInfo = await fetch(`https://api.github.com/users/${username}`);
	const data = await githubInfo.json();
	//console.log(data);
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
	myReposS();
}

// list of my repos

const myRepos = async function(){
	let myRepoList = await fetch(` https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
	let repoData = await myRepoList.json();
	//console.log(repoData);
	repoDisplay(repoData);
}

// Display Repo Info in the red box
const repoDisplay = function(repoData){
	filterInput.classList.remove("hide");
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
	//console.log(repoInfo);
	
	//array of languages
	const fetchLanguages = await fetch(repoInfo.languages_url) //why don't you have to write the entire url to fetch the languages? How do you know when you fetch to either write the entire url or not?
	const languageData = await fetchLanguages.json();
	//console.log(languageData);
	
	//store each language in an array
	const languages = [];
	
	for(let language in languageData){
		languages.push(language);
	}
	
	//console.log(languages);
	displaySpecificRepoInfo(repoInfo, languages);
}


//Function to display specific repo info once its clicked on

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
	
	//show back button
	backButton.classList.remove("hide");
};

//Click Event for Back Button

backButton.addEventListener("click", function(){
	displayRepoInfo.classList.remove("hide");
	repoData.classList.add("hide");
	backButton.classList.add("hide");
})

//Add an Input Event to the Search Box

filterInput.addEventListener("input"/*input is another type of event*/, function(e){
	let valueText = e.target.value; // targets the value
	//console.log(valueText);
	const repos = document.querySelectorAll(".repo"); //this is a class made in JS it won't be in HTML
	let lowerCaseSearch = valueText.toLowerCase();
	
	// this loop is for the repo list changing when a letter is added or removed in the search box so a repo can be found
	for(let repoLoop of repos){
		let lowerCaseText = repoLoop.innerText.toLowerCase();
		if(lowerCaseText.includes(lowerCaseSearch)){
		   repoLoop.classList.remove("hide");
		   } else{
			   repoLoop.classList.add("hide");
		   }
	}
});