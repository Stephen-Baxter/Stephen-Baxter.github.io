class FLIGHT_SIMULATOR
{
    constructor()
    {  
        this.Z_NEAR = 0.1;
        this.Z_FAR = 1000;
        this.world = null;
        this.player = null;
    }
    WORLD = class
    {
        constructor(size_)
        {
            this.size = size_;
            this.terrain = [];
            this.airDensity = 1000;// 1.204;
            this.windSpeedVector = new jge.VECTOR(1,0,1);
            for (let i = 0; i < this.size; i++)
            {
                let j = i*2-this.size;
                this.terrain.push(new jge.WIRE(new jge.VECTOR(j,0,this.size),new jge.VECTOR(j,0,-this.size),"rgb(0,255,0)"))
                this.terrain.push(new jge.WIRE(new jge.VECTOR(this.size,0,j),new jge.VECTOR(-this.size,0,j),"rgb(0,255,0)"))

                this.terrain.push(new jge.WIRE(new jge.VECTOR(j,this.size*2,this.size),new jge.VECTOR(j,this.size*2,-this.size),"rgb(255,255,255)"))
                this.terrain.push(new jge.WIRE(new jge.VECTOR(this.size,this.size*2,j),new jge.VECTOR(-this.size,this.size*2,j),"rgb(255,255,255)"))
            }
        }
    }
    PLAYER = class
    {
        constructor(position_)
        {
            this.position = position_;
            this.worldPosition = position_;
            this.orientation = new jge.MATRIX();
            this.orthonormalizedCounter = 0;
            this.mass = 408.2331;
            this.enginePower = 0;
            this.propRadius = 2.667
            this.netSpeedVector = new jge.VECTOR(0,0,0);
            this.elevator = 0;
            this.aileron = 0;
            this.rudder = 0;
            this.isBrakeOn = true;
        }
    }

    Instructions = function()
    {
        let instructions = "<header><h2>instructions</h2></header>"
        instructions += "<p class=\".p2\"><kbd>a</kbd>/<kbd>Y Button</kbd>: turn left<br>";
        instructions += "<kbd>d</kbd>/<kbd>A Button</kbd>: turn right<br>";
        instructions += "<kbd>a</kbd>+<kbd>d</kbd>/<kbd>Y Button</kbd>+<kbd>A Button</kbd>: center rudder<br>";
        instructions += "<kbd>w</kbd>/<kbd>W Button</kbd>: increase engine power<br>";
        instructions += "<kbd>s</kbd>/<kbd>S Button</kbd>: decrease engine power<br>";
        instructions += "<kbd>k</kbd>/<kbd>JOY STICK Left</kbd>: roll left<br>";
        instructions += "<kbd>;</kbd>/<kbd>JOY STICK Right</kbd>: roll right<br>";
        instructions += "<kbd>k</kbd>+<kbd>;</kbd>/<kbd>JOY STICK Center</kbd>: center aileron<br>";
        instructions += "<kbd>o</kbd>/<kbd>JOY STICK Up</kbd>: push down<br>";
        instructions += "<kbd>l</kbd>/<kbd>JOY STICK Down</kbd>: pull up<br>";
        instructions += "<kbd>o</kbd>+<kbd>l</kbd>/<kbd>JOY STICK Center</kbd>: center elevator<br>";
        instructions += "<kbd>r</kbd>/<kbd>SELECT Button</kbd>: reset the demonstration<br></p>";
        return instructions;
    }
}

