import * as THREE from 'three'
import { CSG } from '../../libs/CSG-v2.js'


class Aceite extends THREE.Object3D {
  // Material 
  static bidonMaterial = new THREE.MeshStandardMaterial({
    color: 0x009900,
    roughness: 0.4,
    metalness: 0.7
  });

  // Geometría
  static bidonGeometry = null;


  constructor() {
    super();

    // Material {

    const manchaMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.3,
      metalness: 0.7
    });

    // }


    // Geometría {

    // Forma de la mancha de aceite
    const manchaShape = new THREE.Shape();
    manchaShape.moveTo(0, 0);                                     //0
    manchaShape.bezierCurveTo(0.05, 0, 0.05, 0.1, 0.1, 0.1);      //1
    manchaShape.quadraticCurveTo(0.25, 0.1, 0.25, 0.2);           //2
    manchaShape.bezierCurveTo(0.25, 0.25, 0.2, 0.25, 0.2, 0.3);   //3
    manchaShape.bezierCurveTo(0.2, 0.35, 0.3, 0.25, 0.3, 0.4);    //4
    manchaShape.bezierCurveTo(0.3, 0.45, 0.25, 0.4, 0.2, 0.4);    //5
    manchaShape.quadraticCurveTo(0.1, 0.4, 0.1, 0.5);             //6
    manchaShape.quadraticCurveTo(0.1, 0.6, 0, 0.6);               //7
    manchaShape.quadraticCurveTo(-0.1, 0.6, -0.1, 0.5);           //8
    manchaShape.quadraticCurveTo(-0.1, 0.4, -0.3, 0.4);           //9
    manchaShape.bezierCurveTo(-0.4, 0.4, -0.4, 0.3, -0.3, 0.3);   //10
    manchaShape.quadraticCurveTo(-0.15, 0.3, -0.15, 0.2);         //11
    manchaShape.quadraticCurveTo(-0.15, 0, 0, 0);                 //12

    const manchaGeometry = new THREE.ExtrudeGeometry(manchaShape, {
      depth: 0,
      steps: 1,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 10
    });
    
    if (Aceite.bidonGeometry === null) {
      Aceite.createBidonGeometry();
    }

    // }


    // Mesh {

    // Mancha de aceite a partir de extrusión
    const manchaMesh = new THREE.Mesh(manchaGeometry, manchaMaterial);

    manchaMesh.rotation.x = Math.PI / 2;
    manchaMesh.position.z = -0.3;

    const bidonMesh = new THREE.Mesh(Aceite.bidonGeometry, Aceite.bidonMaterial);

    bidonMesh.position.set(0.15, 0.1, -0.15);
    bidonMesh.rotation.x = Math.PI / 2;
    bidonMesh.rotation.z = Math.PI / 4;
    // }


    this.add(manchaMesh);
    this.add(bidonMesh);
  }

  static createBidonGeometry() {
    // Cilindro grande
    const cilGrandeGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 15);

    // Cilindro pequeño
    const cilPequenoGeometry = new THREE.CylinderGeometry(0.095, 0.095, 0.29, 15);
    cilPequenoGeometry.translate(0, 0.01, 0);

    // Toro que rodea el cilindro
    const toroGeometry = new THREE.TorusGeometry(0.1, 0.005, 6, 15);
    toroGeometry.rotateX(Math.PI / 2);

    // Bidón
    const cilGrandeMesh = new THREE.Mesh(cilGrandeGeometry, Aceite.bidonMaterial);
    const cilPequenoMesh = new THREE.Mesh(cilPequenoGeometry, Aceite.bidonMaterial);
    const toroMesh = new THREE.Mesh(toroGeometry, Aceite.bidonMaterial);

    const csg = new CSG();
    csg.union([cilGrandeMesh, toroMesh]);
    toroMesh.position.y = -0.15;
    csg.union([toroMesh]);
    toroMesh.position.y = 0.15;
    csg.union([toroMesh]);
    csg.subtract([cilPequenoMesh]);

    const bidonMesh = csg.toMesh();
    Aceite.bidonGeometry = bidonMesh.geometry;
  }

  update() {}
}


export { Aceite }
