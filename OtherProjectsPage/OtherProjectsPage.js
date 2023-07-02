let otherProjectsVariables = null;

class OTHER_PROJECTS_VARIABLES
{
    repoNames = repoData;

    githubRepos = extractRepoData(repoData);
    
}

const extractRepoData = function(repo_data_)
{
    let mdConverter = new showdown.Converter();
    let githubRepos = [];
    //let loadingScreenHtml = $("#LOADING_SCREEN_").html();
    for (let i = 0; i < repo_data_.length; i++)
    {
        let repoName = repo_data_[i].nane;
        let repoLink = "https://github.com/Stephen-Baxter/" + repo_data_[i];
        let readme = "<h1>No read me for " + repoName + " found.</h1>";
        let rawReadme = null;
        //let readmeLinkMain = "https://raw.githubusercontent.com/Stephen-Baxter/" + repo_data_[i] + "/main/README.md";
        let readmeLinkMaster = repo_data_[i].readmeLink;
        $.ajax({ url: readmeLinkMaster, type: "get", async: false, success: function(data_) { rawReadme = data_; } });
        //if (rawReadme == null) $.ajax({ url: readmeLinkMaster, type: "get", async: false, success: function(data_) { rawReadme = data_; } });
        if (rawReadme != null) readme = mdConverter.makeHtml(rawReadme);
        githubRepos.push({repoName: repoName, readme, repoLink: repoLink});
        /*ju.Con(i / repo_data_.length);
        $("#LOADING_SCREEN_").html(loadingScreenHtml + " " + i / repo_data_.length);
        ju.Con( $("#LOADING_SCREEN_").html());*/
    }

    return githubRepos;
}

const OutputReadmeToHTML = function(repos_to_output_ = [])
{
    let innerHTML = "<div class=\"TEXT_AREA_\" style=\"grid-area: REPO_SEARCH_BAR_;\">" + $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_ :first-child").html() + "</div>";
    let gridTemplateAreas = "'REPO_SEARCH_BAR_' ";
    let gridTemplateRows = "auto ";
    for (let i = 0; i < repos_to_output_.length; i++)
    {
        let qTD = "";
        if (repos_to_output_[i].repoName == "QTableBrain")
        {
            qTD = "<br><a onclick=\"ChangeMainPage(1);\" href=\"#AI_DEMONSTRATION_PAGE_\">QTableBrain Demonstration</a>"
        }
        innerHTML = innerHTML + "<div class=\"TEXT_AREA_\" style=\"grid-area: REPO_" + i + ";\">" + repos_to_output_[i].readme + "<a href=" + repos_to_output_[i].repoLink + " target=\"_blank\">" + repos_to_output_[i].repoName + "'s Github Link</a>" + qTD + "</div>";
        gridTemplateAreas = gridTemplateAreas + "'REPO_" + i + "' ";
        gridTemplateRows = gridTemplateRows + "auto ";
    }
    $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_").html(innerHTML);
    $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-areas", gridTemplateAreas);
    $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-rows", gridTemplateRows);
    $("#OTHER_PROJECTS_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-columns", "100%");
}

const Search_Repos = function(repo_to_search_)
{
    let reposToOutput = [];
    if (repo_to_search_ == "")
    {
        reposToOutput = otherProjectsVariables.githubRepos;
    }
    else
    {
        otherProjectsVariables.githubRepos.forEach(repo_ =>
        {
            if (repo_.readme.toLowerCase().includes(repo_to_search_.toLowerCase()))
            {
                reposToOutput.push(repo_);
            }
        });
    }
    OutputReadmeToHTML(reposToOutput);
    $("#OTHER_PROJECTS_PAGE_ :input").val(repo_to_search_);
    $("#OTHER_PROJECTS_PAGE_ :input").focus();
} 

const main_OtherProjectsPage = function()
{
    otherProjectsVariables = new OTHER_PROJECTS_VARIABLES();
    
    let reposToOutput = otherProjectsVariables.githubRepos;
    OutputReadmeToHTML(reposToOutput);


}