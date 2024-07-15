import * as THREE from 'three'
import { CSG } from '../../libs/CSG-v2.js'
import { Propulsor } from './Propulsor.js'
import { Escudo } from './Escudo.js'


class Jugador extends THREE.Object3D {
  constructor() {
    super();
    this.pasoAnimacion = 1;
    this.velocidadAnimacion = 0.01;

    // Material azul metalico
    var matAzul = new THREE.MeshPhongMaterial({ color: 0x0000ff, specular: 0x0000ff, shininess: 100 });

    this.propulsor1 = new Propulsor();
    this.propulsor1.position.set(0.5, 0, 1);
    this.add(this.propulsor1);

    this.propulsor2 = new Propulsor(30);
    this.propulsor2.position.set(-0.5, 0, 1);
    this.add(this.propulsor2);

    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.1, 0);
    shape.quadraticCurveTo(0.35, 0, 0.35, 0.15);
    shape.quadraticCurveTo(0.35, 0.25, 0.6, 0.35);
    shape.bezierCurveTo(0.65, 0.37, 0.63, 0.45, 0.57, 0.42);
    shape.quadraticCurveTo(0.3, 0.3, 0.0, 0.3)
    shape.quadraticCurveTo(-0.3, 0.3, -0.57, 0.42);
    shape.bezierCurveTo(-0.63, 0.45, -0.65, 0.37, -0.6, 0.35);
    shape.quadraticCurveTo(-0.35, 0.25, -0.35, 0.15);
    shape.quadraticCurveTo(-0.35, 0, -0.1, 0);
    shape.lineTo(0, 0);

    var options = {
      depth: 1.2,
      steps: 1,
      bevelEnabled: false
    };

    var geomCuerpo = new THREE.ExtrudeGeometry(shape, options);
    geomCuerpo.translate(0, 0, -0.6);
    var cuerpo = new THREE.Mesh(geomCuerpo, matAzul);

    var shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.2, 0);
    shape.quadraticCurveTo(0.63, 0, 0.63, 0.2);
    shape.bezierCurveTo(0.63, 0.5, 0.2, 0.8, 0.2, 1);
    shape.quadraticCurveTo(0.2, 1.2, 0, 1.2);
    shape.quadraticCurveTo(-0.2, 1.2, -0.2, 1);
    shape.bezierCurveTo(-0.2, 0.8, -0.63, 0.5, -0.63, 0.2);
    shape.quadraticCurveTo(-0.63, 0, -0.2, 0);
    shape.lineTo(0, 0);

    var options = {
      depth: 0.43,
      steps: 1,
      bevelEnabled: false
    };

    var geomIntersect = new THREE.ExtrudeGeometry(shape, options);
    geomIntersect.rotateX(-Math.PI / 2);
    geomIntersect.translate(0, 0, 0.6);

    var intersect = new THREE.Mesh(geomIntersect, matAzul);

    var csg = new CSG();
    csg.union([cuerpo]);
    csg.intersect([intersect]);
    this.cabina = csg.toMesh();

    // Creamos una esfera para la cabina
    var esfera = new THREE.SphereGeometry(0.2, 32, 32);
    esfera.scale(1, 1, 1.5);
    esfera.translate(0, 0.3, 0.1);
    // Creamos material semitransparente gris
    var matGris = new THREE.MeshPhongMaterial({ color: 0x888888, specular: 0x888888, shininess: 100, transparent: true, opacity: 0.8 });
    var cristal = new THREE.Mesh(esfera, matGris);

    this.cabina.add(cristal);
    this.cabina.translateZ(-0.6);
    this.add(this.cabina);

    // Creamos un cable
    var pts = [];
    // Añadir puntos en forma de Radio muy grande para solo hacer 1/40 de vuelta
    for (var i = 0; i < 10; i++) {
      pts.push(new THREE.Vector3(0, -Math.cos(i * Math.PI / 100) * 5, -Math.sin(i * Math.PI / 100) * 5));
    }

    var path = new THREE.CatmullRomCurve3(pts);

    var tuboGeometria1 = new THREE.TubeGeometry(path, 40, 0.01, 8, false);
    tuboGeometria1.translate(0, 5, 0);
    // Material negro
    var materialCable = new THREE.MeshPhongMaterial({ color: 0x000000 });
    this.cable1 = new THREE.Mesh(
      tuboGeometria1,
      materialCable
    );
    this.cable1.position.set(-0.1, 0, 0.05);
    this.cable1.rotation.y = Math.PI / 14;
    this.propulsor1.add(this.cable1);


    var tuboGeometria2 = new THREE.TubeGeometry(path, 40, 0.01, 8, false);
    tuboGeometria2.translate(0, 5, 0);

    this.cable2 = new THREE.Mesh(
      tuboGeometria2,
      materialCable
    );
    this.cable2.position.set(0.1, 0, 0.05);
    this.cable2.rotation.y = -Math.PI / 14;
    this.propulsor2.add(this.cable2);
    this.escudo = new Escudo();
    this.escudo.scale.setScalar(2.3);
    this.escudo.position.y = -2.5;
    this.escudo.position.z = 0.6;
    this.escudo.visible = false;
    this.add(this.escudo);
  }

  update() {
    this.propulsor1.update();
    this.propulsor2.update();
    var altura = Math.sin(this.pasoAnimacion * this.velocidadAnimacion * 3.5) * 0.1;
    this.elevarPropulsor1(altura);
    altura = Math.sin((this.pasoAnimacion + 20) * this.velocidadAnimacion * 3.5) * 0.1;
    this.elevarPropulsor2(altura);
    altura = Math.sin((this.pasoAnimacion + 65) * this.velocidadAnimacion * 3.5) * 0.07;
    this.elevarCabina(altura);
    this.pasoAnimacion++;
  }

  elevarPropulsor1(altura) {
    this.propulsor1.position.y = altura;
    this.cable1.rotateX((-altura / 0.1) * (Math.PI / 1600));
  }

  elevarPropulsor2(altura) {
    this.propulsor2.position.y = altura;
    this.cable2.rotateX((-altura / 0.1) * (Math.PI / 1600));
  }

  elevarCabina(altura) {
    this.cabina.position.y = altura;
  }
}


export { Jugador }
