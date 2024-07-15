import * as THREE from 'three'
import { loadTexture } from '../../utils/loadTexture.js'


class LlaveInglesa extends THREE.Object3D {
  constructor() {
    super();

    // Material {

    const textureMaps = loadTexture('Metal024', ['aoMap'], [1, 1]);
    textureMaps['displacementScale'] = 0;
    const material = new THREE.MeshStandardMaterial(textureMaps);

    // }


    // Geometría {

    const shape = new THREE.Shape();
    shape.moveTo(0, 4);
    shape.lineTo(2, 4);
    shape.quadraticCurveTo(2.2, 4.8, 3.2, 3.9);
    shape.lineTo(3.2, 3.85);
    shape.lineTo(2.5, 3.8);

    shape.lineTo(2.5, 3.2);
    shape.lineTo(3.2, 3.15);
    shape.lineTo(3.2, 3.1);
    shape.quadraticCurveTo(2.2, 2.2, 2, 3);
    shape.lineTo(0, 3);

    const rightGeometry = new THREE.ExtrudeGeometry(shape, {
      depth: 0.05,
      steps: 4,
      curveSegments: 7,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelThickness: 0.2
    });

    // }


    // Mesh {

    const rightWrench = new THREE.Mesh(rightGeometry, material);
    const leftWrench = rightWrench.clone();
    leftWrench.scale.x = -1;

    // }


    // Transformaciones {

    this.translateY(0.5);
    this.translateZ(0.4);
    this.translateX(0.5);
    this.rotateZ(Math.PI / 4);
    this.rotateX(-Math.PI / 6);

    // }


    this.add(rightWrench);
    this.add(leftWrench);
  }

  update() {}
}


export { LlaveInglesa }
