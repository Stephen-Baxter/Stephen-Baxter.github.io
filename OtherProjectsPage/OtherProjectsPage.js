let otherProjectsVariables = null;

class OTHER_PROJECTS_VARIABLES
{
    githubRepos = extractRepoData(repoNames);
    //let = i "https://raw.githubusercontent.com/Stephen-Baxter/CsProjects/master/README.md";
    
}

const extractRepoData = function(repo_data_)
{
    let mdConverter = new showdown.Converter();
    let githubRepos = [];
    for (let i = 0; i < repo_data_.length; i++)
    {
        let repoName = repo_data_[i];
        let repoLink = "https://github.com/Stephen-Baxter/" + repo_data_[i];
        let readme = "<h1>No read me for " + repoName + " found.</h1>";
        let rawReadme = null;
        let readmeLinkMain = "https://raw.githubusercontent.com/Stephen-Baxter/" + repo_data_[i] + "/main/README.md";
        let readmeLinkMaster = "https://raw.githubusercontent.com/Stephen-Baxter/" + repo_data_[i] + "/master/README.md";
        $.ajax({ url: readmeLinkMain, type: "get", async: false, success: function(data_) { rawReadme = data_; } });
        if (rawReadme == null) $.ajax({ url: readmeLinkMaster, type: "get", async: false, success: function(data_) { rawReadme = data_; } });
        if (rawReadme != null) readme = mdConverter.makeHtml(rawReadme);
        githubRepos.push({repoName: repoName, readme, repoLink: repoLink});
    }

    return githubRepos;
}

const DrawReadmeToHTML = function()
{
    let innerHTML = "";
    let gridTemplateAreas = "";
    let gridTemplateRows = "";
    for (let i = 0; i < otherProjectsVariables.githubRepos.length; i++)
    {
        innerHTML = innerHTML + "<div class=\"TEXT_AREA_\" style=\"grid-area: REPO_" + i + ";\">" + otherProjectsVariables.githubRepos[i].readme + "</div>";
        gridTemplateAreas = gridTemplateAreas + "'REPO_" + i + "' ";
        gridTemplateRows = gridTemplateRows + "auto ";
    }
    $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_").html(innerHTML);
    $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-areas", gridTemplateAreas);
    $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-rows", gridTemplateRows);
    $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-columns", "100%");
}

const main_OtherProjectsPage = function()
{
    otherProjectsVariables = new OTHER_PROJECTS_VARIABLES();
    //ju.Con(otherProjectsVariables.githubRepos);
    DrawReadmeToHTML();
}