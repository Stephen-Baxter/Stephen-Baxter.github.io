const ChangeMainPage = function(page_number_)
{
    window.console.log(page_number_);
    
}

const OnResize = function()
{
    let windowWidth = $(window).width();
    let windowHeight = $(window).height();
    //window.console.log(windowWidth, windowHeight);

    if (windowWidth >= windowHeight)
    {
        $("#MENU_DESKTOP_").show(); $("#MENU_MOBILE_").hide()
        $("#LAYOUT_").css("grid-template-rows", "50px auto 20px")
        $("#LAYOUT_").css("grid-template-areas", "'HEADER_ HEADER_ HEADER_' 'MENU_DESKTOP_ MAIN_ MAIN_' 'FOOTER_ FOOTER_ FOOTER_'")
    }
    else
    {
        $("#MENU_DESKTOP_").hide(); $("#MENU_MOBILE_").show()
        $("#LAYOUT_").css("grid-template-rows", "50px 50px auto 20px")
        $("#LAYOUT_").css("grid-template-areas", "'HEADER_ HEADER_ HEADER_' 'MENU_MOBILE_ MENU_MOBILE_ MENU_MOBILE_' 'MAIN_ MAIN_ MAIN_' 'FOOTER_ FOOTER_ FOOTER_'")
    }
};

const main = function()
{
    OnResize()
    window.console.log(123);
};

$(window).resize(OnResize);
//$(window).on("load", main);
