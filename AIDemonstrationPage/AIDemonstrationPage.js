const KEY_CODE_LEFT_ = 0x000025
const KEY_CODE_RIGHT_ = 0x000027
let aiVariables = null;

class AI_VARIABLES
{
    pause = true;
    oldTimeStamp = 0;
    playerPosition = {x: 1, y: 4};
    timestep = 1;
    canvas = null;
    playerHit = false;
    obstructionPatterns = [[0,0,1],[0,1,0],[0,1,1],[1,0,0],[1,0,1],[1,1,0]];
    obstructionPatternUsed = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
    numberOfDodges = 0;
    numberOfHits = 0;
    aiIsTurnOn = false;
    numberOfStates = 3 * 7;
    numberOfActions = 3;
    ChanceOfTakingRandomAction = 0.98;
    alpha = 0.0001;
    gamma = 0.8;
    brainForAI = null;
    reward = 0;
    rewardForDodging = 20;
    rewardForHitting = -200;
    state0 = 0;
    state1 = 0;
    actionToTake = 0;

    constructor()
	{
		this.brainForAI = new JQTBrain(this.numberOfStates, this.numberOfActions, this.alpha, this.gamma);
	}

    OnResize = function()
    {
        if (indexVariables.screenLayoutType == 0 || indexVariables.screenLayoutType == 2)
        { 
            $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-rows", "auto auto");
            if (this.aiIsTurnOn)
            {
                $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-areas", "'AI_TITLE_ AI_TITLE_' 'AI_PLAY_AREA_ Q_TABLE_' 'Q_TABLE_DESCRIPTION_ Q_TABLE_DESCRIPTION_'");
                $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-columns", "calc(50% - 5px) calc(50% - 5px)");
            }
            else
            {
                $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-areas", "'AI_TITLE_ AI_TITLE_ AI_TITLE_' '. AI_PLAY_AREA_ .' 'Q_TABLE_DESCRIPTION_ Q_TABLE_DESCRIPTION_ Q_TABLE_DESCRIPTION_'");
                $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-columns", "calc(25% - 5px) calc(50% - 10px) calc(25% - 5px)");
            }
        }
        else
        {  
            $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-columns", "100%");
            if (this.aiIsTurnOn)
            {
                $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-areas", "'AI_TITLE_' 'AI_PLAY_AREA_' 'Q_TABLE_' 'Q_TABLE_DESCRIPTION_'");  
                $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-rows", "auto auto auto");
            }
            else
            {
                $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-areas", "'AI_TITLE_' 'AI_PLAY_AREA_' 'Q_TABLE_DESCRIPTION_'");
                $("#AI_DEMONSTRATION_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-rows", "auto auto");
            }
        }

        //$("#FIX_GAP_").height($("#SCENE_").height()); //Fixes gap under canvas
    }
}

const GetAIParameters = function()
{
    let aiParameters = $("#AI_CONTROLS_ :input");
    aiVariables.rewardForDodging = Number(aiParameters[0].value);
    aiVariables.rewardForHitting = Number(aiParameters[1].value);
    aiVariables.ChanceOfTakingRandomAction = Number(aiParameters[2].value);
    aiVariables.alpha = Number(aiParameters[3].value);
    aiVariables.gamma = Number(aiParameters[4].value);
}

const DrawCircle = function()
{

}

