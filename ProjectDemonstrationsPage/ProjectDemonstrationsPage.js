let projectDemosVariables = null;
class PROJECT_DEMONSTRATIONS_VARIABLES
{
    constructor()
    {
        this.currentDemonstration = 0;
    
        this.screen = null;
        this.gamePad = new jge.input.GAME_PAD(0);
        this.flightSimulator = null;
        this.raycaster = null;
    }

    OnResize = function()
    {
        if (indexVariables.screenLayoutType == 0 || indexVariables.screenLayoutType == 2)
        { 
            $("#PROJECT_DEMONSTRATION_LIST_").css("grid-template-columns", "repeat(3, 33.33%)");
            $("#PROJECT_DEMONSTRATION_PLAY_AREA_").css("grid-template-areas", "'PLC_ PS_ PS_ PRC_'");
            $("#PROJECT_DEMONSTRATION_PLAY_AREA_").css("grid-template-columns", "25% 25% 25% 25%");
            $("#PROJECT_DEMONSTRATION_PLAY_AREA_").css("grid-template-rows", "auto");
        }
        else
        {  
            $("#PROJECT_DEMONSTRATION_LIST_").css("grid-template-columns", "repeat(2, 50%)");
            $("#PROJECT_DEMONSTRATION_PLAY_AREA_").css("grid-template-areas", "'PS_ PS_' 'PLC_ PRC_'");
            $("#PROJECT_DEMONSTRATION_PLAY_AREA_").css("grid-template-columns", "50% 50%");
            $("#PROJECT_DEMONSTRATION_PLAY_AREA_").css("grid-template-rows", "auto auto");
        }
    }
};

const ChangeDemonstration = function(demonstration_number_)
{
    $("#PROJECT_DEMONSTRATION_LIST_").children().eq(projectDemosVariables.currentDemonstration).removeClass("SELECTED_");
    $("#PROJECT_DEMONSTRATION_LIST_").children().eq(demonstration_number_).addClass("SELECTED_");
    projectDemosVariables.currentDemonstration = demonstration_number_;
    switch (projectDemosVariables.currentDemonstration)
    {
        case 0: $("#PROJECT_DEMONSTRATIONS_PAGE_ #INSTRUCTIONS").html(projectDemosVariables.flightSimulator.Instructions()); break;
        case 1: $("#PROJECT_DEMONSTRATIONS_PAGE_ #INSTRUCTIONS").html(projectDemosVariables.raycaster.Instructions()); break;
        default: break;
    }
}

const OnProjectDemonstrationsFrameStart = function()
{
    OnFlightSimulatorFrameStart();
    OnRaycasterFrameStart();
}
const OnProjectDemonstrationsFrameUpdate = function(delta_time_, time_step_)
{
    switch (projectDemosVariables.currentDemonstration)
    {
        case 0: OnFlightSimulatorFrameUpdate(delta_time_); break;
        case 1: OnRaycasterFrameUpdate(delta_time_); break;
        default: break;
    }
}

const ResetJoyStick = function()
{
    this.childNodes[0].style.left = "25%";
    this.childNodes[0].style.top = "25%";
    projectDemosVariables.gamePad.joyStick.Zero();
    this.childNodes[0].style.background = "rgb(255, 127, 0)";
    this.childNodes[0].style.color = "rgb(0, 0, 0)"
}

const OnJoyStickMoveMouse = function(event_)
{
    let x = 4*event_.offsetX/this.offsetWidth-2;
    let y = 4*event_.offsetY/this.offsetWidth-2;
    projectDemosVariables.gamePad.joyStick.SetCartesian(x, y);
    if (projectDemosVariables.gamePad.joyStick.polar.r <= 1)
    {
        this.childNodes[0].style.left = ""+((x+2)*this.offsetWidth/4-this.childNodes[0].offsetWidth/2)+"px";
        this.childNodes[0].style.top = ""+((y+2)*this.offsetWidth/4-this.childNodes[0].offsetWidth/2)+"px";
    }
    else
    {
        projectDemosVariables.gamePad.joyStick.polar = new jge.math.POLAR_2D_COORDINATE(projectDemosVariables.gamePad.joyStick.polar.a,1);
        this.childNodes[0].style.left = (this.offsetWidth*projectDemosVariables.gamePad.joyStick.cartesian.x/4-this.childNodes[0].offsetWidth/2+this.offsetWidth/2)+"px";
        this.childNodes[0].style.top = (this.offsetWidth*projectDemosVariables.gamePad.joyStick.cartesian.y/4-this.childNodes[0].offsetWidth/2+this.offsetWidth/2)+"px";
    }
    this.childNodes[0].style.background = "rgb(127, 63, 0)"
    this.childNodes[0].style.color = "rgb(0, 255, 255)"
}
const OnJoyStickMoveTouch = function(event_)
{
    let x = 4*event_.offsetX/this.offsetWidth-2;
    let y = 4*event_.offsetY/this.offsetWidth-2;
    projectDemosVariables.joyStick.SetCartesian(x, y);
    if (projectDemosVariables.joyStick.polar.r <= 1)
    {
        this.childNodes[0].style.left = ""+((x+2)*this.offsetWidth/4-this.childNodes[0].offsetWidth/2)+"px";
        this.childNodes[0].style.top = ""+((y+2)*this.offsetWidth/4-this.childNodes[0].offsetWidth/2)+"px";
    }
    else
    {
        projectDemosVariables.joyStick.polar = new jge.math.POLAR_2D_COORDINATE(projectDemosVariables.joyStick.polar.a,1);
        this.childNodes[0].style.left = (this.offsetWidth*projectDemosVariables.joyStick.cartesian.x/4-this.childNodes[0].offsetWidth/2+this.offsetWidth/2)+"px";
        this.childNodes[0].style.top = (this.offsetWidth*projectDemosVariables.joyStick.cartesian.y/4-this.childNodes[0].offsetWidth/2+this.offsetWidth/2)+"px";
    }
    jge.l(event_.touches[0]);
}

