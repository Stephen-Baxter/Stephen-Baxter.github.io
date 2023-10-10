class RAYCASTER
{
    constructor()
    {  
        
    }
    WORLD = class
    {
        constructor(map_, map_width_)
        {
            this.map = map_;
            this.mapWidth = map_width_;

            this.GetMapData = function(x_ = Number(), y_ = Number()) { return this.map.charCodeAt(y_ * this.mapWidth + x_) - 48; }
        }
    }
    PLAYER = class
    {
        constructor(position_, look_at_, field_of_view_, rotate_velocity_, move_velocity_)
        {
            this.position = position_;
            this.lookAt = look_at_;
            this.fieldOfView = field_of_view_;
            this.screenHalfToDistanceToScreen = Math.sin(jge.math.DegreeToRadian(field_of_view_ / 2)) / Math.cos(jge.math.DegreeToRadian(field_of_view_ / 2));
            this.rotateVelocity = rotate_velocity_;
            this.moveVelocity = move_velocity_;
        }
    }

    Instructions = function()
    {
        let instructions = "<header><h2>instructions</h2></header>"
        instructions += "<p class=\".p2\"><kbd>a</kbd>/<kbd>JOY STICK Left</kbd>: turn left<br>";
        instructions += "<kbd>d</kbd>/<kbd>JOY STICK Right</kbd>: turn right<br>";
        instructions += "<kbd>w</kbd>/<kbd>JOY STICK Up</kbd>: move forward<br>";
        instructions += "<kbd>s</kbd>/<kbd>JOY STICK Down</kbd>: move backward<br>";
        instructions += "<kbd>r</kbd>/<kbd>SELECT Button</kbd>: reset the demonstration<br></p>";
        return instructions;
    }
}

