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

    readmeToHtml = function(raw_readme_)
    {
        let readme = raw_readme_
        
        //
        //.replace(/\d+\. (.*$)/gim, "<li class=\"MDOL_\">$1</li>")
        .replace(/>+ (.*$)/gim, "<div>| $1</div>")
        .replace(/(  )\n/gim, "<br>\n")
        .replace(/((   )|(  ))/gim, "<>")
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/^#### (.*$)/gim, "<h4>$1</h4>")
        .replace(/^##### (.*$)/gim, "<h5>$1</h5>")
        .replace(/^###### (.*$)/gim, "<h6>$1</h6>")
        .replace(/\*(.*)\*/gim, "<i>$1</i>")
        .replace(/\*\*(.*)\*\*/gim, "<b>$1</b>")
        .replace(/!\[(.*)\]\((.*)\)/gim, "<img alt=\"$1\" src=\"$2\">")
        .replace(/\[(.*)\]\((.*)\)/gim, "<a href=\"$2\">$1</a>")
        .replace(/``(.*)``/gim, "<pre><code>$1</code></pre>")
        .replace(/(\n)/gim, "@")
        //let mdoli = /(?<=@)\d+\. (.*?)@(?=((@)|(\d+\.)|(<\/li>)))/gim;
        let mdoli = /@\d+\. (.*?)(?=((@@)|(@\d+\.)|(@<li>)))/gim;
        let j = false
        while (mdoli.test(readme))
        {
            readme = readme.replace(/<li class=\"MDOL_\">/gim, "<li>");
            readme = readme.replace(mdoli, "<li class=\"MDOL_\">$1</li>");
            //if(j) {jge.l(11);break};
            //readme = readme.replace(/((<li class=\"MDOL_\">.*<\/li>@)+)(?=((@<)|(\d+\.)))/gim, "<ol>$1</ol>");
            readme = readme.replace(/((<li class=\"MDOL_\">.*?<\/li>@)+)(?=((@)|()))/gim, "<ol>$1</ol>");
            //if(!j) break;
            
            readme = readme.replace(/<>(\d+\.)/gim, "$1");
            //if(!j) break;
            j = true
            //if(j) break;
        }
        readme = readme.replace(/<li class=\"MDOL_\">/gim, "<li>");
        
        let mduli = /@- (.*?)(?=((@@)|(@<\/div>)|(@-)|(@<li>)|(@<>)))/gim;
        while (mduli.test(readme))
        {
            readme = readme.replace(/<li class=\"MDUL_\">/gim, "<li>");
            readme = readme.replace(mduli, "<li class=\"MDUL_\">$1</li>");
            //break;
            readme = readme.replace(/((<li class=\"MDUL_\">.*?<\/li>@)+)(?=((@)|(<\/div>)|()))/gim, "<ul>$1</ul>");
            readme = readme.replace(/<>(-)/gim, "$1");
            j = true
            if(j) break;
        }

        readme = readme.replace(/(@<>)/gim, "");
        readme = readme.replace(/@/gim, "<br>");
        return readme;
    }

    extractRepoData = function(index_)
    {
        let rawReadme = null;
        let readme = "";
        let readmeLink = this.repoData[index_].readmeLink;
        $.ajax({ url: readmeLink, type: "get", async: false, success: function(data_) { rawReadme = data_; } });
        if (rawReadme != null) readme = this.readmeToHtml(rawReadme);//this.mdConverter.makeHtml(rawReadme);
        jge.l(rawReadme);
        
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