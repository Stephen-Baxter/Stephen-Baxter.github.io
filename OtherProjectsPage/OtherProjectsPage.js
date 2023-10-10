let otherProjectsVariables = null;

class OTHER_PROJECTS_VARIABLES
{
    constructor(repo_data_)
    {
        this.mdConverter = new showdown.Converter();

        this.repoData = repo_data_;
        this.numberOfReadmes = repo_data_.length;
        this.selectedReadmes = [];
        this.readmesLoaded = [];
        this.readmesLoadedIndexes = [];

        let githubProjectsList = [];
        let readmeLinks = [];
        for (let i = 0; i < this.numberOfReadmes; i++)
        {
            githubProjectsList += "<div onclick=\"otherProjectsVariables.loadReadme("+i+")\">"+repo_data_[i].name+"</div>";
            readmeLinks.push(repo_data_[i].readmeLink);
        }
        githubProjectsList += "<div onclick=\"otherProjectsVariables.loadAllReadmes()\">All</div>";
        $("#GITHUB_PROJECTS_LIST_").html(githubProjectsList);
        for (let i = 0; i < this.numberOfReadmes+1; i++)
        {
            $("#GITHUB_PROJECTS_LIST_").children().eq(i).addClass("BUTTON_");
            $("#GITHUB_PROJECTS_LIST_").children().eq(i).addClass("CENTER_");
        }
    }

    OnResize = function()
    {
        if (indexVariables.screenLayoutType == 0 || indexVariables.screenLayoutType == 2)
        { 
            $("#GITHUB_PROJECTS_LIST_").css("grid-template-columns", "repeat(3, 33.33%)");
        }
        else
        {  
            $("#GITHUB_PROJECTS_LIST_").css("grid-template-columns", "repeat(2, 50%)");
        }
    }

    highLightSelectReadmeButtons = function()
    {
        for (let i = 0; i < this.numberOfReadmes; i++)
        {
            $("#GITHUB_PROJECTS_LIST_").children().eq(i).removeClass("SELECTED_");
        }
        for (let i = 0; i < this.selectedReadmes.length; i++)
        {
            $("#GITHUB_PROJECTS_LIST_").children().eq(this.selectedReadmes[i]).addClass("SELECTED_");
        }
    }

    extractRepoData = function(index_, repo_data_)
    {
        let rawReadme = null;
        let readme = "";
        let readmeLink = this.repoData[index_].readmeLink;
        $.ajax({ url: readmeLink, type: "get", async: false, success: function(data_) { rawReadme = data_; } });
        if (rawReadme != null) readme = this.mdConverter.makeHtml(rawReadme);
        
        return readme;
    }

    DisplaySelectedReadmes = function()
    {
        let githubProjectsDisplay = "";
        for (let i = 0; i < this.selectedReadmes.length; i++)
        {
            for (let j = 0; j < this.readmesLoaded.length; j++)
            {
                if (this.readmesLoaded[j][0] === this.selectedReadmes[i])
                {
                    let readme = this.readmesLoaded[j][1];
                    let margin = (i===0) ? 0: 10;
                    githubProjectsDisplay += "<div style=\"margin-top: " + margin + "px;\" class=\"TEXT_AREA_\">" + readme + "</div>";
                }    
            }
        }
        $("#GITHUB_PROJECTS_DISPLAY_").html(githubProjectsDisplay);
    }

    loadReadme = function(index_)
    {
        if (!this.readmesLoadedIndexes.includes(index_))
        {
            this.readmesLoaded.push([index_, this.extractRepoData(index_)]);
            this.readmesLoadedIndexes.push(index_);
        }
        if (!this.selectedReadmes.includes(index_)) this.selectedReadmes.push(index_);
        else this.selectedReadmes.splice(this.selectedReadmes.indexOf(index_), 1);
        this.highLightSelectReadmeButtons();
        this.DisplaySelectedReadmes();
    }
    loadAllReadmes = function()
    {
        if (this.selectedReadmes.length === this.numberOfReadmes) this.selectedReadmes = [];
        else for (let i = 0; i < this.numberOfReadmes; i++) if (!this.selectedReadmes.includes(i)) this.loadReadme(i);
        
        this.highLightSelectReadmeButtons()
        this.DisplaySelectedReadmes();
    }  
}

const main_OtherProjectsPage = function()
{
    otherProjectsVariables = new OTHER_PROJECTS_VARIABLES(repoData);
}