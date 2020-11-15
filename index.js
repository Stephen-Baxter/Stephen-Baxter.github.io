function Index()
{
    let topNavBarSizeRatio = 0.1;
    let topNavBarMenuChangePoint = 70;
    let topNavBarObject = document.getElementById("TOP_NAV_BAR");
    let dropDownButtonObject = document.getElementById("DROP_DOWN_BUTTON");
    let dropDownListObject = document.getElementById("DROP_DOWN_LIST");
    let sectionsObject = document.getElementById("SECTIONS");

    let prevScrollPosition = window.pageYOffset;
    function UpdateScrollPosition()
    {
        let currentSrollPosition = window.pageYOffset;
        if (prevScrollPosition >= currentSrollPosition)
        {
            topNavBarObject.style.top = "0px";
            sectionsObject.style.marginTop = Math.floor(topNavBarObject.clientHeight) + "px";
        }
        else
        {
            topNavBarObject.style.top = -Math.floor(topNavBarObject.clientHeight) + "px";
            sectionsObject.style.marginTop = "0px";
        }
        prevScrollPosition = currentSrollPosition;
    }
    window.addEventListener("scroll", UpdateScrollPosition);

    let portableModeOn = false;
    function OnWindowResize()
    {
        topNavBarObject.style.width = "100%";
        topNavBarObject.style.height = Math.floor(topNavBarObject.clientWidth * topNavBarSizeRatio) + "px";

        UpdateScrollPosition()
        
        portableModeOn = topNavBarObject.clientHeight <= 96 * 0.333333 * window.devicePixelRatio;
        
        if (portableModeOn)
        {
            dropDownButtonObject.style.display = "block";
            dropDownListObject.style.display = "none";
            for (let i = 0; i < 3; i++)
            {
                dropDownListObject.children[i].style.width = "100%";
                dropDownListObject.children[i].style.height = "100%";
            }
        }
        else
        {
            dropDownButtonObject.style.display = "none";
            dropDownListObject.style.display = "block";
            for (let i = 0; i < 3; i++)
            {
                dropDownListObject.children[i].style.width = "50%";
                dropDownListObject.children[i].style.height = "50%";
            }
        }

        dropDownButtonObject.style.height = "100%";
        dropDownButtonObject.style.width = Math.floor(dropDownButtonObject.clientHeight) + "px";
        
    }
    window.addEventListener("resize", OnWindowResize);
    OnWindowResize();

    let topNavBarMenuShow = false;
    function ToggleTopNavBarMenuShow() { dropDownListObject.style.display = (topNavBarMenuShow = !topNavBarMenuShow) ? "block" : "none"; }
    document.getElementById("DROP_DOWN_BUTTON").addEventListener("click", ToggleTopNavBarMenuShow);
    ToggleTopNavBarMenuShow();

    let HOME_SectionShow = false;
    let AI_SectionShow = false;
    let PROJECTS_SectionShow = false;
    function ToggleHomeSectionShow() { ToggleSectionShow("HOME"); }
    function ToggleAISectionShow() { ToggleSectionShow("DEMONSTRATIONS"); }
    function ToggleProjectsSectionShow() { ToggleSectionShow("PROJECTS"); }
    function ToggleSectionShow(section_)
    {
        if (portableModeOn) ToggleTopNavBarMenuShow();
        document.getElementById("HOME").style.display = (HOME_SectionShow = section_ === "HOME") ? "block" : "none";
        document.getElementById("DEMONSTRATIONS").style.display = (AI_SectionShow = section_ === "DEMONSTRATIONS") ? "block" : "none";
        document.getElementById("PROJECTS").style.display = (PROJECTS_SectionShow = section_ === "PROJECTS") ? "block" : "none";
    }
    dropDownListObject.children[0].addEventListener("click", ToggleHomeSectionShow);
    dropDownListObject.children[1].addEventListener("click", ToggleAISectionShow);
    dropDownListObject.children[2].addEventListener("click", ToggleProjectsSectionShow);
    ToggleSectionShow("HOME");

    if (!Projects()) {}
    if (!Demonstrations()) {}
}

window.addEventListener("load", Index);

function Demonstrations()
{
    

    return true;
}

function Projects()
{
    let whatProjectsSlected = "11111111111111"

    return true;
}
