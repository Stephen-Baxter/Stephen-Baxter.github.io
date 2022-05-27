let camera = null;
let light = null;
let renderer = null;
let homePageXOffset = 0, homePageYOffset = 0;
let shapeTurnspeed = 0.015;
let shapeTurnDirectionX = 1, shapeTurnDirectionY = 1;

const UpdateSceneSize = function()
{
    renderer.setSize($("#HOME_PAGE_3D_EFECT_").width(), $("#HOME_PAGE_3D_EFECT_").height());
    homePageXOffset = Math.floor($("#MAIN_").width() / 2);
    homePageYOffset = Math.floor($("#MAIN_").height() / 2);
}

const UpdateshapeTurnDirectionOnHomePage = function(event_)
{
    shapeTurnDirectionX = (event_.pageX - $(this).offset().left - homePageXOffset) / homePageXOffset;
    shapeTurnDirectionY = (event_.pageY - $(this).offset().top - homePageYOffset) / homePageYOffset;
    let shortestOffset = (homePageXOffset < homePageYOffset) ? homePageXOffset : homePageYOffset;
    if (shapeTurnDirectionX > shortestOffset) shapeTurnDirectionX = shortestOffset;
    if (shapeTurnDirectionY > shortestOffset) shapeTurnDirectionY = shortestOffset;
}

const main_HomePage = function()
{
    let scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    let light = new THREE.PointLight( 0xffffff, 1, 0, 0);
    light.position.set(0,0,0);
    light.castShadow = true;
    scene.add(light);
    renderer = new THREE.WebGLRenderer({canvas: $("#HOME_PAGE_3D_EFECT_")[0]});
    renderer.setSize($("#HOME_PAGE_3D_EFECT_").width(), $("#HOME_PAGE_3D_EFECT_").height());

    const geometryForIoSahedron = new THREE.IcosahedronGeometry(0.5, 0);
    const materialForIoSahedron = new THREE.MeshStandardMaterial( {
        //color: 0xc0c0c0,
        color: 0xffd700,
        metalness: 0.5,
        roughness: 0.5,
    } );
    const IoSahedron = new THREE.Mesh( geometryForIoSahedron, materialForIoSahedron );
    IoSahedron.castShadow = true;
    //scene.add(light);
    scene.add( IoSahedron );

    IoSahedron.position.set(0,0,0)
    light.position.set(0,0,1.367);
    camera.position.set(0,0,1.367);

    function animate() {
        requestAnimationFrame( animate );
        IoSahedron.rotation.x -= shapeTurnDirectionY * shapeTurnspeed;
        IoSahedron.rotation.y += shapeTurnDirectionX * shapeTurnspeed;
        renderer.render( scene, camera );
    }
    animate();

    $("#MAIN_").mousemove(UpdateshapeTurnDirectionOnHomePage);
}
