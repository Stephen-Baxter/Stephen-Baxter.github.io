let otherProjectsVariables = null;
class OTHER_PROJECTS_VARIABLES
{
    githubRepos = repoData;
    
}

const main_OtherProjectsPage = function()
{
    //let md = window.markdownit();
    otherProjectsVariables = new OTHER_PROJECTS_VARIABLES();
    ju.Con(otherProjectsVariables.githubRepos[0]["readme"]);
    let data;
    //data = $.get(otherProjectsVariables.githubRepos[0]["readme"], function(data_) {return data_} ,"text");
    $.ajax({
        url: otherProjectsVariables.githubRepos[0]["readme"],
        type: "get",
        async: false,
        success: function(data_) { data = data_; }
    });
    ju.Con(data);//["esponseText"]);
    $("#GITHUB_REPOS_").html(data);
}