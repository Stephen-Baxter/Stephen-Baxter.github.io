let aiVariables = null;

class AI_VARIABLES
{
    constructor()
	{
        this.pause = true;
        this.playerPosition = {x: 1, y: 4};
        this.canvas = null;
        this.playerHit = false;
        this.obstructionPatterns = [[0,0,1],[0,0,2],[0,0,3],
                                    [0,1,0],[0,1,1],[0,1,2],
                                    [0,1,3],[0,2,0],[0,2,1],
                                    [0,2,2],[0,2,3],[0,3,0],
                                    [0,3,1],[0,3,2],[0,3,3],
                                    [1,0,0],[1,0,1],[1,0,2],
                                    [1,0,3],[1,1,0],[1,2,0],
                                    [1,3,0],[2,0,0],[2,0,1],
                                    [2,0,2],[2,0,3],[2,1,0],
                                    [2,2,0],[2,3,0],[3,0,0],
                                    [3,0,1],[3,0,2],[3,0,3],
                                    [3,1,0],[3,2,0],[3,3,0]];
        this.leftSprites = [new jge.SPRITE(indexVariables.spriteSheet, 32, 0, 16),
                            new jge.SPRITE(indexVariables.spriteSheet, 80, 0, 16),
                            new jge.SPRITE(indexVariables.spriteSheet, 80, 16, 16),
                            new jge.SPRITE(indexVariables.spriteSheet, 32, 16, 16)];
        this.rightSprites = [new jge.SPRITE(indexVariables.spriteSheet, 16, 0, 16),
                             new jge.SPRITE(indexVariables.spriteSheet, 64, 0, 16),
                             new jge.SPRITE(indexVariables.spriteSheet, 64, 16, 16),
                             new jge.SPRITE(indexVariables.spriteSheet, 16, 16, 16)];
        this.centerSprites = [new jge.SPRITE(indexVariables.spriteSheet, 0, 0, 16),
                              new jge.SPRITE(indexVariables.spriteSheet, 48, 0, 16),
                              new jge.SPRITE(indexVariables.spriteSheet, 48, 16, 16),
                              new jge.SPRITE(indexVariables.spriteSheet, 0, 16, 16)];
        this.obstructionPatternUsed = [[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
        this.numberOfDodges = 0;
        this.numberOfHits = 0;
        this.aiIsTurnOn = false;
        this.numberOfStates = 3 * 7;
        this.numberOfActions = 3;
        this.ChanceOfTakingRandomAction = 0.01;
        this.alpha = 0.0001;
        this.gamma = 0.8;
        this.reward = 0;
        this.rewardForDodging = 20;
        this.rewardForHitting = -200;
        this.state0 = 0;
        this.state1 = 0;
        this.actionToTake = 0;
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

const Draw = function()
{
	jge.ClearScreen(aiVariables.canvas, 'black')

    let lx = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-3) * 10 - Math.floor((aiVariables.canvas.width / 3 / (5-3)) / 2) - aiVariables.canvas.width / 3 / (5-3);
    let lx12 = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-3) * 10 + Math.floor((aiVariables.canvas.width / 3 / (5-3)) / 2) + aiVariables.canvas.width / 3 / (5-3);
    let ly = aiVariables.canvas.height * 3 / 5 / (5-3) + Math.floor(aiVariables.canvas.width / 6) - Math.floor((aiVariables.canvas.width / 3 / (5-3)) / 2)+aiVariables.canvas.width / 3 / (5-3)/2;
    let lx2 = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-2) * 10 - Math.floor((aiVariables.canvas.width / 3 / (5-2)) / 2) - aiVariables.canvas.width / 3 / (5-2);
    let lx22 = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-2) * 10 + Math.floor((aiVariables.canvas.width / 3 / (5-2)) / 2) + aiVariables.canvas.width / 3 / (5-2);
    let ly2 = aiVariables.canvas.height * 2 / 5 / (5-3) + Math.floor(aiVariables.canvas.width / 6) - Math.floor((aiVariables.canvas.width / 3 / (5-2)) / 2);//+aiVariables.canvas.width / 3 / (5-2)/2;
    let lx3 = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-1) * 10 - Math.floor((aiVariables.canvas.width / 3 / (5-1)) / 2) - aiVariables.canvas.width / 3 / (5-1);
    let lx32 = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-1) * 10 + Math.floor((aiVariables.canvas.width / 3 / (5-1)) / 2) + aiVariables.canvas.width / 3 / (5-1);
    let ly3 = aiVariables.canvas.height * 1 / 5 / (5-3) + Math.floor(aiVariables.canvas.width / 6) - Math.floor((aiVariables.canvas.width / 3 / (5-1)) / 2);//+aiVariables.canvas.width / 3 / (5-1)/2;
    let lx4 = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-0) * 10 - Math.floor((aiVariables.canvas.width / 3 / (5-0)) / 2) - aiVariables.canvas.width / 3 / (5-0);
    let lx42 = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-0) * 10 + Math.floor((aiVariables.canvas.width / 3 / (5-0)) / 2) + aiVariables.canvas.width / 3 / (5-0);
    let ly4 = aiVariables.canvas.height * 0 / 5 / (5-3) + Math.floor(aiVariables.canvas.width / 6) - Math.floor((aiVariables.canvas.width / 3 / (5-0)) / 2)+aiVariables.canvas.width / 3 / (5-0)/2;
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [0, aiVariables.canvas.canvas.height], [lx, ly]);
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [aiVariables.canvas.canvas.width, aiVariables.canvas.canvas.height], [lx12, ly]);
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [lx, ly], [lx2, ly2]);
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [lx12, ly], [lx22, ly2]);
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [lx2, ly2], [lx3, ly3]);
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [lx22, ly2], [lx32, ly3]);
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [lx3, ly3], [lx4, ly4]);
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [lx32, ly3], [lx42, ly4]);
    jge.DrawLine(aiVariables.canvas, 'rgb(127, 255, 127)', [0, ly4], [aiVariables.canvas.width, ly4]);

    for (let i = 0; i < 4; i++)
	{
        let obstructionWidth = aiVariables.canvas.width / 3 / (5-i);
        let obstructionHeight = obstructionWidth;
        let obstructionY = aiVariables.canvas.height * i / 5 / (5-i) + Math.floor(aiVariables.canvas.width / 6) - Math.floor(obstructionWidth / 2);
        let centerObstructionX = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) - (4-i) * 10 - Math.floor(obstructionHeight / 2);
        //let centerObstructionX = aiVariables.canvas.width * 1 / 3 + Math.floor(aiVariables.canvas.width /6) /*- (4-i) * 10*/ - Math.floor(obstructionHeight / 2);
        if (aiVariables.obstructionPatternUsed[i][0] > 0)
		{
            if (indexVariables.spriteSheet.ready)
            {
                let leftObstructionX = centerObstructionX - obstructionWidth;
                if (i < 2) aiVariables.rightSprites[aiVariables.obstructionPatternUsed[i][0]-1].Draw(aiVariables.canvas, leftObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth);
                else if (i === 2) aiVariables.centerSprites[aiVariables.obstructionPatternUsed[i][0]-1].Draw(aiVariables.canvas, leftObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth);
                else aiVariables.leftSprites[aiVariables.obstructionPatternUsed[i][0]-1].Draw(aiVariables.canvas, leftObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth);
            }
            else
            {
                let leftObstructionX = centerObstructionX - obstructionWidth;
                jge.FillCircle(aiVariables.canvas, 'rgb(255, 127, 127)', [leftObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2], obstructionWidth / 2 - 2.5);
                jge.DrawCircle(aiVariables.canvas, 'rgb(127, 255, 127)', [leftObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2], obstructionWidth / 2 - 2.5, (obstructionWidth / 2 - 2.5)/10);
            }
		}
        if (aiVariables.obstructionPatternUsed[i][1] > 0)
	    {
            if (indexVariables.spriteSheet.ready)
            {
                if (i < 3) aiVariables.rightSprites[aiVariables.obstructionPatternUsed[i][1]-1].Draw(aiVariables.canvas, centerObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth);
                else aiVariables.centerSprites[aiVariables.obstructionPatternUsed[i][1]-1].Draw(aiVariables.canvas, centerObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth);
            }
            else
            {
                jge.FillCircle(aiVariables.canvas, 'rgb(255, 127, 127)', [centerObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2], obstructionWidth / 2 - 2.5);
                jge.DrawCircle(aiVariables.canvas, 'rgb(127, 255, 127)', [centerObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2], obstructionWidth / 2 - 2.5, (obstructionWidth / 2 - 2.5)/10);
            }
        }
        if (aiVariables.obstructionPatternUsed[i][2] > 0)
		{
            if (indexVariables.spriteSheet.ready)
            {
                let rightObstructionX = centerObstructionX + obstructionWidth;
                aiVariables.rightSprites[aiVariables.obstructionPatternUsed[i][2]-1].Draw(aiVariables.canvas, rightObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2, obstructionWidth);
            }
            else
            {
                let rightObstructionX = centerObstructionX + obstructionWidth;
                jge.FillCircle(aiVariables.canvas, 'rgb(255, 127, 127)', [rightObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2], obstructionWidth / 2 - 2.5);
                jge.DrawCircle(aiVariables.canvas, 'rgb(127, 255, 127)', [rightObstructionX + obstructionWidth / 2, obstructionY + obstructionWidth / 2], obstructionWidth / 2 - 2.5, (obstructionWidth / 2 - 2.5)/10);
            }
        }
	}

    let fillColor = '';
    if (aiVariables.playerHit) fillColor = 'rgb(255, 127, 127)';
	else fillColor = 'rgb(127, 255, 127)';
    let playerWidthDouble = aiVariables.canvas.width / 6;
    let playerX = aiVariables.canvas.width * aiVariables.playerPosition.x / 3 + Math.floor(aiVariables.canvas.width /6) - Math.floor(playerWidthDouble);
    let playerY = aiVariables.canvas.height * aiVariables.playerPosition.y / 5 + Math.floor(aiVariables.canvas.width /6) - Math.floor(playerWidthDouble);
    if (indexVariables.spriteSheet.ready)
    {
        switch (aiVariables.playerPosition.x) {
            
            case 0: aiVariables.leftSprites[3].Draw(aiVariables.canvas, playerX + playerWidthDouble, playerY + playerWidthDouble, playerWidthDouble*2); break;
            case 1: aiVariables.centerSprites[3].Draw(aiVariables.canvas, playerX + playerWidthDouble, playerY + playerWidthDouble, playerWidthDouble*2); break;
            case 2: aiVariables.rightSprites[3].Draw(aiVariables.canvas, playerX + playerWidthDouble, playerY + playerWidthDouble, playerWidthDouble*2); break;
        }
    }
    else
    {
        jge.FillCircle(aiVariables.canvas, fillColor, [playerX + playerWidthDouble, playerY + playerWidthDouble], playerWidthDouble - 2.5)
        jge.DrawCircle(aiVariables.canvas, 'rgb(255, 127, 127)', [playerX + playerWidthDouble, playerY + playerWidthDouble], playerWidthDouble - 2.5, (playerWidthDouble - 2.5)/10)
    }
}

