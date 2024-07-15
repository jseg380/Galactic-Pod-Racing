import * as THREE from 'three'
import { LatheGeometry } from '../../libs/three.module.js';


class Propulsor extends THREE.Object3D {
  constructor(desfase = 1) {
    super();

    this.pasoAnimacion = desfase;
    this.velocidadAnimacion = 0.03;
    var shape = new THREE.Shape();
    shape.moveTo(0.1, 0);
    shape.lineTo(0.1, 0.8);
    shape.quadraticCurveTo(0.1, 0.9, 0, 0.9);
    shape.quadraticCurveTo(-0.1, 0.9, -0.1, 0.8);
    shape.lineTo(-0.1, 0);
    shape.lineTo(0.1, 0);

    var options = {
      depth: 0.02,
      steps: 1,
      bevelEnabled: false
    };

    this.geomAleta = new THREE.ExtrudeGeometry(shape, options);
    this.geomAleta.rotateX(Math.PI / 2);
    //this.geomAleta.translate(0,-0.19,0.8);
    //this.geomAleta.rotateZ(Math.PI*2/3);
    //Material metalico amarillo
    var matAmarillo = new THREE.MeshPhongMaterial({ color: 0xffff00, specular: 0xffff00, shininess: 100 });
    this.aletaMovil1 = new THREE.Mesh(this.geomAleta, matAmarillo);

    this.aleta1 = new THREE.Object3D();
    this.aleta1.add(this.aletaMovil1);
    this.aleta1.position.set(0, -0.18, 0.8);
    this.add(this.aleta1);

    this.aletaMovil2 = new THREE.Mesh(this.geomAleta, matAmarillo);
    this.aleta2 = new THREE.Object3D();
    this.aleta2.add(this.aletaMovil2);
    this.aleta2.position.set(0.15, 0.1, 0.8);
    this.aleta2.rotation.z = Math.PI * 2 / 3;
    this.add(this.aleta2);

    this.aletaMovil3 = new THREE.Mesh(this.geomAleta, matAmarillo);
    this.aleta3 = new THREE.Object3D();
    this.aleta3.add(this.aletaMovil3);
    this.aleta3.position.set(-0.15, 0.1, 0.8);
    this.aleta3.rotation.z = -Math.PI * 2 / 3;
    this.add(this.aleta3);

    shape = new THREE.Shape();
    shape.moveTo(0.001, 0);
    shape.lineTo(0.08, 0);
    shape.lineTo(0.2, 0.1);
    shape.quadraticCurveTo(0.15, 0.1, 0.15, 0.15);
    shape.lineTo(0.15, 0.8);
    shape.lineTo(0.18, 0.8);
    shape.lineTo(0.18, 1);
    shape.lineTo(0.15, 1);
    shape.lineTo(0.15, 1.1);
    shape.lineTo(0.12, 1.1);
    shape.lineTo(0.12, 1.26);
    shape.lineTo(0.001, 1.26);

    var geom = new LatheGeometry(shape.getPoints(), 20);
    geom.rotateX(Math.PI / 2);
    //Material metalico gris
    var matMetalico = new THREE.MeshPhongMaterial({ color: 0x888888, specular: 0x888888, shininess: 100 });
    var cilindro = new THREE.Mesh(geom, matMetalico);

    this.add(cilindro);

    shape = new THREE.Shape();
    shape.moveTo(0.001, 0);
    shape.bezierCurveTo(0.08, 0.15, 0.08, 0.15, 0.08, 0.2);
    shape.lineTo(0.001, 0.2);

    var geom = new LatheGeometry(shape.getPoints(), 20);
    geom.rotateX(Math.PI / 2);
    geom.translate(0, 0, -0.2);
    //Material llama de fuego azul
    var matLlama = new THREE.MeshPhongMaterial({ color: 0x0000ff, specular: 0x0000ff, shininess: 100 });
    this.llama = new THREE.Mesh(geom, matLlama);

    this.add(this.llama);

    shape = new THREE.Shape();
    shape.moveTo(0.001, 0);
    shape.lineTo(0.16, 0);
    shape.lineTo(0.16, 0.15);
    shape.lineTo(0.06, 0.15);
    shape.lineTo(0.06, 0.25);
    shape.quadraticCurveTo(0.06, 0.31, 0.001, 0.31);

    var geom = new LatheGeometry(shape.getPoints(), 20);
    geom.rotateX(Math.PI / 2);
    geom.translate(0, 0, 1.1);

    var parteSuperior = new THREE.Mesh(geom, matAmarillo);
    this.add(parteSuperior);
  }

  update() {
    this.pasoAnimacion += 1;
    var angulo = Math.sin(this.pasoAnimacion * this.velocidadAnimacion) * Math.PI / 50 + Math.PI / 30;// + Math.PI/4;
    this.giroAleta(angulo);
    var escala = Math.sin(this.pasoAnimacion * this.velocidadAnimacion * 3.5) * 0.1 + 1;
    this.escalaLlama(escala);
  }

  giroAleta(angulo) {
    this.aletaMovil1.rotation.x = angulo;
    this.aletaMovil2.rotation.x = angulo;
    this.aletaMovil3.rotation.x = angulo;
  }

  escalaLlama(escala) {
    this.llama.scale.set(1, 1, escala);
  }
}


export { Propulsor }
