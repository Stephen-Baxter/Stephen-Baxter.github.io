var tab; //[[Unique, Generic], [HTML5, C++, C#, VB.net], [GUI, CLI, NVI]]
var programList;
var programSelected;

window.onload = function ()
{
	tab = [[0, 0], [0, 0, 0, 0], [0, 0, 0]];

	programList = [
		       [[[1,0], [1,0,0,0], [1,0,0]], "This Website", "https://github.com/Stephen-Baxter/Stephen-Baxter.github.io"],
		       [[[0,1], [0,1,0,0], [0,1,0]], "RPG Dice", "https://github.com/Stephen-Baxter/CppProjects/tree/master/CLI/RPG%20Dice"],
		       [[[0,1], [0,0,1,0], [0,1,0]], "RPG Dice", "https://github.com/Stephen-Baxter/CsProjects/tree/master/CLI/RPG%20Dice"],
		       [[[0,1], [0,0,0,1], [0,1,0]], "RPG Dice", "https://github.com/Stephen-Baxter/VB.netProjects/tree/master/CLI/RPG%20Dice"]
		       [[[1,0], [0,1,0,0], [0,0,1]], "GPC2PCC", "https://github.com/Stephen-Baxter/GPC2PCC"],
		      ];

	document.getElementById("df2").click();
	document.getElementById("df3").click();
	document.getElementById("df4").click();
}

function FindProjects(button, number)
{
	var tablinks;

	tablinks = document.getElementsByClassName("tablinks" + number);

	if (tablinks[tablinks.length - 1] == button)
	{
		button.className = button.className.replace(" inactive", " active");
		for (var i = 0; i < tablinks.length - 1; i++)
		{
			tablinks[i].className = tablinks[i].className.replace(" active", " inactive");
		}
		for (var i = 0; i < tab[number].length; i++)
		{
			tab[number][i] = 1;
		}
	}
	else
	{
		if (button.className == "tablinks" + number + " active")
		{
			button.className = "tablinks" + number + " inactive";
			for (var i = 0; i < tablinks.length - 1; i++)
			{
				if (tablinks[i] == button)
				{
					tab[number][i] = 0;
				}
			}
		}
		else
		{
			button.className = button.className.replace(" inactive", " active");
			if (tablinks[tablinks.length - 1].className == button.className)
			{
				tablinks[tablinks.length - 1].className = tablinks[tablinks.length - 1].className.replace(" active", " inactive");
				for (var i = 0; i < tab[number].length; i++)
				{
					tab[number][i] = 0;
				}	
			}
		
			var i = 0;
			for (var j = 0; j < tablinks.length - 1; j++)
			{
				if (tablinks[j].className == button.className)
				{
					i++;
				}
			}
			if (i == tablinks.length - 1)
			{
				tablinks[tablinks.length - 1].className = button.className;
				for (var k = 0; k < tablinks.length - 1; k++)
				{
					tablinks[k].className = tablinks[k].className.replace(" active", " inactive");
				}
			}
			for (var i = 0; i < tablinks.length - 1; i++)
			{
				if (tablinks[i] == button)
				{
					tab[number][i] = 1;
				}
			}
		}
		var i = 0;
		for (var j = 0; j < tablinks.length; j++)
		{
			if (tablinks[j].className == button.className)
			{
				i++;
			}
		}
		if (i == tablinks.length)
		{
			tablinks[tablinks.length - 1].className = "tablinks" + number + " active";
			for (var i = 0; i < tab[number].length; i++)
			{
				tab[number][i] = 1;
			}
		}
	}
	programSelected = [];
	for (var i = 0; i < programList.length; i++)
	{
		var a = false;
		var b = false;
		var c = false;
		for (var j = 0; j < programList[i][0][0].length; j++)
		{
			if (programList[i][0][0][j] == 1 && tab[0][j] == 1)
			{
				a = true;
			}
		}
		for (var j = 0; j < programList[i][0][1].length; j++)
		{
			if (programList[i][0][1][j] == 1 && tab[1][j] == 1)
			{
				b = true;
			}
		}
		for (var j = 0; j < programList[i][0][2].length; j++)
		{
			if (programList[i][0][2][j] == 1 && tab[2][j] == 1)
			{
				c = true;
			}
		}

		if (a && b && c)
		{
			programSelected.push(programList[i])
		}
	}

	DisplayProjects();
}

