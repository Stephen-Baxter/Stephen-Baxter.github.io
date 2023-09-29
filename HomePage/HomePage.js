let homeVariables = null;
class HOME_VARIABLES
{
    scene = null;
    camera = null;
    renderer = null;
    homePageXOffset = 0;
    homePageYOffset = 0;
    shapeTurnSpeed = 0.5;
    shapeTurnDirectionX = 1;
    shapeTurnDirectionY = 1;
    Iosahedrons = [];

    constructor()
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({canvas: $("#HOME_PAGE_3D_EFECT_")[0]});
        this.renderer.setSize($("#HOME_PAGE_3D_EFECT_").width(), $("#HOME_PAGE_3D_EFECT_").height());
    }

    OnResize = function()
    {
        if (indexVariables.screenLayoutType == 0 || indexVariables.screenLayoutType == 2)
        {
            $("#HOME_PAGE_3D_EFECT_").height("100%");
            $("#HOME_PAGE_3D_EFECT_").width($("#HOME_PAGE_3D_EFECT_").height());

            $("#HOME_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-areas", "'HEAD_SHOT_ TITLE_ TITLE_ TITLE_' 'HEAD_SHOT_ . WORK_HISTORY_ WORK_HISTORY_' 'ABOUT_WEBSITE_ ABOUT_WEBSITE_ WORK_HISTORY_ WORK_HISTORY_' 'ABOUT_WEBSITE_ ABOUT_WEBSITE_ WORK_HISTORY_ WORK_HISTORY_' 'ABOUT_WEBSITE_ ABOUT_WEBSITE_ WORK_HISTORY_ WORK_HISTORY_'");
            $("#HOME_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-columns", "calc(25% - 7.5px) calc(25% - 7.5px) calc(25% - 7.5px) calc(25% - 7.5px)");
            $("#HOME_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-rows", "auto auto auto");
        }
        else
        {
            $("#HOME_PAGE_3D_EFECT_").width("100%");
            $("#HOME_PAGE_3D_EFECT_").height($("#HOME_PAGE_3D_EFECT_").width());

            $("#HOME_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-areas", "'HEAD_SHOT_ TITLE_ TITLE_ TITLE_' 'HEAD_SHOT_ . . .' 'WORK_HISTORY_ WORK_HISTORY_ WORK_HISTORY_ WORK_HISTORY_' 'ABOUT_WEBSITE_ ABOUT_WEBSITE_ ABOUT_WEBSITE_ ABOUT_WEBSITE_'");
            $("#HOME_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-columns", "calc(25% - 7.5px) calc(25% - 7.5px) calc(25% - 7.5px) calc(25% - 7.5px)");
            $("#HOME_PAGE_ .TEXT_AREA_CONTAINER_").css("grid-template-rows", "auto auto auto auto");
        }

        this.renderer.setSize($("#HOME_PAGE_3D_EFECT_").width(), $("#HOME_PAGE_3D_EFECT_").height());
        this.homePageXOffset = Math.floor($("#MAIN_").width() / 2);
        this.homePageYOffset = Math.floor($("#MAIN_").height() / 2);
    }
}

const UpdateshapeTurnDirectionOnHomePage = function(event_)
{
    homeVariables.shapeTurnDirectionX = (event_.pageX - $(this).offset().left - homeVariables.homePageXOffset) / homeVariables.homePageXOffset;
    homeVariables.shapeTurnDirectionY = (event_.pageY - $(this).offset().top - homeVariables.homePageYOffset) / homeVariables.homePageYOffset;
    let shortestOffset = (homeVariables.homePageXOffset < homeVariables.homePageYOffset) ? homeVariables.homePageXOffset : homeVariables.homePageYOffset;
    if (homeVariables.shapeTurnDirectionX > shortestOffset) homeVariables.shapeTurnDirectionX = shortestOffset;
    if (homeVariables.shapeTurnDirectionY > shortestOffset) homeVariables.shapeTurnDirectionY = shortestOffset;
}

const CreateIosahedron = function(color_, size_, is_wireframe_, detail_)
{
    let geometryForIosahedron = new THREE.IcosahedronGeometry(size_, detail_);
    
    if (is_wireframe_)
    {
        let geometryForWireframeIosahedron = new THREE.WireframeGeometry(geometryForIosahedron);
        let materialForWireframeIosahedron = new THREE.LineBasicMaterial({color: color_});
        return new THREE.LineSegments(geometryForWireframeIosahedron, materialForWireframeIosahedron);
    }
    else
    {
        let materialForIosahedron = new THREE.MeshStandardMaterial( {
            color: color_,
            metalness: 0.5,
            roughness: 0.5,
        } );
        return new THREE.Mesh(geometryForIosahedron, materialForIosahedron);
    }
}

const OnHomeFrameStart = function()
{
    let light = new THREE.PointLight( 0xffffff, 1, 0, 0);
    light.position.set(0,0,0);
    light.castShadow = true;
    homeVariables.scene.add(light);

    homeVariables.Iosahedrons.push(CreateIosahedron(0xffd700, 0.5, false, 0));
    homeVariables.Iosahedrons.push(CreateIosahedron(0xc0c0c0, 0.499, false, 0));
    homeVariables.Iosahedrons.push(CreateIosahedron(0xff7f7f, 0.501, true, 0));
    homeVariables.Iosahedrons.push(CreateIosahedron(0x7fff7f, 0.502, true, 0));
    for (let i = 0; i < homeVariables.Iosahedrons.length; i++)
    {
        homeVariables.Iosahedrons[i].castShadow = true;
        homeVariables.scene.add(homeVariables.Iosahedrons[i]);
        homeVariables.Iosahedrons[i].position.set(0,0,0)
    }

    light.position.set(0,0,1.367);
    homeVariables.camera.position.set(0,0,1.367);
}
const OnHomeFrameUpdate = function(delta_time_)
{
    if (indexVariables.currentPageNumber === 0)
    {
        let turnSpeed = homeVariables.shapeTurnSpeed * delta_time_;
        homeVariables.Iosahedrons[0].rotation.x -= homeVariables.shapeTurnDirectionY * turnSpeed;
        homeVariables.Iosahedrons[0].rotation.y += homeVariables.shapeTurnDirectionX * turnSpeed;
        homeVariables.Iosahedrons[1].rotation.x += homeVariables.shapeTurnDirectionY * turnSpeed;
        homeVariables.Iosahedrons[1].rotation.y -= homeVariables.shapeTurnDirectionX * turnSpeed;
        homeVariables.Iosahedrons[2].rotation.x += homeVariables.shapeTurnDirectionY * turnSpeed;
        homeVariables.Iosahedrons[2].rotation.y += homeVariables.shapeTurnDirectionX * turnSpeed;
        homeVariables.Iosahedrons[3].rotation.x -= homeVariables.shapeTurnDirectionY * turnSpeed;
        homeVariables.Iosahedrons[3].rotation.y -= homeVariables.shapeTurnDirectionX * turnSpeed;
        homeVariables.renderer.render(homeVariables.scene, homeVariables.camera);
    }
}
const main_HomePage = function()
{
    homeVariables = new HOME_VARIABLES();
    //$("#TITLE_").html(homeVariables.text.title);

    $("#MAIN_").mousemove(UpdateshapeTurnDirectionOnHomePage);
}