const Draw = function()
{
	aiVariables.canvas.fillStyle = 'rgb(0, 0, 0)';
	aiVariables.canvas.fillRect(0, 0, aiVariables.canvas.width, aiVariables.canvas.height);

	aiVariables.canvas.fillStyle = 'rgb(255, 127, 127)';
    aiVariables.canvas.strokeStyle = 'rgb(127, 255, 127)';
    aiVariables.canvas.lineWidth = 5;
	for (let i = 0; i < 4; i++)
	{
        let obstructionWidth = aiVariables.canvas.width / 3 / (5-i);
        let obstructionHeight = obstructionWidth;
        //let obstructionY = aiVariables.canvas.height * i / 5 / (5-i) + Math.floor(aiVariables.canvas.width / 6) - Math.floor(obstructionWidth / 2);
        //let centerObstructionX = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-i) * 10 - Math.floor(obstructionHeight / 2);
        let obstructionY = aiVariables.canvas.height * i / 5 / (5-i) + Math.floor(aiVariables.canvas.width / 6) - Math.floor(obstructionWidth / 2);
        let centerObstructionX = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) /*- (4-i) * 10*/ - Math.floor(obstructionHeight / 2);
		if (aiVariables.obstructionPatternUsed[i][0] === 1)
		{
            let leftObstructionX = centerObstructionX - obstructionWidth;
            aiVariables.canvas.beginPath();
            aiVariables.canvas.arc(leftObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth / 2 - 2.5, 2 * Math.PI, false);
            aiVariables.canvas.fill();
            aiVariables.canvas.stroke();
		}
        if (aiVariables.obstructionPatternUsed[i][1] === 1)
		{
            aiVariables.canvas.beginPath();
            aiVariables.canvas.arc(centerObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth / 2 - 2.5,2 * Math.PI, false);
            aiVariables.canvas.fill();
            aiVariables.canvas.stroke();
		}
        if (aiVariables.obstructionPatternUsed[i][2] === 1)
		{
            let rightObstructionX = centerObstructionX + obstructionWidth;
            aiVariables.canvas.beginPath();
            aiVariables.canvas.arc(rightObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth / 2 - 2.5,2 * Math.PI, false);
            aiVariables.canvas.fill();
            aiVariables.canvas.stroke();
		}
	}

    if (aiVariables.playerHit) aiVariables.canvas.fillStyle = 'rgb(255, 127, 127)';
	else aiVariables.canvas.fillStyle = 'rgb(127, 255, 127)';
    let playerWidthDouble = aiVariables.canvas.width / 6;
    let playerX = aiVariables.canvas.width * aiVariables.playerPosition.x / 3 + Math.floor(aiVariables.canvas.width /6) - Math.floor(playerWidthDouble);
    let playerY = aiVariables.canvas.height * aiVariables.playerPosition.y / 5 + Math.floor(aiVariables.canvas.width /6) - Math.floor(playerWidthDouble);
    aiVariables.canvas.beginPath();
    aiVariables.canvas.arc(playerX + playerWidthDouble, playerY + playerWidthDouble, playerWidthDouble - 2.5, Math.PI, false);
    aiVariables.canvas.fill();
    aiVariables.canvas.lineWidth = 5;
    aiVariables.canvas.strokeStyle = 'rgb(255, 127, 127)';
    aiVariables.canvas.stroke();
    //aiVariables.canvas.fillRect(playerX, playerY, playerWidth, playerHeight);
}

const PauseToggle = function()
{
    aiVariables.pause = !aiVariables.pause;
    
    if (aiVariables.pause)
    {
        $("#AI_PLAY_AREA_").children().eq(2).addClass("SELECTED_");
    }
    else
    {
        $("#AI_PLAY_AREA_").children().eq(2).removeClass("SELECTED_");
    }
}
const Reset = function()
{
    GetAIParameters()
    aiVariables.brainForAI.ResetQTable();
    aiVariables.brainForAI.SetAlpha(aiVariables.alpha);
    aiVariables.brainForAI.GetAlpha(aiVariables.gamma);
    aiVariables.oldTimeStamp = 0;
    aiVariables.playerPosition = {x: 1, y: 4};
    aiVariables.timestep = 1;
    aiVariables.numberOfDodges = 0;
    aiVariables.numberOfHits = 0;
    aiVariables.obstructionPatternUsed = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
    Draw();
}
const AIToggle = function()
{
    aiVariables.aiIsTurnOn = !aiVariables.aiIsTurnOn;
    Reset();
    
    if (aiVariables.aiIsTurnOn)
    {
        $("#AI_PLAY_AREA_BUTTONS_").children().eq(2).text("AI On");
        $("#AI_PLAY_AREA_BUTTONS_").children().eq(2).addClass("SELECTED_");
        $("#MANUAL_CONTROLS_").hide();
        $("#AI_CONTROLS_").show();
        $("#Q_TABLE_").show();
    }
    else
    {
        $("#AI_PLAY_AREA_BUTTONS_").children().eq(2).text("AI Off");
        $("#AI_PLAY_AREA_BUTTONS_").children().eq(2).removeClass("SELECTED_");
        $("#AI_CONTROLS_").hide();
        $("#MANUAL_CONTROLS_").show();
        $("#Q_TABLE_").hide();
    }

    aiVariables.OnResize();
}

