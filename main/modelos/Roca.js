import * as THREE from 'three'
import { OBJLoader } from '../../libs/OBJLoader.js'


class Roca extends THREE.Object3D {
  constructor() {
    super();

    // Material {

    const material = new THREE.MeshStandardMaterial({ color: 0xadadad });

    // }


    // Cargar modelo 3D {

    new OBJLoader().load(
      '../../models/rocas/Rock1.obj',
      (object) => {
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = material;
          }
        });
        this.add(object.children[0]);
      },
      null,
      null
    );

    const boxMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshBasicMaterial({color: 0x000000})
    );
    boxMesh.visible = false;

    this.add(boxMesh);

    // }
  }

  update() {}
}


export { Roca }
