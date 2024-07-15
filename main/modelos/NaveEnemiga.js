import * as THREE from 'three'
import { CSG } from '../../libs/CSG-v2.js'


class NaveEnemiga extends THREE.Object3D {
  constructor() {
    super();

    // Material {

    const material = new THREE.MeshPhongMaterial({
      color: 0x888888,
      specular: 0x888888,
      shininess: 100
    });

    const materialLinea = new THREE.LineBasicMaterial({
      color: 0x000000,
      linewidth: 10
    });

    // }


    // Geometría {

    const shape = new THREE.Shape();
    shape.moveTo(-0.1, 0);
    shape.lineTo(0, 0);
    shape.lineTo(0.2, 0.5);
    shape.lineTo(0.2, 1);
    shape.lineTo(0, 1.5);
    shape.lineTo(-0.1, 1.5);
    shape.lineTo(0.1, 1);
    shape.lineTo(0.1, 0.5);
    shape.lineTo(-0.1, 0);

    const options = {
      depth: 1,
      steps: 1,
      bevelEnabled: false
    };

    const geom = new THREE.ExtrudeGeometry(shape, options);
    geom.translate(0.7, -0.75, -0.5);


    const shape2 = new THREE.Shape();
    shape2.moveTo(0, -0.1);
    shape2.lineTo(0.25, -0.1);
    shape2.lineTo(0.5, 0.5);
    shape2.lineTo(0.5, 1);
    shape2.lineTo(0.25, 1.51);
    shape2.lineTo(-0.25, 1.51);
    shape2.lineTo(-0.5, 1);
    shape2.lineTo(-0.5, 0.5);
    shape2.lineTo(-0.25, -0.1);
    shape2.lineTo(0, -0.1);

    const geom2 = new THREE.ExtrudeGeometry(shape2, options);
    geom2.rotateY(Math.PI / 2);
    geom2.translate(0.7, -0.75, 0);


    // }


    // Mesh {



    // }

    let ala = new THREE.Mesh(geom, material);

    // Material transparente
    const intersectMesh = new THREE.Mesh(
      geom2,
      material
    );

    const csgAla = new CSG();
    csgAla.union([ala]);
    csgAla.intersect([intersectMesh]);
    ala = csgAla.toMesh();

    const lineAla = new THREE.LineSegments(
      new THREE.EdgesGeometry(ala.geometry),
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 10 })
    );

    const ala2 = ala.clone();
    const lineAla2 = lineAla.clone();
    lineAla2.rotateY(Math.PI);
    ala2.rotation.y = Math.PI;

    const cilindro = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.3, 0.8, 6),
      material
    );
    const lineCilindro = new THREE.LineSegments(
      new THREE.EdgesGeometry(cilindro.geometry),
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 })
    );
    lineCilindro.translateX(0.4);
    lineCilindro.rotateZ(-Math.PI / 2);
    cilindro.translateX(0.4);
    cilindro.rotateZ(-Math.PI / 2);

    const cilindro2 = cilindro.clone();
    const lineCilindro2 = lineCilindro.clone();
    lineCilindro2.rotateZ(Math.PI / 2);
    lineCilindro2.translateX(-0.8);
    lineCilindro2.rotateZ(Math.PI / 2);
    cilindro2.rotateZ(Math.PI / 2);
    cilindro2.translateX(-0.8);
    cilindro2.rotateZ(Math.PI / 2);

    const esfera = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 10, 11),
      material
    );
    const lineEsfera = new THREE.LineSegments(
      new THREE.EdgesGeometry(esfera.geometry),
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 })
    );
    esfera.rotateX(Math.PI / 2);
    lineEsfera.rotateX(Math.PI / 2);

    // Añadir un toro en frente de la nave
    const toro = new THREE.Mesh(
      new THREE.TorusGeometry(0.25, 0.02, 4, 20),
      material
    );
    const lineToro = new THREE.LineSegments(
      new THREE.EdgesGeometry(toro.geometry),
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 5 })
    );
    toro.translateZ(0.42);
    lineToro.translateZ(0.42);

    this.add(lineCilindro);
    this.add(cilindro);
    this.add(lineCilindro2);
    this.add(cilindro2);
    this.add(lineEsfera);
    this.add(esfera);
    this.add(lineToro);
    this.add(toro);
    this.add(lineAla);
    this.add(ala);
    this.add(lineAla2);
    this.add(ala2);
  }

  update() {}
}


export { NaveEnemiga }