const GetStateForAI = function()
{
    let lastobstructionPatternUsed = aiVariables.obstructionPatternUsed[3].toString();
    if     (lastobstructionPatternUsed === "0,0,0" && aiVariables.playerPosition.x === 0) return  0;
    else if(lastobstructionPatternUsed === "0,0,1" && aiVariables.playerPosition.x === 0) return  1;
    else if(lastobstructionPatternUsed === "0,1,0" && aiVariables.playerPosition.x === 0) return  2;
    else if(lastobstructionPatternUsed === "0,1,1" && aiVariables.playerPosition.x === 0) return  3;
    else if(lastobstructionPatternUsed === "1,0,0" && aiVariables.playerPosition.x === 0) return  4;
    else if(lastobstructionPatternUsed === "1,0,1" && aiVariables.playerPosition.x === 0) return  5;
    else if(lastobstructionPatternUsed === "1,1,0" && aiVariables.playerPosition.x === 0) return  6;
    else if(lastobstructionPatternUsed === "0,0,0" && aiVariables.playerPosition.x === 1) return  7;
    else if(lastobstructionPatternUsed === "0,0,1" && aiVariables.playerPosition.x === 1) return  8;
    else if(lastobstructionPatternUsed === "0,1,0" && aiVariables.playerPosition.x === 1) return  9;
    else if(lastobstructionPatternUsed === "0,1,1" && aiVariables.playerPosition.x === 1) return 10;
    else if(lastobstructionPatternUsed === "1,0,0" && aiVariables.playerPosition.x === 1) return 11;
    else if(lastobstructionPatternUsed === "1,0,1" && aiVariables.playerPosition.x === 1) return 12;
    else if(lastobstructionPatternUsed === "1,1,0" && aiVariables.playerPosition.x === 1) return 13;
    else if(lastobstructionPatternUsed === "0,0,0" && aiVariables.playerPosition.x === 2) return 14;
    else if(lastobstructionPatternUsed === "0,0,1" && aiVariables.playerPosition.x === 2) return 15;
    else if(lastobstructionPatternUsed === "0,1,0" && aiVariables.playerPosition.x === 2) return 16;
    else if(lastobstructionPatternUsed === "0,1,1" && aiVariables.playerPosition.x === 2) return 17;
    else if(lastobstructionPatternUsed === "1,0,0" && aiVariables.playerPosition.x === 2) return 18;
    else if(lastobstructionPatternUsed === "1,0,1" && aiVariables.playerPosition.x === 2) return 19;
    else if(lastobstructionPatternUsed === "1,1,0" && aiVariables.playerPosition.x === 2) return 20;
}
const UpdateAIDemonstrationPageQTable = function()
{
    let qTable = aiVariables.brainForAI.GetQTable();
    

    let smallestQTableValueOnStates = [];
    for (let i = 0; i < aiVariables.numberOfStates; i++) smallestQTableValueOnStates.push(Math.min.apply(null, qTable[i]));
    let smallestQTableValue = Math.min.apply(null, smallestQTableValueOnStates);
    let largestQTableValueOnStates = [];
    for (let i = 0; i < aiVariables.numberOfStates; i++) largestQTableValueOnStates.push(Math.max.apply(null, qTable[i]));
    let largestQTableValue = Math.max.apply(null, largestQTableValueOnStates);
    let QTableValueDefrence = Math.abs(largestQTableValue - smallestQTableValue);

    $("#Q_TABLE_ tr td").removeClass("HIGHLIGHTED_");
    for (let i = 0; i < aiVariables.actionToTake + 2; i++)
    {
        $("#Q_TABLE_ tr:nth-child(" + (aiVariables.state0 + 3) + ") td:nth-child(" + (i + 1) + ")").addClass("HIGHLIGHTED_");
    }
    for (let i = 0; i < aiVariables.state0 + 1; i++)
    {
        $("#Q_TABLE_ tr:nth-child(" + (i + 2) + ") td:nth-child(" + (aiVariables.actionToTake + 2) + ")").addClass("HIGHLIGHTED_");
    }

    for (let i = 0; i < aiVariables.numberOfStates; i++)
    {
        for (let j = 0; j < aiVariables.numberOfActions; j++)
        {
            let qTableValue = $("#Q_TABLE_ tr:nth-child(" + (i + 3) + ") td:nth-child(" + (j + 2) + ")")
            qTableValue.text("" + qTable[i][j].toExponential(2));
            let colorPrecentage = 255 * (((qTable[i][j] - smallestQTableValue) / QTableValueDefrence)**3);
            qTableValue.css("background-color", "rgb(" + 255 + ", " + (255-colorPrecentage) + ", " + (255-colorPrecentage) +", " + 0.5 + ")");
        }
    }
}
const UpdateScore = function()
{
    $("#AI_PLAY_AREA_ #SCORE_").text("Dodges: " + aiVariables.numberOfDodges +
    " Hits: " + aiVariables.numberOfHits +
    " Dodges/Hits: " + ((aiVariables.numberOfHits === 0) ? 0 : (aiVariables.numberOfDodges / aiVariables.numberOfHits)).toFixed(2));  
}