const PauseToggle = function()
{
    aiVariables.pause = !aiVariables.pause;
    
    if (aiVariables.pause)
    {
        $("#AI_PLAY_AREA_BUTTONS_").children().eq(0).addClass("SELECTED_");
    }
    else
    {
        $("#AI_PLAY_AREA_BUTTONS_").children().eq(0).removeClass("SELECTED_");
    }
}
const Reset = function()
{
    GetAIParameters()
    aiVariables.brainForAI.ResetQTable();
    aiVariables.brainForAI.alpha = aiVariables.alpha;
    aiVariables.brainForAI.gamma = aiVariables.gamma;
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
        $("#AI_PLAY_AREA_BUTTONS_").children().eq(2).addClass("SELECTED_");
        $("#MANUAL_CONTROLS_").hide();
        $("#AI_CONTROLS_").show();
        $("#Q_TABLE_").show();
    }
    else
    {
        $("#AI_PLAY_AREA_BUTTONS_").children().eq(2).removeClass("SELECTED_");
        $("#AI_CONTROLS_").hide();
        $("#MANUAL_CONTROLS_").show();
        $("#Q_TABLE_").hide();
    }

    aiVariables.OnResize();
}

const GetStateForAI = function()
{
    let lastobstructionPatternUsed = aiVariables.obstructionPatternUsed[3].toString().replace(/2/g, '1').replace(/3/g, '1');
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
    let qTable = aiVariables.brainForAI.qTable;

    let smallestQTableValueOnStates = [];
    for (let i = 0; i < aiVariables.numberOfStates; i++) smallestQTableValueOnStates.push(Math.min.apply(null, qTable[i]));
    let smallestQTableValue = Math.min.apply(null, smallestQTableValueOnStates);
    let largestQTableValueOnStates = [];
    for (let i = 0; i < aiVariables.numberOfStates; i++) largestQTableValueOnStates.push(Math.max.apply(null, qTable[i]));
    let largestQTableValue = Math.max.apply(null, largestQTableValueOnStates);
    let QTableValueDefrence = Math.abs(largestQTableValue - smallestQTableValue);

    $("#Q_TABLE_ tr td").removeClass("HIGHLIGHTED_");
    for (let i = 0; i < aiVariables.actionToTake + 2; i++)
        $("#Q_TABLE_ tr:nth-child(" + (aiVariables.state0 + 2) + ") td:nth-child(" + (i + 1) + ")").addClass("HIGHLIGHTED_");
    for (let i = 0; i < aiVariables.state0 + 1; i++)
        $("#Q_TABLE_ tr:nth-child(" + (i + 1) + ") td:nth-child(" + (aiVariables.actionToTake + 2) + ")").addClass("HIGHLIGHTED_");

    for (let i = 0; i < aiVariables.numberOfStates; i++)
    {
        for (let j = 0; j < aiVariables.numberOfActions; j++)
        {
            let qTableValue = $("#Q_TABLE_ tr:nth-child(" + (i + 2) + ") td:nth-child(" + (j + 2) + ")")
            qTableValue.text("" + qTable[i][j].toFixed(5));//.toExponential(2));
            let colorPrecentage = 255* ((qTable[i][j] - smallestQTableValue) / QTableValueDefrence);
            if (qTable[i][j] > 0)
            {
                //let colorPrecentage = 255* (qTable[i][j] / largestQTableValue);
                qTableValue.css("background-color", "rgb(" + (255-colorPrecentage) + ", 255, 0, 0.5)");
            }
            else
            {
                //let colorPrecentage = 255-255*(qTable[i][j] / smallestQTableValue);
                qTableValue.css("background-color", "rgb(255, " + (colorPrecentage) + ", 0, 0.5)");
            }
        }
    }
}
const UpdateScore = function()
{
    $("#AI_PLAY_AREA_ #SCORE_").text("Dodges: " + aiVariables.numberOfDodges +
    "| Hits: " + aiVariables.numberOfHits +
    "| Success Rate: " + (((aiVariables.numberOfHits+aiVariables.numberOfDodges === 0) ? 1 : aiVariables.numberOfDodges / (aiVariables.numberOfHits+aiVariables.numberOfDodges))*100).toFixed(2) + "%");  
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
	aiVariables.obstructionPatternUsed[0] = aiVariables.obstructionPatterns[Math.floor(Math.random () * aiVariables.obstructionPatterns.length)]
	Draw();
    return lastRow;
}
const OnAIFrameStart = function() {
    //jge.l(aiVariables.leftSprites[3]);
}
const OnAIFrameUpdate = function(time_step_)
{
    if (indexVariables.currentPageNumber === indexVariables.dictionary.indexOf("AI_DEMONSTRATION_PAGE_") && !aiVariables.pause)
    {
        if (aiVariables.aiIsTurnOn)
        {
            aiVariables.reward = 0;
            aiVariables.state0 = GetStateForAI();
            aiVariables.state1 = aiVariables.state0;
            aiVariables.actionToTake = aiVariables.brainForAI.GetAction(aiVariables.state0);
            
            if (Math.floor(time_step_ % 10) == 0)
            {
                aiVariables.state0 = GetStateForAI();
                let takeRandomAction = aiVariables.ChanceOfTakingRandomAction >= Math.random ();
                aiVariables.actionToTake = aiVariables.brainForAI.GetAction(aiVariables.state0, takeRandomAction);
                UpdateAIPlayer();
            }
        }
        if (Math.floor(time_step_ % 30) == 0)
        {
            
            let lastRow = UpdateObstructions();
            if (lastRow[aiVariables.playerPosition.x] > 0)
            {
                aiVariables.numberOfHits += 1;
                aiVariables.reward += aiVariables.rewardForHitting;
                aiVariables.playerHit = true;
            }
            else
            {
                aiVariables.numberOfDodges += 1;
                aiVariables.reward += aiVariables.rewardForDodging;
                aiVariables.playerHit = false;
            }
        }
        if (aiVariables.aiIsTurnOn && Math.floor(time_step_ % 10) == 0)
        {
            aiVariables.state1 = GetStateForAI();
            aiVariables.brainForAI.UpdateQTable(aiVariables.reward, aiVariables.state0, aiVariables.actionToTake, aiVariables.state1);
            UpdateAIDemonstrationPageQTable();
        }
        UpdateScore();
    }
}
const DisplayCodeInHtml = function()
{
    $("#JakQTableBrainJQTBrain").html("JQTBrain = " + JQTBrain.toString());
    $("#JakQTableBrainGetStateForAI").html("GetStateForAI = " + GetStateForAI.toString());
    $("#JakQTableBrainGetActionNumber").html("GetActionNumber = " + aiVariables.brainForAI.GetAction.toString());
    $("#JakQTableBrainUpdateQTable").html("UpdateQTable = " + aiVariables.brainForAI.UpdateQTable.toString());
    $("#JakQTableBrainResetQTable").html("ResetQTable = " + aiVariables.brainForAI.ResetQTable.toString());
    $("#JakQTableBrainGetQTable").html("qTable");
    $("#JakQTableBrainSetAlpha").html("alpha");
    $("#JakQTableBrainGetAlpha").html("gamma");

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

    aiVariables.canvas = $("#AI_PLAY_AREA_ canvas")[0].getContext("2d", { alpha: false }); aiVariables.canvas.width = 300; aiVariables.canvas.height = 200;
	jge.ClearScreen(aiVariables.canvas, 'black')

    PauseToggle();
    AIToggle();
    window.addEventListener("keydown", UpdatePlayer, false);
    //window.requestAnimationFrame(Game);
    //framLoop = new jge.RUN_FRAME_LOOP(OnAIFrameStart, OnAIFrameUpdate);
}
