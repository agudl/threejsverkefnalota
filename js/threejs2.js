var container;
var camera, scene, renderer;
var plane, cube;
var mouse, raycaster, isCTRLDown, isShiftDown = false;
var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;
var objects = [];
let controls;
let zoomer = 1500;
let zoomInOut = 50;
let cubeColor = 0x000000;

let changeColor = document.getElementById('colorChangerrrr');

var element;

init();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setClearColor(0xffffff, 1.3);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);


    element = renderer.domElement;
    element.id = 'ourCanvas';
    container.appendChild(element);


    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1500;
    camera.position.y = 800;



    scene = new THREE.Scene();
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;


    // roll-over helpers
    rollOverGeo = new THREE.BoxGeometry(50, 50, 50);
    rollOverMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: .5,
        transparent: true
    });
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    scene.add(rollOverMesh);
    // cubes
    cubeGeo = new THREE.BoxGeometry(50, 50, 50);
    cubeMaterial = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture('../img/textures/originaltexture.jpg')
    });

    // grid
    var size = 700,
        step = 50;
    var geometry = new THREE.Geometry();
    for (var i = -size; i <= size; i += step) {
        geometry.vertices.push(new THREE.Vector3(-size, 0, i));
        geometry.vertices.push(new THREE.Vector3(size, 0, i));
        geometry.vertices.push(new THREE.Vector3(i, 0, -size));
        geometry.vertices.push(new THREE.Vector3(i, 0, size));
    }
    var material = new THREE.LineBasicMaterial({
        color: 0x000000,
        opacity: .5,
        transparent: true
    });
    var line = new THREE.LineSegments(geometry, material);
    scene.add(line);
    //
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var geometry = new THREE.PlaneBufferGeometry(1400, 1400);
    geometry.rotateX(-Math.PI / 2);
    plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        visible: false
    }));
    scene.add(plane);
    objects.push(plane);
    // Lights
    var ambientLight = new THREE.AmbientLight(0x606060);
    scene.add(ambientLight);
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 0.75, 0.5).normalize();
    scene.add(directionalLight);
    container.appendChild(renderer.domElement);



    controls.enableZoom = true;
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('keydown', onDocumentKeyDown, false);
    document.addEventListener('keyup', onDocumentKeyUp, false);

}

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        var intersect = intersects[0];
        rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
        rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    }
    render();
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        var intersect = intersects[0];
        // delete cube
        if (isCTRLDown) {
            if (intersect.object != plane) {
                scene.remove(intersect.object);
                objects.splice(objects.indexOf(intersect.object), 1);
                console.log(objects)
                console.log(objects.indexOf(intersect.object))
            }
            // create cube
        } else {
            var voxel = new THREE.Mesh(cubeGeo, cubeMaterial.clone());
            voxel.position.copy(intersect.point).add(intersect.face.normal);
            voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
            scene.add(voxel);
            objects.push(voxel);
        }
    }
	render();
}

function onDocumentKeyDown(event) {
    switch (event.keyCode) {
        case 17:
            isCTRLDown = true;
            break;
    }
}

function onDocumentKeyUp(event) {
    switch (event.keyCode) {
        case 17:
            isCTRLDown = false;
            break;
    }
}

window.addEventListener("keydown", function(event) {
    if (event.keyCode == 16) {
        controls.enabled = true;
        document.body.style.cursor = "move";
        rollOverMesh.material.opacity = "0";
		isShiftDown == true;
		render();
    }

	if (event.keyCode == 17) {
        rollOverMesh.material.opacity = "0";
		render();
    }
});

window.addEventListener("keyup", function(event) {
    if (event.keyCode == 16) {
        controls.enabled = false;
        document.body.style.cursor = "auto";
        rollOverMesh.material.opacity = "0.5";
		isShiftDown == false;
    }
	if (event.keyCode == 17) {
        rollOverMesh.material.opacity = ".5";
    }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    // stats.update();
    render();
}

render();

function render() {

    renderer.render(scene, camera);
}

let glassCube = document.getElementById('glassCube');
let grassCube = document.getElementById('grassCube');
let woodCube = document.getElementById('woodCube');
let brickCube = document.getElementById('brickCube');
let concreteCube = document.getElementById('concreteCube');
let seaCube = document.getElementById('seaCube');
let lavaCube = document.getElementById('lavaCube');


function changeTexture(typeOfTexture) {
	cubeMaterial = new THREE.MeshLambertMaterial({
		map: THREE.ImageUtils.loadTexture(typeOfTexture)
	});
}

glassCube.addEventListener("click", function() {
	changeTexture("../img/textures/clearglass1.jpg");
});

grassCube.addEventListener("click", function() {
	changeTexture("../img/textures/grasstexture.jpg");
});

woodCube.addEventListener("click", function() {
	changeTexture("../img/textures/woodtexture.jpg");
});

brickCube.addEventListener("click", function() {
	changeTexture("../img/textures/bricktexture.png");
});

concreteCube.addEventListener("click", function() {
    changeTexture("../img/textures/concrete.jpg");
});

seaCube.addEventListener("click", function() {
    changeTexture("../img/textures/seatexture2.jpg");
});

lavaCube.addEventListener("click", function() {
    changeTexture("../img/textures/lavatexture.jpg");
});