function DisplayProjects0()
{
	var type = "";
	var lang = "";
	var inter = "";

	document.getElementById("projectsP1").innerHTML = "";
	document.getElementById("projectsP2").innerHTML = "";
	var tBody0 = document.getElementById("projectsP1");
	var tBody1 = document.getElementById("projectsP2");

	for (var i = 0; i < 2; i++)
	{
		for (var j = ((i == 0) ? 0 : ((programSelected.length + programSelected.length % 2) / 2)); j < ((i == 0) ? ((programSelected.length + programSelected.length % 2) / 2) : programSelected.length); j++)
		{
			if (programSelected[j][0][0][0] == 1)
			{
				type = "Unique";
			}
			if (programSelected[j][0][0][1] == 1)
			{
				type = "Generic";
			}
			
			if (programSelected[j][0][1][0] == 1)
			{
				lang = "HTML5";
			}
			if (programSelected[j][0][1][1] == 1)
			{
				lang = "C++";
			}
			if (programSelected[j][0][1][2] == 1)
			{
				lang = "C#";
			}
			if (programSelected[j][0][1][3] == 1)
			{
				lang = "VB";
			}

			if (programSelected[j][0][2][0] == 1)
			{
				inter = "GUI";
			}
			if (programSelected[j][0][2][1] == 1)
			{
				inter = "CLI";
			}
			if (programSelected[j][0][2][2] == 1)
			{
				inter = "NVI";
			}

			var row = document.createElement("tr");
			
			var cell0 = document.createElement("td");
			var celltext0 = document.createTextNode(j + 1 + ".");
			cell0.appendChild(celltext0);
			row.appendChild(cell0);

			var cell1 = document.createElement("td");
			var celltext1 = document.createTextNode(type);
			cell1.appendChild(celltext1);
			row.appendChild(cell1);

			var cell2 = document.createElement("td");
			var celltext2 = document.createTextNode(lang);
			cell2.appendChild(celltext2);
			row.appendChild(cell2);

			var cell3 = document.createElement("td");
			var celltext3 = document.createTextNode(inter);
			cell3.appendChild(celltext3);
			row.appendChild(cell3);

			var cell4 = document.createElement("td");
			var celltext4 = document.createTextNode(programSelected[j][1]);
			cell4.appendChild(celltext4);
			row.appendChild(cell4);

			if (i == 0)
			{
				tBody0.appendChild(row);
			}
			else
			{
				tBody1.appendChild(row);
			}
		}
	}
}
function DisplayProjects()
{
	var type = "";
	var lang = "";
	var inter = "";

	document.getElementById("projects").innerHTML = "";
	var tBody = document.getElementById("projects");

	for (var i = 0; i < programSelected.length; i++)
	{
		if (programSelected[i][0][0][0] == 1)
		{
			type = "Unique";
		}
		if (programSelected[i][0][0][1] == 1)
		{
			type = "Generic";
		}
			
		if (programSelected[i][0][1][0] == 1)
		{
			lang = "HTML5";
		}
		if (programSelected[i][0][1][1] == 1)
		{
			lang = "C++";
		}
		if (programSelected[i][0][1][2] == 1)
		{
			lang = "C#";
		}
		if (programSelected[i][0][1][3] == 1)
		{
			lang = "VB";
		}

		if (programSelected[i][0][2][0] == 1)
		{
			inter = "GUI";
		}
		if (programSelected[i][0][2][1] == 1)
		{
			inter = "CLI";
		}
		if (programSelected[i][0][2][2] == 1)
		{
			inter = "NVI";
		}

		var row = document.createElement("tr");
			
		var cell0 = document.createElement("td");
		var celltext0 = document.createTextNode(i + 1 + ".");
		cell0.appendChild(celltext0);
		row.appendChild(cell0);

		var cell1 = document.createElement("td");
		var celltext1 = document.createTextNode(type);
		cell1.appendChild(celltext1);
		row.appendChild(cell1);

		var cell2 = document.createElement("td");
		var celltext2 = document.createTextNode(lang);
		cell2.appendChild(celltext2);
		row.appendChild(cell2);

		var cell3 = document.createElement("td");
		var celltext3 = document.createTextNode(inter);
		cell3.appendChild(celltext3);
		row.appendChild(cell3);

		var cell4 = document.createElement("td");
		//var celltext4 = document.createTextNode("<a href = " + programSelected[i][2] + ">" + programSelected[i][1] + "</a>");
		//cell4.appendChild(celltext4);
		cell4.innerHTML = "<a href = " + programSelected[i][2] + ">" + programSelected[i][1] + "</a>";
		row.appendChild(cell4);

		tBody.appendChild(row);
	}
}
