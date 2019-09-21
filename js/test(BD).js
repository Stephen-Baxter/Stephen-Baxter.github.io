//AI---------------------------------------------------
var conPutA = [0,0,0];
var state0 = null;
var state1 = null;
var reward = 0;
var alpha = 0.0001;
var gamma = 0.8;
var numberOfStates = 3;
var numberOfActions = 3;
var includeStates = 1;
//AI---------------------------------------------------
var blockSpeed = 50;
var timer = 0;

var canv;
var ctx;

var action = 0;
var isPause = 0;

var px = 1;
var py = 4;

var loses = 0;
var scores = 0;
var highScore = 0;
var scoresPerLoses = 0;

var obstructionPatterns = [[0,0,1],
			   [0,1,0],
			   [0,1,1],
			   [1,0,0],
			   [1,0,1],
			   [1,1,0]];
var obstructionPatternUsed = [[0,0,0],
			      [0,0,0],
			      [0,0,0],
			      [0,0,0]];

function Reset ()
{
	canv = document.getElementById ("gc");
	ctx = canv.getContext ("2d");
	setInterval (game, 10);

	ctx.fillStyle = "black";
	ctx.fillRect (0, 0, canv.width, canv.height);

	var action = 0;
	timer = 0;
	px = 1;
	loses = 0;
	scores = 0;
	highScore = 0;
	scoresPerLoses = 0;
	obstructionPatterns = [[0,0,1],
			       [0,1,0],
			       [0,1,1],
			       [1,0,0],
			       [1,0,1],
			       [1,1,0]];
	obstructionPatternUsed = [[0,0,0],
			          [0,0,0],
			          [0,0,0],
			          [0,0,0]];

	//AI---------------------------------------------------
	AI = new BrainQT(numberOfStates,numberOfActions,alpha,gamma);
	AI.createQTableDisplay("qTable", includeStates);
	//AI---------------------------------------------------
}

function Pausing (pause)
{
	isPause = pause;
}

function Turn(turn)
{
	action += turn;
}

function UpdatePlayer ()
{
	ctx.fillStyle = "black";
	ctx.fillRect (0, canv.height - canv.width / 3, canv.width, canv.width / 3);

	switch (action)
	{
		case 0:
		break;

		case 1:
		px = (px == 0) ? px : (px - 1);
		break;

		case 2:
		px = (px == 2) ? px : (px + 1);
		break;
	}

	ctx.fillStyle = "lime";
	ctx.fillRect (canv.width * px / 3, canv.width * py / 3, canv.width / 3, canv.width / 3);
}

function UpdateObstructions ()
{
	ctx.fillStyle = "black";
	ctx.fillRect (0, 0, canv.width, canv.height - canv.width / 3);

	ctx.fillStyle = "red";
	for (var i = 3; i > 0; i--)
	{
		obstructionPatternUsed[i] = obstructionPatternUsed[i - 1];
	}
	obstructionPatternUsed[0] = obstructionPatterns[Math.floor (Math.random () * 5)]
	for (var i = 0; i < 4; i++)
	{
		for (var j = 0; j < 3; j++)
		{
			if (obstructionPatternUsed[i][j] == 1)
			{
				ctx.fillRect (canv.width * j / 3, canv.width * i / 3, canv.width / 3, canv.width / 3);
			}
		}
	}
}

function Restart ()
{
	obstructionPatternUsed = [[0,0,0],
			      [0,0,0],
			      [0,0,0],
			      [0,0,0]];
	px = 1;
}

function game ()
{
	timer = (timer + 1 > 100) ? 1 : timer + 1;
	if (isPause == 0)
	{
		//AI---------------------------------------------------
		if (AISelected == 3)
		{
			conPutA[0] = (px == 0) ? 1 : 0;
			conPutA[1] = (px == 2) ? 1 : 0;
			conPutA[2] = (obstructionPatternUsed[3][px] == 1) ? 1 : 0;

			state0 = AI.Base2ArrayToBase10Number(conPutA);
			action = AI.getActionNumber(state0, 0.99);
		}
		//AI---------------------------------------------------

		UpdatePlayer();

		if (timer % blockSpeed == 0)
		{
			if (obstructionPatternUsed[3][px] == 1)
			{
				Restart();

				loses++;
				if (highScore < scores)
				{
					highScore = scores;
				}
				scoresPerLoses = scores / 1;
				scores = 0;

				//AI---------------------------------------------------
				reward = -1000;
				//AI---------------------------------------------------
			}
			else
			{
				scores++;

				//AI---------------------------------------------------
				reward = 1000;
				//AI---------------------------------------------------		
			}

			UpdateObstructions();

			//AI---------------------------------------------------
			if (AISelected == 3)
			{
				conPutA[0] = (px == 0) ? 1 : 0;
				conPutA[1] = (px == 2) ? 1 : 0;
				conPutA[2] = (obstructionPatternUsed[3][px] == 1) ? 1 : 0;

				state1 = AI.Base2ArrayToBase10Number(conPutA);

				AI.updateQTable(reward, state0, action, state1);
				AI.updateQTableDisplay('qTable', state0, action, includeStates, 4, 1);
			}
			//AI---------------------------------------------------
		}

		document.getElementById("states").innerHTML = "scores: " + scores + "<br>" +
							      "loses: " + loses + "<br>" +
							      "highScore: " + highScore + "<br>" +
							      "scoresPerLoses: " + scoresPerLoses;
		}
		action = 0;
}
