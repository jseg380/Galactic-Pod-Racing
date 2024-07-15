import * as THREE from '../libs/three.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import * as TWEEN from '../libs/tween.esm.js'

import { Aceite } from './modelos/Aceite.js'
import { Cactus } from './modelos/Cactus.js'
import { Escudo } from './modelos/Escudo.js'
import { Jugador } from './modelos/Jugador.js'
import { LlaveInglesa } from './modelos/LlaveInglesa.js'
import { MapaTubo } from './modelos/MapaTubo.js'
import { NaveEnemiga } from './modelos/NaveEnemiga.js'
import { Queroseno } from './modelos/Queroseno.js'
import { Roca } from './modelos/Roca.js'


class MyScene extends THREE.Scene {
  // Constructor
  constructor(myCanvas) {
    super();

    // Create renderer
    this.renderer = this.createRenderer(myCanvas);

    // Set animation parameters
    this.lapTime = 2000;
    this.posInterval = 1 / this.lapTime;
    this.lastPosition = { t: 0, r: 0 };
    this.rotInterval = (Math.PI * 2) / 200;

    // Collisions
    this.lastCollisionTime = performance.now();
    // Collision time cooldown in milliseconds
    this.collisionCooldown = 400;
    this.collisionVector = new Array(20).fill().map(() => []);

    // Enemies
    this.enemiesAnimation = {};

    // Create objects
    this.createMap();
    this.mapWidth = this.gameMap.getWidth();
    this.createPlayer();
    this.createPrototypeModels();
    this.createObstacles();
    this.createEnemies();
    this.shieldActive = false;

    // Create other needed elements
    this.createLights();
    this.createCameras();

    // Pick function
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  // Create methods {

  createMap() {
    this.gameMap = new MapaTubo();
    this.segments = 5000;
    this.binormals = this.gameMap.spline.computeFrenetFrames(this.segments, true).binormals;

    // Add map to the scene
    this.add(this.gameMap);
  }

  createPlayer() {
    this.player = new Jugador();

    // Bounding box for collision detection
    this.player.boundingBox = new THREE.Box3();

    this.stopAnimation = false;

    this.placeObject(this.player, this.lastPosition, 0.5);

    // Remaining lives
    this.lives = 3;
    this.updateGUI();
  }

  createCameras() {
    // Map camera
    this.mapCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 400);
    this.mapCamera.position.set(0, 0, 100);
    const look = new THREE.Vector3(0, 0, 0);
    this.mapCamera.lookAt(look);

    // Controls for the map camera (only this camera has controls)
    this.cameraControl = new TrackballControls(this.mapCamera, this.renderer.domElement);
    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;

    // Player camera
    this.playerCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 100);
    this.playerCamera.rotateY(Math.PI);
    this.playerCamera.rotateX(-Math.PI / 12);
    this.playerCamera.translateZ(6);
    this.playerCamera.translateY(1.3);
    // Add camera to player node
    this.player.add(this.playerCamera);

