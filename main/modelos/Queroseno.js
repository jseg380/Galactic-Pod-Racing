import * as THREE from 'three'


class Queroseno extends THREE.Object3D {
  constructor() {
    super();

    // Material {

    const tuboMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000
    });

    const botellaMaterial = new THREE.MeshStandardMaterial({
      color: 0xff0000
    });

    // }


    // Geometría {

    // Crear la shape
    const botellaShape = new THREE.Shape();
    botellaShape.moveTo(0, 0);
    botellaShape.lineTo(0.25, 0);
    botellaShape.quadraticCurveTo(0.35, 0, 0.35, 0.1);
    botellaShape.lineTo(0.35, 0.7);
    botellaShape.quadraticCurveTo(0.35, 0.8, 0.25, 0.8);
    botellaShape.lineTo(-0.1, 0.8);
    botellaShape.lineTo(-0.35, 0.55);
    botellaShape.lineTo(-0.35, 0.1);
    botellaShape.quadraticCurveTo(-0.35, 0, -0.25, 0);
    botellaShape.lineTo(0, 0);

    const botellaGeometry = new THREE.ExtrudeGeometry(botellaShape, {
      depth: 0.2,
      steps: 2,
      bevelEnabled: true,
      bevelSize: 0.1,
      bevelThickness: 0.1
    });


    const tuboPath = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, 0.8, 0),
      new THREE.Vector3(-0.3, 1, 0),
      new THREE.Vector3(-0.45, 1.05, 0),
    ]);

    const tuboGeometry = new THREE.TubeGeometry(tuboPath, 40, 0.04, 8, false);

    // }


    // Mesh {

    const botellaMesh = new THREE.Mesh(botellaGeometry, botellaMaterial);
    botellaMesh.position.y = 0.1;
    botellaMesh.position.z = -0.1;

    const tuboMesh = new THREE.Mesh(tuboGeometry, tuboMaterial);
    tuboMesh.position.x = -0.1;

    // }


    this.add(botellaMesh);
    this.add(tuboMesh);
  }

  update() {}
}


export { Queroseno }
