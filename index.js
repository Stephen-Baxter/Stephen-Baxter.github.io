///<reference path="C:\github\javascript-sdk\jquery\jquery-3.6.0.min.js"></reference>
let currentPageNumber = 0;
let degreesTurned = 0;
let menuInMobileToggleOn = false;

const ChangeMainPage = function(page_number_)
{
    $("#MAIN_").children().hide(); $("#MAIN_").children().css("transform", "rotateY(" + (degreesTurned % 360) + "deg)");
    if (currentPageNumber === page_number_)
    {
        $("#MAIN_").children().eq(page_number_).show(); $("#MAIN_").children().eq(page_number_).css("transform", "rotateY(" + (degreesTurned % 360) + "deg)");
    }
    else
    {
        $("#MENU_").children().eq(currentPageNumber).children().eq(0).css("transform", "rotateZ(0deg)");
        $("#MENU_").children().eq(page_number_).children().eq(0).css("transform", "rotateZ(360deg)");
        $("#MENU_").children().eq(currentPageNumber).removeClass("SELECTED_");
        $("#MENU_").children().eq(page_number_).addClass("SELECTED_");
        degreesTurned = (currentPageNumber < page_number_) ? (degreesTurned + 180) : (degreesTurned - 180);
        $("#MAIN_").children().eq(currentPageNumber).show(); $("#MAIN_").children().eq(currentPageNumber).css("transform", "rotateY(" + ((degreesTurned % 360) + 180) + "deg)");
        $("#MAIN_").children().eq(page_number_).show(); $("#MAIN_").children().eq(page_number_).css("transform", "rotateY(" + (degreesTurned % 360) + "deg)");
        $("#MAIN_").css("transform", "rotateY(" + degreesTurned + "deg)");  
        currentPageNumber = page_number_; 
        if ($(window).width() < $(window).height())
        {
            $("#MENU_MOBILE_DROPDOWN_BUTTON_").css("transform", "rotateZ(0deg)");
            $("#MENU_").fadeOut(400);
            menuInMobileToggleOn = !menuInMobileToggleOn;
        }
    }
}

const ToggleMenuInMobile = function()
{
    menuInMobileToggleOn = !menuInMobileToggleOn;
    if (menuInMobileToggleOn)
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
        menuInMobileToggleOn = false
        $("#MENU_").show(); $("#MENU_MOBILE_DROPDOWN_BUTTON_").hide();
        $("#LAYOUT_").css("grid-template-areas", "'HEADER_ HEADER_ HEADER_' 'MENU_ MAIN_ MAIN_' 'FOOTER_ FOOTER_ FOOTER_'")
    }
    else
    {
        $("#MENU_").hide(); $("#MENU_MOBILE_DROPDOWN_BUTTON_").fadeIn(250);
        $("#LAYOUT_").css("grid-template-areas", "'HEADER_ HEADER_ HEADER_' 'MAIN_ MAIN_ MAIN_' 'FOOTER_ FOOTER_ FOOTER_'")
    }

    if ($("#MAIN_").width() >= $("#MAIN_").height())
    {
        $("#HOME_PAGE_3D_EFECT_").height("100%");
        $("#HOME_PAGE_3D_EFECT_").width($("#HOME_PAGE_3D_EFECT_").height());
    }
    else
    {
        $("#HOME_PAGE_3D_EFECT_").width("100%");
        $("#HOME_PAGE_3D_EFECT_").height($("#HOME_PAGE_3D_EFECT_").width());
    }

    UpdateSceneSize()
};

function main()
{
    main_HomePage();
    OnResize();
    let urlAtLoad = ""+ window.location.href;
    if (urlAtLoad.endsWith('#AI_DEMONSTRATION_PAGE_')) currentPageNumber = 1;
    else if (urlAtLoad.endsWith('#OTHER_PROJECTS_PAGE_')) currentPageNumber = 2;
    else currentPageNumber = 0;
    $("#MENU_").children().eq(currentPageNumber).addClass("SELECTED_");
    $("#MENU_").children().eq(currentPageNumber).children().eq(0).css("transform", "rotateZ(360deg)");
    ChangeMainPage(currentPageNumber);

    $(window).resize(OnResize);
};