    this.usingMapCamera = false;
  }

  createLights() {
    // Ambient light
    this.ambientLight = new THREE.AmbientLight(0xfff7f2, 0.1);
    this.add(this.ambientLight);

    // Directional light
    this.directionalLight = new THREE.DirectionalLight(0xfcf4cf, 1);
    this.directionalLight.position.set(1, 1, 1).normalize();
    this.directionalLight.castShadow = true;
    this.add(this.directionalLight);

    // Interactive light
    this.blinkingLight = new THREE.PointLight(0xff0000, 100, 200);
  }

  createRenderer(myCanvas) {
    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0x333333), 1.0);

    renderer.setSize(window.innerWidth, window.innerHeight);

    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  createPrototypeModels() {
    const classes = [Aceite, Cactus, Escudo, LlaveInglesa, NaveEnemiga,
      Queroseno, Roca];

    const transformations = {
      Aceite: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(3),
      },
      Cactus: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(2.5),
      },
      Escudo: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(1),
      },
      LlaveInglesa: {
        position: [0, -1.8, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(0.4),
      },
      NaveEnemiga: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(1),
      },
      Queroseno: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(1),
      },
      Roca: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(4),
      },
    };

    const effects = {
      Aceite: {
        lives: -1,
        bad: true,
      },
      Cactus: {
        lives: -1,
        replace: true,
        bad: true,
      },
      Escudo: {
        shield: true,
        duration: 5000,
      },
      LlaveInglesa: {
        lives: +1,
        replace: true,
      },
      NaveEnemiga: {
        lives: +2,
      },
      Queroseno: {
        speed: true,
        multiplier: 2, // 200%
        duration: 3000,
        replace: true,
      },
      Roca: {
        lives: -2,
        bad: true,
      },
    }

    this.prototypeModels = classes.map(cls => {
      const c = new cls();
      const transform = transformations[cls.name];

      if (transform) {
        for (const key in transform) {
          if (transform.hasOwnProperty(key) && c[key]) {
            c[key].set(...transform[key]);
          }
        }
      }

      const effect = effects[cls.name];

      if (effect) {
        c.effects = effect;
      }

      return c;
    });
  }

  // For improving efficiency, see InstancedMesh
  // https://threejs.org/examples/?q=perfor#webgl_instancing_performance
  // https://threejs.org/docs/index.html?q=instanc#api/en/objects/InstancedMesh
  createObstacles() {
    this.prototypeModels
      .filter(cls => !(cls instanceof NaveEnemiga))
      .forEach(cls => {
        for (let i = 0; i < 5; i++) {
          const tValue = Math.random();
          const rValue = Math.random() * 2 * Math.PI;
          const obstacle = cls.clone(true);
          obstacle.effects = cls.effects;

          // Add object to its corresponding vector
          const index = Math.floor(tValue * this.collisionVector.length);
          this.collisionVector[index].push(obstacle);

          // Place object in the map
          this.placeObject(obstacle, { t: tValue, r: rValue });

          // Bounding box for collisions
          obstacle.boundingBox = new THREE.Box3().setFromObject(obstacle);
        }
      });
  }

  createEnemies() {
    const getRandom = (limits) => {
      return Math.floor(Math.random() * (limits.max - limits.min + 1)) + limits.min;
    };

    const cls = this.prototypeModels[4];
    for (let i = 0; i < 3; i++) {
      const enemy = cls.clone();
      enemy.effects = cls.effects;

      const rValue = Math.random();
      const origin = { t: Math.random() };
      const end = { t: 1 };
      const timeLimits = { max: 50000, min: 30000 };
      const heightLimits = { max: 6, min: 3 };

      const height = getRandom(heightLimits);
      const animationTime = getRandom(timeLimits);

      const animation = new TWEEN.Tween(origin).to(end, animationTime).onUpdate(() => {
        this.placeObject(enemy, { t: origin.t, r: rValue }, height);
      });

      animation.repeat(Infinity);
      animation.yoyo(true);
      animation.start();
      this.enemiesAnimation[enemy.uuid] = [enemy, animation];
    }
  }

  // }

  // Setters {

  setCameraAspect(ratio) {
    // Update camera's aspect ratio
    this.playerCamera.aspect = ratio;
    this.mapCamera.aspect = ratio;

    // Update camera's projection matrix
    this.mapCamera.updateProjectionMatrix();
    this.playerCamera.updateProjectionMatrix();
  }

  // }

  // Getters {

  getCamera() {
    // Return the camera in use
    return (this.usingMapCamera) ? this.mapCamera : this.playerCamera;
  }

  // }

  // Collisions {

  checkCollisions() {
    // Get the position of the map in which the player is and check if it has 
    // collided with any of the objects near it (those in the vector)
    const index = Math.floor(this.lastPosition.t * this.collisionVector.length);

    // Update player's bounding box
    this.player.boundingBox.setFromObject(this.player);

    // Check for collisions with objects in the vector
    this.collisionVector[index].forEach(obstacle => {
      if (this.player.boundingBox.intersectsBox(obstacle.boundingBox)) {
        // Handle collision
        const now = performance.now();
        if (now - this.lastCollisionTime >= this.collisionCooldown) {
          this.applyEffect(obstacle);
          this.lastCollisionTime = now;
        }
      }
    });
  }

  applyEffect(object) {
    const effects = object.effects;

    // Bad objects don't have any effect while the shield is active
    if (effects.hasOwnProperty('bad') && this.shieldActive) return;

    if (effects.hasOwnProperty('lives')) {
      this.lives += effects.lives;
    }

    if (effects.hasOwnProperty('replace')) {
      if (effects.replace) {
        setTimeout(() => {
          this.moveObject(object);
        }, 50);
      }
      else {
        this.remove(object);
      }
    }

    if (effects.hasOwnProperty('shield')) {
      this.shieldActive = true;
      this.player.escudo.visible = true;

      setTimeout(() => {
        this.shieldActive = false;
        this.player.escudo.visible = false;
        this.remove(object);
      }, effects.duration);
    }

    if (effects.hasOwnProperty('speed')) {
      const prevLaptime = this.lapTime;

      this.lapTime = this.lapTime / effects.multiplier;
      this.posInterval = 1 / this.lapTime;
      setTimeout(() => {
        this.lapTime = prevLaptime;
        this.posInterval = 1 / this.lapTime;
      }, effects.duration);
    }

    this.updateGUI();

    if (this.lives <= 0) {
      this.stopAnimation = true;
      this.lastCollisionTime = performance.now();
      openDialog();
    }
  }


  // }

  //  Misc {

  updateGUI() {
    document.getElementById('vidas').textContent = `Vidas: ${this.lives}`;
  }

  updateAnimationParam() {
    this.lapTime = Math.floor(this.lapTime * 0.9);
    this.posInterval = 1 / this.lapTime;
  }

  animatePlayer() {
    const tNext = (this.lastPosition.t + this.posInterval) % 1;
    if (tNext < this.lastPosition.t)
      this.updateAnimationParam();

    this.lastPosition.t = tNext;

    this.placeObject(this.player, { t: tNext, r: this.lastPosition.r }, 0.5);
  }

  placeObject(object, position, offSet = 0.0) {
    const { t, r } = position;

    // Calculate the position of the object in space knowing its position
    // relative to the spline [0.0, 1.0]
    const posVector = this.gameMap.spline.getPointAt(t);
    object.position.copy(posVector);

    const tangent = this.gameMap.spline.getTangentAt(t).add(posVector);
    object.lookAt(tangent);

    object.rotateZ(r);
    object.translateY(this.mapWidth + offSet);
    object.up = this.binormals[Math.floor(t * this.segments)]

    // Place object
    this.add(object);
  }

  moveObject(object) {
    object.boundingBox.setFromObject(object);
    this.placeObject(object, { t: Math.random(), r: Math.random() * 2 * Math.PI });
  }

  //  }

  // Event listeners {

  onWindowResize() {
    // Update camera aspect ratio
    this.setCameraAspect(window.innerWidth / window.innerHeight);

    // Update renderer size
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onKeydown(event) {
    switch (event.key.toLowerCase()) {
      case 'a':
      case 'arrowleft':
        if (!this.stopAnimation)
          this.lastPosition.r = (this.lastPosition.r - this.rotInterval + (Math.PI * 2)) % (Math.PI * 2);
        break;
      case 'd':
      case 'arrowright':
        if (!this.stopAnimation)
          this.lastPosition.r = (this.lastPosition.r + this.rotInterval) % (Math.PI * 2);
        break;
      case 'c':
        this.usingMapCamera = !this.usingMapCamera;
        break;
      case ' ':
        this.stopAnimation = !this.stopAnimation;
        break;
    }
  }

  pickObject(event) {
    if (this.stopAnimation) return;
    // Convert mouse coordinates to NDC
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Place raycaster in the camera position
    this.raycaster.setFromCamera(this.mouse, this.getCamera());

    // Find intersections with all objects
    const intersections = this.raycaster.intersectObjects(this.children, true);

    // No object was clicked
    if (intersections.length === 0) return;

    // Only the first object matters, the rest are behind that one
    const clickedObject = intersections[0].object.parent;

    // Only flying enemies are valid targets
    if (!(clickedObject instanceof NaveEnemiga)) return;
    if (clickedObject.clicked === true) return;

    clickedObject.clicked = true;
    this.applyEffect(clickedObject);

    this.blinkingLight.position.copy(clickedObject.position);
    this.add(this.blinkingLight);
    this.interactiveLight = true;

    // Show bounding box for 1 second to aid visualization of click
    setTimeout(() => {
      delete this.enemiesAnimation[clickedObject.uuid][1];
      delete this.enemiesAnimation[clickedObject.uuid];
      this.remove(clickedObject);
      this.remove(this.blinkingLight);
    }, 200);
  }


  // }

  // Update method
  update() {
    this.renderer.render(this, this.getCamera());

    requestAnimationFrame(() => this.update());

    // Update camera control according to its controller
    this.cameraControl.update();

    if (this.stopAnimation) return;

    // All update functions here
    this.player.update();
    this.animatePlayer();

    this.checkCollisions();

    Object.values(this.enemiesAnimation).forEach(enAnim => enAnim[1].update());
  }
}


$(function() {
  const scene = new MyScene('#WebGL-output');

  openMainScreen().then(() => {
    window.addEventListener('resize', () => scene.onWindowResize());

    window.addEventListener('keydown', (e) => scene.onKeydown(e));

    window.addEventListener('click', (e) => scene.pickObject(e), false);

    scene.update();
  });
});