const OnFlightSimulatorFrameStart = function()
{
    projectDemosVariables.flightSimulator.world = new projectDemosVariables.flightSimulator.WORLD(100);
    projectDemosVariables.flightSimulator.player = new projectDemosVariables.flightSimulator.PLAYER(new jge.VECTOR(0,1, 0));
    projectDemosVariables.gamePad.joyStick.Zero();
}
const OnFlightSimulatorFrameUpdate = function(delta_time_)
{
    if (indexVariables.keyBuffer.IsKeyDown("r") || projectDemosVariables.gamePad.buttonSelect.down) OnFlightSimulatorFrameStart();


    const Z_NEAR = projectDemosVariables.flightSimulator.Z_NEAR;
    const Z_FAR = projectDemosVariables.flightSimulator.Z_FAR;
    let world = projectDemosVariables.flightSimulator.world;
    let player = projectDemosVariables.flightSimulator.player;
    let airDensity = world.airDensity*(1-player.position.vector[1]/(2*world.size));

    let playerNetSpeed = player.netSpeedVector.magnitude();
    let playerZDirection = new jge.VECTOR(player.orientation.matrix[2][0],player.orientation.matrix[2][1],player.orientation.matrix[2][2]);
    let playerZNetSpeed = player.netSpeedVector.Projection(playerZDirection.MulNumber(playerNetSpeed).vector);
    let windSpeed = world.windSpeedVector.magnitude();
    let windDirection = world.windSpeedVector.Normalise();
    let windZSpeed = world.windSpeedVector.Projection(playerZDirection.MulNumber(windSpeed).vector);
    let windForce = airDensity*0.1*windSpeed*windSpeed;
    //console.log(windForce);
    let windForceVector = windDirection.MulNumber(windForce);
    let netZSpeed = playerZNetSpeed + windZSpeed;

    //if (indexVariables.keyBuffer.IsKeyDown("q") && player.isBrakeOn) { player.isBrakeOn = !player.isBrakeOn; }//w
    if ((indexVariables.keyBuffer.IsKeyDown("w") || projectDemosVariables.gamePad.buttonX.down) && player.enginePower <= 49900) { player.isBrakeOn = false; player.enginePower += 100; }//w
    if ((indexVariables.keyBuffer.IsKeyDown("s") || projectDemosVariables.gamePad.buttonB.down) && player.enginePower >= 100) { player.enginePower -= 100; }//s

    let airSpeedFromProp = player.enginePower * (1-player.position.vector[1]/(2*world.size));
    let thrustForce = -airSpeedFromProp;/// (airDensity* ((airSpeedFromProp)*(airSpeedFromProp)-(netZSpeed)*(netZSpeed))*0.000000001*Math.PI*player.propRadius*player.propRadius) /2;
    let thrustForceVector = playerZDirection.MulNumber(thrustForce);
    //jge.l(airSpeedFromProp, netZSpeed);

    let gravityForce = -9.80665*player.mass;
    let gravityDirection = new jge.VECTOR(0,1,0);
    let gravityForceVector = gravityDirection.MulNumber(gravityForce);

    
    let playerNetDirection = player.netSpeedVector.Normalise();
    let dragForce = -playerNetSpeed*playerNetSpeed*0.5*1*airDensity;
    let dragForceVector = playerNetDirection.MulNumber(dragForce);

    let liftForce = netZSpeed*netZSpeed*0.5*2*airDensity;
    let playerYDirection = new jge.VECTOR(player.orientation.matrix[1][0],player.orientation.matrix[1][1],player.orientation.matrix[1][2]);
    let liftForceVector = playerYDirection.MulNumber(liftForce);

    
    if (indexVariables.keyBuffer.IsKeyDown("o") && player.elevator < 10) { player.elevator += 1; }//r
    if (indexVariables.keyBuffer.IsKeyDown("l") && player.elevator > -10) { player.elevator -= 1; }//f
    if (indexVariables.keyBuffer.IsKeyDown("o", "l")) { player.elevator = 0;  }//f
    if (indexVariables.keyBuffer.IsKeyDown("k") && player.aileron < 10) { player.aileron += 1; }//te69
    if (indexVariables.keyBuffer.IsKeyDown(";") && player.aileron > -10) { player.aileron -= 1; }//gt84
    if (indexVariables.keyBuffer.IsKeyDown("k", ";")) { player.aileron = 0; }//gt84
    if ((indexVariables.keyBuffer.IsKeyDown("a") || projectDemosVariables.gamePad.buttonY.down) && player.rudder < 10) { player.rudder += 1; }//yd68
    if ((indexVariables.keyBuffer.IsKeyDown("d") || projectDemosVariables.gamePad.buttonA.down) && player.rudder > -10) { player.rudder -= 1; }//hg71
    if (indexVariables.keyBuffer.IsKeyDown("a", "d") || (projectDemosVariables.gamePad.buttonY.down && projectDemosVariables.gamePad.buttonA.down)) { player.rudder = 0; }//hg71
    if (projectDemosVariables.gamePad.joyStick.IsOutOfDeadZone())
    {
        player.elevator = -projectDemosVariables.gamePad.joyStick.cartesian.y*10;
        player.aileron = -projectDemosVariables.gamePad.joyStick.cartesian.x*10;
    }
    
    let turnSpeedPitch = player.elevator;
    let turnSpeedRoll = player.aileron - player.enginePower*0.00005;
    let turnSpeedYall = player.rudder;
    let a = -0.2;//579.4248;
    let pitchTurnRate = a*turnSpeedPitch*netZSpeed;
    let rollTurnRate = a*turnSpeedRoll*netZSpeed;
    let yawTurnRate = a*turnSpeedYall*netZSpeed;

    player.orientation = player.orientation.MulMatrix(jge.CreateRotationMatrix(jge.math.DegreeToRadian(pitchTurnRate*delta_time_), player.orientation.matrix[0]).matrix);
    player.orientation = player.orientation.MulMatrix(jge.CreateRotationMatrix(jge.math.DegreeToRadian(rollTurnRate*delta_time_), player.orientation.matrix[2]).matrix);
    player.orientation = player.orientation.MulMatrix(jge.CreateRotationMatrix(jge.math.DegreeToRadian(yawTurnRate*delta_time_), player.orientation.matrix[1]).matrix);
                
    let pitchForceDirection = new jge.VECTOR(player.orientation.matrix[1][0],player.orientation.matrix[1][1],player.orientation.matrix[1][2]);
    let rollForceDirection = new jge.VECTOR(player.orientation.matrix[1][0],player.orientation.matrix[1][1],player.orientation.matrix[1][2]);
    let yawForceDirection = new jge.VECTOR(player.orientation.matrix[0][0],player.orientation.matrix[0][1],player.orientation.matrix[0][2]);
                //f=m*v^2/r
                //r=v^2/(g*tan(a))
                //f=m*g*tan(a)
    let b = 0.5;
    let pitchForce = b*gravityForce * Math.tan(jge.math.DegreeToRadian(pitchTurnRate));
    let rollForce = b*gravityForce * Math.tan(jge.math.DegreeToRadian(rollTurnRate));
    let yawForce = b*gravityForce * Math.tan(jge.math.DegreeToRadian(yawTurnRate));
    let pitchForceVector = pitchForceDirection.MulNumber(pitchForce);
    let rollForceVector = rollForceDirection.MulNumber(rollForce);
    let yawForceVector = yawForceDirection.MulNumber(yawForce);

    let tg = thrustForceVector.AddVector(gravityForceVector.vector);
    let tgw = tg.AddVector(windForceVector.vector);
    let tgwd = tgw.AddVector(dragForceVector.vector);
    let tgwdl = tgwd.AddVector(liftForceVector.vector);
    let tgwdlp = tgwdl.AddVector(pitchForceVector.vector);
    let tgwdlpr = tgwdlp.AddVector(rollForceVector.vector);
    let tgwdlpry = tgwdlpr.AddVector(yawForceVector.vector);
                

    let groundForce = 0;
    let groundFrictionForceVector = new jge.VECTOR(0,0,0);
    if (player.position.vector[1] === 1)
    {
        groundForce = tgwdlpry.vector[1];

        if (player.isBrakeOn||(Math.cos(45*jge.math.DEGREES_TO_RADIANS) <= (new jge.VECTOR(player.orientation.matrix[1][0],player.orientation.matrix[1][1],player.orientation.matrix[1][2])).DotProduct([0,-1,0])))
        {
            let groundFrictionDirection = (new jge.VECTOR(tgwdlpry.vector[0],0,tgwdlpry.vector[2])).Normalise();
            let groundFrictionForce = (new jge.VECTOR(tgwdlpry.vector[0],0,tgwdlpry.vector[2])).magnitude();
            if (Math.abs(10*groundForce) >= Math.abs(groundFrictionForce)) groundFrictionForce = -groundFrictionForce;
            else groundFrictionForce = -(groundFrictionForce/Math.abs(groundFrictionForce))*Math.abs(10*groundForce);
            groundFrictionForceVector = groundFrictionDirection.MulNumber(groundFrictionForce);
        }
        else
        {
            let groundFrictionXDirection = (new jge.VECTOR(player.orientation.matrix[0][0],0,player.orientation.matrix[0][2])).Normalise();
            let groundFrictionXForce = tgwdlpry.Projection(groundFrictionXDirection.MulNumber(tgwdlpry.magnitude()).vector);
            if (Math.abs(10*groundForce) >= Math.abs(groundFrictionXForce)) groundFrictionXForce = -groundFrictionXForce;
            else groundFrictionXForce = -(groundFrictionXForce/Math.abs(groundFrictionXForce))*Math.abs(10*groundForce);
            groundFrictionForceVector = groundFrictionXDirection.MulNumber(groundFrictionXForce);
        }
    }
    let groundForceVector = gravityDirection.MulNumber(groundForce);
                
    let tgwdlpryg = tgwdlpry.AddVector(groundForceVector.vector);
    let netForceVector = tgwdlpryg.AddVector(groundFrictionForceVector.vector);

    let playerSpeed = player.netSpeedVector.AddVector(netForceVector.MulNumber((1/player.mass)*delta_time_*0.5).vector);
    player.netSpeedVector = playerSpeed
    player.position = player.position.AddVector(player.netSpeedVector.MulNumber(delta_time_).vector);
    player.worldPosition = player.worldPosition.AddVector(player.netSpeedVector.MulNumber(delta_time_).vector);
    player.netSpeedVector = playerSpeed;// player.netSpeedVector.AddVector(netForceVector.MulNumber((1/player.mass)*delta_time_*0.5).vector);
                

    if (player.position.vector[1] < 1)
    {
        player.position.vector[1] = 1;
        player.worldPosition.vector[1] = 1;
        player.netSpeedVector.vector[1] = 0;
    }
    if (player.position.vector[1] > world.size*2-1)
    {
        player.position.vector[1] = world.size*2-1;
        player.worldPosition.vector[1] = world.size*2-1;
        player.netSpeedVector.vector[1] = 0;
    }
    if (player.position.vector[0] > 25) player.position.vector[0] += -50;
    if (player.position.vector[0] < -25) player.position.vector[0] += 50;
    if (player.position.vector[2] > 25) player.position.vector[2] += -50;
    if (player.position.vector[2] < -25) player.position.vector[2] += 50;
                
    if (player.orthonormalizedCounter++ === 30)
    {
        player.orientation.Orthonormalized();
        player.orthonormalizedCounter=0;
    }

    jge.ClearScreen(projectDemosVariables.screen, "black");

    let projectionMatrix = jge.CreateProjectionMatrix(projectDemosVariables.screen.canvas.width, projectDemosVariables.screen.canvas.height, jge.math.DegreeToRadian(60), Z_FAR, Z_NEAR);
    let cameraMatrix = player.orientation;
    for (let i = 0; i < 3; i++) cameraMatrix.matrix[3][i] = player.position.vector[i];
    let viewMatrix = cameraMatrix.Inverse();

    jge.RenderWireframe(projectDemosVariables.screen, world.terrain, viewMatrix, projectionMatrix, Z_NEAR);

    //let outputTextLine1 = "Speed: "+(playerZNetSpeed ? -playerZNetSpeed.toFixed(2): "0.00")+" m/s"
    //let outputTextLine2 = "Position: X:"+(player.worldPosition.vector[0].toFixed(2))+" m, Y:"+(player.worldPosition.vector[2].toFixed(2))+" m"
    /*let outputTextLine1 = "Engine Power: "+(100*player.enginePower/50000).toFixed(0)+"%"
    let outputTextLine2 = "Engine Power: "+(100*player.enginePower/50000).toFixed(0)+"%"
    let outputTextLine3 = "Engine Power: "+(100*player.enginePower/50000).toFixed(0)+"%"*/
    let outputTextLine4 = "Engine Power: "+(100*player.enginePower/50000).toFixed(0)+"%"
    //let outputTextLine3 = "Altitude: "+(player.position.vector[1]).toFixed(2)+"m"
    /*jge.DrawText(projectDemosVariables.screen, outputTextLine1, "20px mono", "rgb(0, 255, 0)", 0, 20);
    jge.DrawText(projectDemosVariables.screen, outputTextLine2, "20px mono", "rgb(0, 255, 0)", 0, 40);
    jge.DrawText(projectDemosVariables.screen, outputTextLine3, "20px mono", "rgb(0, 255, 0)", 0, 60);*/
    jge.DrawText(projectDemosVariables.screen, outputTextLine4, "20px mono", "rgb(0, 255, 0)", 0, 20);
}