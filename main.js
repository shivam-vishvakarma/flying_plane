import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 10;
// camera.position.y = 20;
// camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#app").appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

const skyimg = new THREE.TextureLoader().load("/sky.jpg");
const grass = new THREE.TextureLoader().load("/grass.jpg");
grass.wrapS = THREE.RepeatWrapping;
grass.wrapT = THREE.RepeatWrapping;
grass.repeat.set(10, 10);

const skyGeo = new THREE.SphereGeometry(100, 25, 25);
const skyMat = new THREE.MeshBasicMaterial({
  map: skyimg,
});
const sky = new THREE.Mesh(skyGeo, skyMat);
sky.material.side = THREE.BackSide;
scene.add(sky);
sky.position.y = 50;

const jameenGeo = new THREE.PlaneGeometry(100, 100);
// const jameenMat = new THREE.TextureLoader().load("./public/grass.jpg");
const jameenMat = new THREE.MeshBasicMaterial({ map: grass });
const jameen = new THREE.Mesh(jameenGeo, jameenMat);
jameen.rotation.x = -Math.PI / 2;
jameen.position.y = -10;
scene.add(jameen);
const platgeo = new THREE.PlaneGeometry(10, 10);
// const jameenMat = new THREE.TextureLoader().load("./public/grass.jpg");
const platmat = new THREE.MeshBasicMaterial({ color: "blue" });
const plat = new THREE.Mesh(platgeo, platmat);
plat.rotation.x = -Math.PI / 2;
plat.position.set(-10, -4, -20);
scene.add(plat);

const loader = new GLTFLoader();
let plane;
loader.load("/plane.glb", (model) => {
  plane = model;
  model.scene.position.set(0, -1, camera.position.z - 3);
  scene.add(model.scene);
  let mixer = new THREE.AnimationMixer(model.scene);
  let clips = model.animations;
  let clip = THREE.AnimationClip.findByName(clips, "Take 001");
  let action = mixer.clipAction(clip);
  //   console.log(action);
  action.play();
});

function land() {
  console.log("landed");
}
land();

let speed = 0.1;

const handleKeyDown = (e) => {
  // console.log(e);
  //   console.log(plane.scene.rotateY());
  if (e.key === "ArrowLeft") {
    plane.scene.position.x -= 0.01;
    plane.scene.rotateY(0.05);
    // plane.scene.rotateZ(-0.009);
  }
  if (e.key === "ArrowRight") {
    plane.scene.rotateY(-0.05);
    plane.scene.position.x += 0.01;
    // plane.scene.rotateZ(0.009);
  }
  if (e.key === "ArrowUp") {
    plane.scene.position.z -= 0.01;
    // plane.scene.rotateZ(0.009);
    var vec = new THREE.Vector3(0, 0, speed);
    vec.applyQuaternion(plane.scene.quaternion);
    plane.scene.position.add(vec);
  }
  if (e.key === "ArrowDown") {
    // plane.scene.rotateY(-0.05);
    plane.scene.position.z += 0.01;
    var vec = new THREE.Vector3(0, 0, -speed);
    vec.applyQuaternion(plane.scene.quaternion);
    plane.scene.position.add(vec);
    // plane.scene.rotateZ(0.009);
  }
};

document.addEventListener("keydown", handleKeyDown);

const animate = function () {
  requestAnimationFrame(animate);

  //   jameen.rotation.x += 0.001;
  renderer.render(scene, camera);
};

animate();