const TurnPlayerLeft = function()
{
    if(aiVariables.playerPosition.x > 0 && !aiVariables.pause) aiVariables.playerPosition.x -= 1;
    Draw();
}
const TurnPlayerRight = function()
{
    if(aiVariables.playerPosition.x < 2 && !aiVariables.pause) aiVariables.playerPosition.x += 1;
    Draw();
}
const UpdatePlayer = function(event_)
{
    if(!aiVariables.aiIsTurnOn)
    {
        if(event_.keyCode === KEY_CODE_LEFT_) TurnPlayerLeft();
        if(event_.keyCode === KEY_CODE_RIGHT_) TurnPlayerRight();
    }
}
const UpdateAIPlayer = function()
{
    if(aiVariables.actionToTake === 0) TurnPlayerLeft();
    if(aiVariables.actionToTake === 2) TurnPlayerRight();
 }

const UpdateObstructions = function()
{
    let lastRow = aiVariables.obstructionPatternUsed[3];
    for (let i = 3; i > 0; i--) aiVariables.obstructionPatternUsed[i] = aiVariables.obstructionPatternUsed[i - 1];
	aiVariables.obstructionPatternUsed[0] = aiVariables.obstructionPatterns[Math.floor(Math.random () * 6)]
	Draw();
    return lastRow;
}
const Game = function(new_time_stamp_)
{
    if (indexVariables.currentPageNumber === 1 && !aiVariables.pause)
    {
        let elapsedTime = new_time_stamp_ - aiVariables.oldTimeStamp;
        aiVariables.oldTimeStamp = new_time_stamp_;
        
        if (aiVariables.aiIsTurnOn)
        {
            aiVariables.reward = 0;
            aiVariables.state0 = GetStateForAI();
            aiVariables.state1 = aiVariables.state0;
            aiVariables.actionToTake = aiVariables.brainForAI.GetActionNumber(aiVariables.state0, false);
            
            if (Math.floor(aiVariables.timestep % 10) == 0)
            {
                aiVariables.state0 = GetStateForAI();
                let takeRandomAction = aiVariables.ChanceOfTakingRandomAction < Math.random ();
                aiVariables.actionToTake = aiVariables.brainForAI.GetActionNumber(aiVariables.state0, takeRandomAction);
                UpdateAIPlayer();
            }
        }
        if (Math.floor(aiVariables.timestep % 30) == 0)
        {
            let lastRow = UpdateObstructions();
            if (lastRow[aiVariables.playerPosition.x] === 1)
            {
                aiVariables.numberOfHits += 1;
                UpdateScore();
                aiVariables.reward += aiVariables.rewardForHitting;
                aiVariables.playerHit = true;
            }
            else
            {
                aiVariables.numberOfDodges += 1;
                UpdateScore();
                aiVariables.reward += aiVariables.rewardForDodging;
                aiVariables.playerHit = false;
            }
        }
        if (aiVariables.aiIsTurnOn)
        {
            aiVariables.state1 = GetStateForAI();
            aiVariables.brainForAI.UpdateQTable(aiVariables.reward, aiVariables.state0, aiVariables.actionToTake, aiVariables.state1);
            UpdateAIDemonstrationPageQTable();
        }
        
        aiVariables.timestep += Math.min(elapsedTime * 60 / 1000, 1);
        if (aiVariables.timestep > 60) aiVariables.timestep = 1;
    }
    window.requestAnimationFrame(Game);
};