const OnAButtonMouseLeave = function() { projectDemosVariables.gamePad.buttonA.down=false; }
const OnAButtonMouseMove = function(event_) { projectDemosVariables.gamePad.buttonA.down=true; }
const OnBButtonMouseLeave = function() { projectDemosVariables.gamePad.buttonB.down=false; }
const OnBButtonMouseMove = function(event_) { projectDemosVariables.gamePad.buttonB.down=true; }
const OnXButtonMouseLeave = function() { projectDemosVariables.gamePad.buttonX.down=false; }
const OnXButtonMouseMove = function(event_) { projectDemosVariables.gamePad.buttonX.down=true; }
const OnYButtonMouseLeave = function() { projectDemosVariables.gamePad.buttonY.down=false; }
const OnYButtonMouseMove = function(event_) { projectDemosVariables.gamePad.buttonY.down=true; }
const OnStartButtonMouseLeave = function() { projectDemosVariables.gamePad.buttonStart.down=false; }
const OnStartButtonMouseMove = function(event_) { projectDemosVariables.gamePad.buttonStart.down=true; }
const OnSelectButtonMouseLeave = function() { projectDemosVariables.gamePad.buttonSelect.down=false; }
const OnSelectButtonMouseMove = function(event_) { projectDemosVariables.gamePad.buttonSelect.down=true; }

const main_ProjectDemonstrationsPage = function()
{
    projectDemosVariables = new PROJECT_DEMONSTRATIONS_VARIABLES();
    const SCREEN_WIDTH = 600;
    const SCREEN_HEIGHT = 400;
    projectDemosVariables.screen = document.getElementById("SCREEN_").getContext("2d", { alpha: false });
    projectDemosVariables.screen.canvas.width = SCREEN_WIDTH;
    projectDemosVariables.screen.canvas.height = SCREEN_HEIGHT;
    $("#JOY_STICK_OUT_").mousemove(OnJoyStickMoveMouse);
    //$("#JOY_STICK_OUT_").on("touchmove", OnJoyStickMoveTouch);
    $("#JOY_STICK_OUT_").mouseleave(ResetJoyStick);
    //l$("#JOY_STICK_OUT_").on("touchend", ResetJoyStick);
    $("#FOUR_BUTTON_IN_A_").mousemove(OnAButtonMouseMove);
    $("#FOUR_BUTTON_IN_A_").mouseleave(OnAButtonMouseLeave);
    $("#FOUR_BUTTON_IN_B_").mousemove(OnBButtonMouseMove);
    $("#FOUR_BUTTON_IN_B_").mouseleave(OnBButtonMouseLeave);
    $("#FOUR_BUTTON_IN_X_").mousemove(OnXButtonMouseMove);
    $("#FOUR_BUTTON_IN_X_").mouseleave(OnXButtonMouseLeave);
    $("#FOUR_BUTTON_IN_Y_").mousemove(OnYButtonMouseMove);
    $("#FOUR_BUTTON_IN_Y_").mouseleave(OnYButtonMouseLeave);
    $("#START_").mousemove(OnStartButtonMouseMove);
    $("#START_").mouseleave(OnStartButtonMouseLeave);
    $("#SELECT_").mousemove(OnSelectButtonMouseMove);
    $("#SELECT_").mouseleave(OnSelectButtonMouseLeave);
    projectDemosVariables.flightSimulator = new FLIGHT_SIMULATOR();
    projectDemosVariables.raycaster = new RAYCASTER(projectDemosVariables.screen);
    ChangeDemonstration(0);
    
}