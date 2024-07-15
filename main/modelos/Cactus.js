import * as THREE from 'three'
import { loadSimpleTexture } from '../../utils/loadTexture.js'


class Cactus extends THREE.Object3D {
  constructor() {
    super();

    // Material {

    const textureMap = loadSimpleTexture('cactus.png');
    const material = new THREE.MeshStandardMaterial(textureMap);
    // const material = new THREE.MeshNormalMaterial();

    // }


    // Geometría {
  
    const baseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const topGeometry = new THREE.SphereGeometry(0.1, 8, 8);

    // Brazo
    const esferaBrazoGeometry = new THREE.SphereGeometry(0.08, 8, 8);

    let pts = [];
    for (let i = 0; i < 20; i++) {
      pts.push(new THREE.Vector3(Math.cos((Math.PI * 3) / 2 + ((Math.PI / 4) / 10) * i) * 0.3, 0.8 + Math.sin((Math.PI * 3) / 2 + ((Math.PI / 4) / 10) * i) * 0.3, 0));
    }
    pts.push(new THREE.Vector3(0.3, 0.8, 0));

    const tuboPath = new THREE.CatmullRomCurve3(pts);
    const tuboGeometry = new THREE.TubeGeometry(tuboPath, 40, 0.08, 8, false);

    // }


    // Mesh {

    const baseMesh = new THREE.Mesh(baseGeometry, material);
    baseMesh.position.y = 0.5;

    const topMesh = new THREE.Mesh(topGeometry, material);
    topMesh.position.y = 1;

    const tronco = new THREE.Object3D();
    tronco.add(baseMesh);
    tronco.add(topMesh);

    const tuboMesh = new THREE.Mesh(tuboGeometry, material);

    const esferaBrazoMesh = new THREE.Mesh(esferaBrazoGeometry, material);
    esferaBrazoMesh.position.x = 0.3;
    esferaBrazoMesh.position.y = 0.8;

    const brazo = new THREE.Object3D();
    brazo.add(tuboMesh);
    brazo.add(esferaBrazoMesh);

    const brazo2 = brazo.clone();
    brazo2.rotation.y = Math.PI;
    brazo2.translateY(-0.2);

    // }


    this.add(tronco);
    this.add(brazo);
    this.add(brazo2);
  }

  update() {}
}


export { Cactus }
