import * as THREE from '../libs/three.module.js'
import { GUI } from '../libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { RGBELoader } from '../libs/RGBELoader.js'

import { Aceite } from '../main/modelos/Aceite.js'
import { Cactus } from '../main/modelos/Cactus.js'
import { Escudo } from '../main/modelos/Escudo.js'
import { Jugador } from '../main/modelos/Jugador.js'
import { LlaveInglesa } from '../main/modelos/LlaveInglesa.js'
import { MapaTubo } from '../main/modelos/MapaTubo.js'
import { NaveEnemiga } from '../main/modelos/NaveEnemiga.js'
import { Queroseno } from '../main/modelos/Queroseno.js'
import { Roca } from '../main/modelos/Roca.js'


class MyScene extends THREE.Scene {
  constructor(myCanvas) {
    super();

    this.renderer = this.createRenderer(myCanvas);

    this.gui = this.createGUI();

    this.createLights();
    this.createCamera();

    this.axis = new THREE.AxesHelper(1);
    this.add(this.axis);

    this.createModelAnimations();

    this.modelList = this.fillModelList();
    this.modelIndex = 0;
    this.model = this.modelList[this.modelIndex];
    this.add(this.model);

    window.addEventListener('keydown', (event) => {
      switch (event.key.toLowerCase()) {
        case 'arrowright':
          this.modelIndex = (this.modelIndex + 1) % this.modelList.length;
          this.remove(this.model);
          this.model = this.modelList[this.modelIndex];
          this.add(this.model);
          break;
        case 'arrowleft':
          this.modelIndex = (this.modelIndex - 1 + this.modelList.length) % this.modelList.length;
          this.remove(this.model);
          this.model = this.modelList[this.modelIndex];
          this.add(this.model);
          break;
      }
    });
  }

  // Create methods

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 40);
    this.camera.position.set(4, 1, 4);
    const look = new THREE.Vector3(0, 0, 0);
    this.camera.lookAt(look);
    this.add(this.camera);

    this.cameraControl = new TrackballControls(this.camera, this.renderer.domElement);

    this.cameraControl.rotateSpeed = 5;
    this.cameraControl.zoomSpeed = -2;
    this.cameraControl.panSpeed = 0.5;
    this.cameraControl.target = look;
  }

  createModelAnimations() {
    this.modelRotateAnimation = true;
    this.modelOwnAnimation = true;
  }

  createGUI() {
    const gui = new GUI();

    this.guiControls = {
      lightPower: 600,
      ambientIntensity: 0.35,
      envOnOff: true,
      axisOnOff: true,
      rotateOnOff: true,
      ownAnimationOnOff: true,
    }

    const lightAxisFolder = gui.addFolder('Luz y Ejes');

    lightAxisFolder.add(this.guiControls, 'lightPower', 0, 800, 20)
      .name('Luz puntual: ')
      .onChange((value) => this.setLightPower(value));

    lightAxisFolder.add(this.guiControls, 'ambientIntensity', 0, 1, 0.05)
      .name('Luz ambiental: ')
      .onChange((value) => this.setAmbientIntensity(value));

    lightAxisFolder.add(this.guiControls, 'envOnOff')
      .name('Luz del mapa ambiente: ')
      .onChange((value) => this.setEnvLight(value));

    lightAxisFolder.add(this.guiControls, 'axisOnOff')
      .name('Mostrar ejes: ')
      .onChange((value) => this.setAxisVisible(value));

    const animationFolder = gui.addFolder('Animación');

    animationFolder.add(this.guiControls, 'rotateOnOff')
      .name('Rotar modelo: ')
      .onChange((value) => this.setRotateAnimation(value));

    animationFolder.add(this.guiControls, 'ownAnimationOnOff')
      .name('Animación propia: ')
      .onChange((value) => this.setModelAnimation(value));

    return gui;
  }

  createLights() {
    this.ambientLight = new THREE.AmbientLight('white', this.guiControls.ambientIntensity);
    this.add(this.ambientLight);

    this.pointLight = new THREE.SpotLight(0xffffff);
    this.pointLight.power = this.guiControls.lightPower;
    this.pointLight.position.set(5, 6.7, 4); // Vector in the sun's direction
    this.add(this.pointLight);
  }

  createRenderer(myCanvas) {
    const renderer = new THREE.WebGLRenderer();

    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);

    renderer.setSize(window.innerWidth, window.innerHeight);

    $(myCanvas).append(renderer.domElement);

    return renderer;
  }

  // Setters

  setLightPower(valor) {
    this.pointLight.power = valor;
  }

  setAmbientIntensity(valor) {
    this.ambientLight.intensity = valor;
  }

  setEnvLight(valor) {
    // TODO: disable reflectivity 
    // https://threejs.org/docs/#api/en/materials/MeshBasicMaterial.reflectivity
  }

  setAxisVisible(valor) {
    this.axis.visible = valor;
  }

  setRotateAnimation(valor) {
    this.modelRotateAnimation = valor;
  }

  setModelAnimation(valor) {
    this.modelOwnAnimation = valor;
  }

  setCameraAspect(ratio) {
    this.camera.aspect = ratio;
    this.camera.updateProjectionMatrix();
  }

  // Getters

  getCamera() {
    return this.camera;
  }

  // Other methods

  fillModelList() {
    const classes = [
      Aceite,
      Cactus,
      Escudo,
      Jugador,
      LlaveInglesa,
      MapaTubo,
      NaveEnemiga,
      Queroseno,
      Roca,
    ];

    const transformations = {
      Aceite: {
        position: [0, 0.02, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(2),
      },
      Cactus: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(1.5),
      },
      Escudo: {
        position: [0, 0.5, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(0.5),
      },
      Jugador: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(1),
      },
      LlaveInglesa: {
        position: [0, -0.5, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(0.2),
      },
      MapaTubo: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(0.05),
      },
      NaveEnemiga: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(1),
      },
      Queroseno: {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(0.6),
      },
      Roca: {
        position: [0, 0.6, 0],
        rotation: [0, 0, 0],
        scale: new Array(3).fill(1),
      },
    };

    return classes.map(cls => {
      const c = new cls();
      const transform = transformations[cls.name];

      if (transform) {
        for (const key in transform) {
          if (transform.hasOwnProperty(key) && c[key]) {
            c[key].set(...transform[key]);
          }
        }
      }

      return c;
    });
  }

  onWindowResize() {
    this.setCameraAspect(window.innerWidth / window.innerHeight);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    this.renderer.render(this, this.getCamera());

    this.cameraControl.update();

    if (this.modelRotateAnimation) {
      this.model.rotateY(Math.PI / 512);
    }

    if (this.modelOwnAnimation) {
      this.model.update();
    }

    requestAnimationFrame(() => this.update())
  }
}


$(function() {
  const scene = new MyScene('#WebGL-output');

  window.addEventListener('resize', () => scene.onWindowResize());

  scene.update();

  // Background texture for visualizer
  const pmremGenerator = new THREE.PMREMGenerator(scene.renderer);

  const loader = new RGBELoader();
  // Lower resolution images will load faster, acting as a "placeholder"
  loader.load('../imgs/desert_1k.hdr', (texture) => {
    scene.background = pmremGenerator.fromEquirectangular(texture).texture;
  });

  loader.load('../imgs/desert_4k.hdr', (texture) => {
    const t = pmremGenerator.fromEquirectangular(texture).texture;
    scene.background = t;
    scene.environment = t;
  });

  pmremGenerator.compileEquirectangularShader();
});