const DisplayCodeInHtml = function()
{
    $("#JakQTableBrainJQTBrain").html("JQTBrain = " + JQTBrain.toString());
    $("#JakQTableBrainGetStateForAI").html("GetStateForAI = " + GetStateForAI.toString());
    $("#JakQTableBrainGetActionNumber").html("GetActionNumber = " + aiVariables.brainForAI.GetActionNumber.toString());
    $("#JakQTableBrainUpdateQTable").html("UpdateQTable = " + aiVariables.brainForAI.UpdateQTable.toString());
    $("#JakQTableBrainResetQTable").html("ResetQTable = " + aiVariables.brainForAI.ResetQTable.toString());
    $("#JakQTableBrainGetQTable").html("GetQTable = " + aiVariables.brainForAI.GetQTable.toString());
    $("#JakQTableBrainSetAlpha").html("SetAlpha = " + aiVariables.brainForAI.SetAlpha.toString());
    $("#JakQTableBrainGetAlpha").html("GetAlpha = " + aiVariables.brainForAI.GetAlpha.toString());
    $("#JakQTableBrainSetGamma").html("SetGamma = " + aiVariables.brainForAI.SetGamma.toString());
    $("#JakQTableBrainGetGamma").html("GetGamma = " + aiVariables.brainForAI.GetGamma.toString());

    let JakQTableBrainJQTBrainHtml = $("#JakQTableBrainJQTBrain").html();
    let JakQTableBrainJQTBrainHtmlSplit = JakQTableBrainJQTBrainHtml.split("\n");
    for (let i = 0; i < JakQTableBrainJQTBrainHtmlSplit.length; i++) {
        JakQTableBrainJQTBrainHtmlSplit[i] = (i + 1) + ((i < 9) ? "-- " : "- ") + JakQTableBrainJQTBrainHtmlSplit[i];
    }
    JakQTableBrainJQTBrainHtml = JakQTableBrainJQTBrainHtmlSplit.join("\n");
    $("#JakQTableBrainJQTBrain").html(JakQTableBrainJQTBrainHtml);
}

const main_AIDemonstrationPage = function()
{
    aiVariables = new AI_VARIABLES();
    DisplayCodeInHtml();

    aiVariables.canvas = $("#AI_PLAY_AREA_ canvas")[0].getContext("2d"); aiVariables.canvas.width = 300; aiVariables.canvas.height = 200;
	aiVariables.canvas.fillStyle = "black";
	aiVariables.canvas.fillRect (0, 0, aiVariables.canvas.width, aiVariables.canvas.height);

    PauseToggle();
    AIToggle();
    window.addEventListener("keydown", UpdatePlayer, false);
    window.requestAnimationFrame(Game);
}