const OnRaycasterFrameStart = function()
{
    projectDemosVariables.raycaster.world = new projectDemosVariables.raycaster.WORLD("1111111111100000000110100001011000000001100000000110000000011000000001101000010110000000011111111111", 10);
    projectDemosVariables.raycaster.player = new projectDemosVariables.raycaster.PLAYER({x: 5, y: 5}, 0, 60, 0.075, 0.0025);
}
const OnRaycasterFrameUpdate = function(delta_time_)
{
    if (indexVariables.keyBuffer.IsKeyDown("r") || projectDemosVariables.gamePad.buttonSelect.down) OnRaycasterFrameStart();

    let world = projectDemosVariables.raycaster.world;
    let player = projectDemosVariables.raycaster.player;

    let playerLookAtX = Math.cos(jge.math.DegreeToRadian(player.lookAt));
    let playerLookAtY = Math.sin(jge.math.DegreeToRadian(player.lookAt));
    let playerPlaneX = playerLookAtY * player.screenHalfToDistanceToScreen;
    let playerPlaneY = -playerLookAtX * player.screenHalfToDistanceToScreen;
    let mapPositionOffset = {x: player.position.x % 1, y: player.position.y % 1};
    let mapPosition = {x: Math.floor(player.position.x), y: Math.floor(player.position.y)};

    jge.ClearScreen(projectDemosVariables.screen, "black");

    for (let i = 0; i < projectDemosVariables.screen.canvas.width; i++)
    {
        let cameraX = 2 * i / projectDemosVariables.screen.canvas.width - 1;

        let rayDirection = {x: playerLookAtX + playerPlaneX * cameraX, y: playerLookAtY + playerPlaneY * cameraX};
        if (rayDirection.x == 0) rayDirection.x = 0.000001;
        if (rayDirection.y == 0) rayDirection.y = 0.000001;  

        let playerMapPositionForDDA = {x: mapPosition.x, y: mapPosition.y};
        let step = {x: 0, y: 0};
        let deltaDistance = {x: Math.abs(1 / rayDirection.x), y: Math.abs(1 / rayDirection.y)};
        let sideDistance = {x: 0, y: 0};
        let distanceToWall = 0;
        let wallSideX = true;
                
        if (rayDirection.x < 0)
        {
            step.x = -1;
            sideDistance.x = mapPositionOffset.x * deltaDistance.x;
        }
        else
        {
            step.x = 1;
            sideDistance.x = (1 - mapPositionOffset.x) * deltaDistance.x;
        }
        if (rayDirection.y < 0)
        {
            step.y = -1;
            sideDistance.y = mapPositionOffset.y * deltaDistance.y;
        }
        else
        {
            step.y = 1;
            sideDistance.y = (1 - mapPositionOffset.y) * deltaDistance.y;
        }

        while (true)
        {
            if (sideDistance.x < sideDistance.y)
            {
                sideDistance.x += deltaDistance.x;
                playerMapPositionForDDA.x += step.x;
                wallSideX = true;
            }
            else
            {
                sideDistance.y += deltaDistance.y;
                playerMapPositionForDDA.y += step.y;
                wallSideX = false;
            }
                    
            if (world.GetMapData(playerMapPositionForDDA.x, playerMapPositionForDDA.y) === 1) break;
        }

        if (wallSideX) distanceToWall = sideDistance.x - deltaDistance.x;
        else distanceToWall = sideDistance.y - deltaDistance.y;

        let distanceToScreen = projectDemosVariables.screen.canvas.width / 2.0 / player.screenHalfToDistanceToScreen;
        let wallHeight = 1 / distanceToWall * distanceToScreen;
        
        let ceiling = Math.floor(projectDemosVariables.screen.canvas.height / 2 - wallHeight / 2);
        if (ceiling < 0) ceiling = 0;
        let floor = Math.floor(projectDemosVariables.screen.canvas.height / 2 + wallHeight / 2);
        if (floor >= projectDemosVariables.screen.canvas.height) floor = projectDemosVariables.screen.canvas.height - 1;
        //jge.l(ceiling, floor);
        let playerRotateVelocity = player.rotateVelocity * delta_time_;
	    let playerMoveVelocity = player.moveVelocity * delta_time_;
        if (indexVariables.keyBuffer.IsKeyDown("a") || projectDemosVariables.gamePad.joyStick.right)
        {
            player.lookAt = player.lookAt + playerRotateVelocity;
	        if (player.lookAt >= 360) player.lookAt - 360;
        }
        if (indexVariables.keyBuffer.IsKeyDown("d") || projectDemosVariables.gamePad.joyStick.left)
        {
            player.lookAt = player.lookAt - playerRotateVelocity;
	        if (player.lookAt < 0) player.lookAt + 360;
        }
        if (indexVariables.keyBuffer.IsKeyDown("w") ||  projectDemosVariables.gamePad.joyStick.up)
        {
            let newPositionX = player.position.x + playerLookAtX * playerMoveVelocity;
            let newPositionY = player.position.y + playerLookAtY * playerMoveVelocity;
            if (Math.floor(newPositionX) >= 0 &&  Math.floor(newPositionX) < world.mapWidth && Math.floor(newPositionY) >= 0 && Math.floor(newPositionY) < world.mapWidth)
            {
                if (world.GetMapData(Math.floor(newPositionX), Math.floor(newPositionY)) == 0)
                {
                    player.position.x = newPositionX;
                    player.position.y = newPositionY;
                }
            }
        }
        if (indexVariables.keyBuffer.IsKeyDown("s") ||  projectDemosVariables.gamePad.joyStick.down)
        {
            let newPositionX = player.position.x - playerLookAtX * playerMoveVelocity;
            let newPositionY = player.position.y - playerLookAtY * playerMoveVelocity;
            if (Math.floor(newPositionX) >= 0 &&  Math.floor(newPositionX) < world.mapWidth && Math.floor(newPositionY) >= 0 && Math.floor(newPositionY) < world.mapWidth)
            {
                if (world.GetMapData(Math.floor(newPositionX), Math.floor(newPositionY)) == 0)
                {
                    player.position.x = newPositionX;
                    player.position.y = newPositionY;
                }
            }
        }
        //jge.l(ceiling, floor);
        jge.DrawLine(projectDemosVariables.screen, "rgb(0, 255, 0)", [i, ceiling], [i, floor]);
    }
}