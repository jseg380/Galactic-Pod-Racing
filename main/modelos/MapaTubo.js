import * as THREE from 'three'
import { getPathFromTorusKnot } from '../../utils/getPathFromTorusKnot.js'
import { loadTexture } from '../../utils/loadTexture.js'


class MapaTubo extends THREE.Object3D {
  constructor() {
    super();

    // Material {

    const repeatValues = { 'S': 70, 'T': 3 };
    const textureMaps = loadTexture('Ground054', ['Metalness'], repeatValues);
    textureMaps['displacementScale'] = 0;

    const material = new THREE.MeshStandardMaterial(textureMaps);
    // const material = new THREE.MeshNormalMaterial();

    // }


    // Geometría {

    this.params = {
      radius: 40,
      tube: 5,
      tubularSegments: 200,
      radialSegments: 20,
      p: 3,
      q: 4,
    };
    const torusKnot = new THREE.TorusKnotGeometry(...Object.values(this.params));

    this.spline = getPathFromTorusKnot(torusKnot);
    const points = this.spline.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const map = new THREE.Line(geometry, material);

    // }


    // Mesh {

    const torusKnotMesh = new THREE.Mesh(torusKnot, material);

    // }


    this.add(map);
    this.add(torusKnotMesh);
  }

  getWidth() {
    return this.params.tube;
  }

  update() {}
}


export { MapaTubo }
