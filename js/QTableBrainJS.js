function BrainQT(s,a,alpha,gamma)
{
	this.alpha = alpha;
	this.gamma = gamma;
	this.qTable = [];

	var self = this;
	for (var i = 0; i < Math.pow(2, s); i++)
	{
		var j = [];
		for (var k = 0; k < a; k++)
		{
			j.push(0);
		}
		self.qTable.push(j);
	}
}
BrainQT.prototype.getActionNumber = function (input, rs)
{
	if (rs < Math.random ())
	{
		return Math.floor (Math.random () * this.qTable[0].length);
	}
	else
	{
		var val = Math.max.apply(null, this.qTable[input]);
		for (var i = 0; i < this.qTable[input].length; i++)
		{
			if (this.qTable[input][i] == val)
			{
				return i;
			}
		}
	}
};
BrainQT.prototype.updateQTable = function (Rt1,St0,At0,St1)
{
	this.qTable[St0][At0] = this.qTable[St0][At0] + this.alpha * (Rt1 + this.gamma * Math.max.apply(null, this.qTable[St1]) - this.qTable[St0][At0]);
};

BrainQT.prototype.Base2ArrayToBase10Number = function (inputArray)
{
	var outputNumber = "";

	for (var i = 0; i < inputArray.length; i++)
	{
		outputNumber += "" + inputArray[i] + "";
	}

	return parseInt(outputNumber, 2);
};

BrainQT.prototype.createQTableDisplay = function (ID, includeStates)
{
	var IS = includeStates;
	if (IS != 0)
	{
		IS = 1;
	}

	var tBody = document.getElementById(ID);
	for (var i = 0; i < this.qTable.length; i++)
	{
		var row = document.createElement("tr");

		if (IS == 1)
		{
			var cell = document.createElement("td");
			var celltext = document.createTextNode(i + 1);
			cell.appendChild(celltext);
			row.appendChild(cell);
		}

		for (var j = 0 + IS; j < this.qTable[i].length + IS; j++)
		{
			var cell = document.createElement("td");
			var celltext = document.createTextNode("0");
			cell.appendChild(celltext);
			row.appendChild(cell);
		}

		tBody.appendChild(row);
	}
};
BrainQT.prototype.updateQTableDisplay = function (ID, St0, At0, includeStates, roundingPoint, update)
{
	var IS = includeStates;
	if (IS != 0)
	{
		IS = 1;
	}

	var U = update;
	if (U != 0)
	{
		U = 1;
	}

	if (U == 1)
	{
		document.getElementById(ID).rows[St0].cells[At0 + IS].innerHTML = this.qTable[St0][At0].toExponential(roundingPoint);
	}
};
