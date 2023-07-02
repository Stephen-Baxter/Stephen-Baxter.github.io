let indexVariables = null;
class INDEX_VARIABLES
{
    currentPageNumber = 0;
    dictionary = [
        "HOME_PAGE_TEXT_AREA_",
        "AI_DEMONSTRATION_PAGE_",
        "OTHER_PROJECTS_PAGE_"
    ];
    degreesTurned = 0;
    menuInMobileToggleOn = false;
    screenLayoutType = 0;
};

const FixHoverForMobile = function()
{
    $(".BUTTON_").mouseenter(function() { $(this).addClass("HOVER_"); });
    $(".BUTTON_").mouseleave(function() { $(this).removeClass("HOVER_"); });
    $(".BUTTON_").on("touchstart", function() { $(this).addClass("HOVER_"); })
    $(".BUTTON_").on("touchend", function() { $(this).removeClass("HOVER_"); })
    $(".BUTTON_").on("touchcancel", function() { $(this).removeClass("HOVER_"); })
}

const ChangeMainPage = function(page_number_)
{
    $("#MAIN_").children().hide(); $("#MAIN_").children().css("transform", "rotateY(" + (indexVariables.degreesTurned % 360) + "deg)");
    if (indexVariables.currentPageNumber === page_number_)
    {
        $("#MAIN_").children().eq(page_number_).show();
        $("#MAIN_").children().eq(page_number_).css("transform", "rotateY(" + (indexVariables.degreesTurned % 360) + "deg)");
    }
    else
    {
        $("#MENU_").children().eq(indexVariables.currentPageNumber).children().eq(0).css("transform", "rotateZ(0deg)");
        $("#MENU_").children().eq(page_number_).children().eq(0).css("transform", "rotateZ(90deg)");
        $("#MENU_").children().eq(indexVariables.currentPageNumber).removeClass("SELECTED_");
        $("#MENU_").children().eq(page_number_).addClass("SELECTED_");

        indexVariables.degreesTurned = (indexVariables.currentPageNumber < page_number_) ? (indexVariables.degreesTurned + 180) : (indexVariables.degreesTurned - 180);
        $("#MAIN_").children().eq(indexVariables.currentPageNumber).show();
        $("#MAIN_").children().eq(indexVariables.currentPageNumber).css("transform", "rotateY(" + ((indexVariables.degreesTurned % 360) + 180) + "deg)");
        $("#MAIN_").children().eq(page_number_).show();
        $("#MAIN_").children().eq(page_number_).css("transform", "rotateY(" + (indexVariables.degreesTurned % 360) + "deg)");
        $("#MAIN_").css("transform", "rotateY(" + indexVariables.degreesTurned + "deg)");  
        indexVariables.currentPageNumber = page_number_; 

        if ($(window).width() < $(window).height())
        {
            $("#MENU_MOBILE_DROPDOWN_BUTTON_").css("transform", "rotateZ(0deg)");
            $("#MENU_").fadeOut(400);
            indexVariables.menuInMobileToggleOn = !indexVariables.menuInMobileToggleOn;
        }
    }
    $("#" + indexVariables.dictionary[indexVariables.currentPageNumber]).scrollTop(0);
}

const ToggleMenuInMobile = function()
{
    indexVariables.menuInMobileToggleOn = !indexVariables.menuInMobileToggleOn;
    if (indexVariables.menuInMobileToggleOn)
    {
        $("#MENU_MOBILE_DROPDOWN_BUTTON_").css("transform", "rotateZ(90deg)");
        $("#MENU_").fadeIn(400);
    }
    else
    {
        $("#MENU_MOBILE_DROPDOWN_BUTTON_").css("transform", "rotateZ(0deg)");
        $("#MENU_").fadeOut(400);
    }
}

const OnResize = function()
{
    if ($(window).width() >= $(window).height())
    {
        indexVariables.menuInMobileToggleOn = false
        $("#MENU_").show(); $("#MENU_MOBILE_DROPDOWN_BUTTON_").hide();
        $("#LAYOUT_").css("grid-template-areas", "'HEADER_ HEADER_ HEADER_' 'MENU_ MAIN_ MAIN_' 'FOOTER_ FOOTER_ FOOTER_'");

        indexVariables.screenLayoutType = ($("main").width() >= $("main").height()) ? 0 : 1;
    }
    else
    {
        $("#MENU_").hide(); $("#MENU_MOBILE_DROPDOWN_BUTTON_").fadeIn(250);
        $("#LAYOUT_").css("grid-template-areas", "'HEADER_ HEADER_ HEADER_' 'MAIN_ MAIN_ MAIN_' 'FOOTER_ FOOTER_ FOOTER_'");

        indexVariables.screenLayoutType = ($("main").width() >= $("main").height()) ? 2 : 3;
    }

    homeVariables.OnResize();
    aiVariables.OnResize();
};

function main()
{
    FixHoverForMobile();

    indexVariables = new INDEX_VARIABLES();

    main_HomePage();
    main_AIDemonstrationPage();
    main_OtherProjectsPage();
    OnResize();
    let urlAtLoad = ""+ window.location.href;
    if (urlAtLoad.endsWith('#AI_DEMONSTRATION_PAGE_')) indexVariables.currentPageNumber = 1;
    else if (urlAtLoad.endsWith('#OTHER_PROJECTS_PAGE_')) indexVariables.currentPageNumber = 2;
    else indexVariables.currentPageNumber = 0;
    $("#MENU_").children().eq(indexVariables.currentPageNumber).addClass("SELECTED_");
    $("#MENU_").children().eq(indexVariables.currentPageNumber).children().eq(0).css("transform", "rotateZ(90deg)");
    ChangeMainPage(indexVariables.currentPageNumber);

    $(window).resize(OnResize);

    $("#LOADING_SCREEN_").hide();
    ju.Con("done");
};
