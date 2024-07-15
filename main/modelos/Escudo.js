import * as THREE from 'three'


class Escudo extends THREE.Object3D {
  constructor() {
    super();

    const tam = 1;
    const resolucion = 4;

    // Material {

    const esferaMaterial = new THREE.MeshPhysicalMaterial({
      transparent: true,
      opacity: 0.6,
      color: 0x0461E2,
      emissive: 0x290E00,
      roughness: 0.443,
      metalness: 0.075,
      ior: 2.333,
      reflectivity: 0.5,
      iridescence: 1.0,
      iridescenceIOR: 1.0,
      sheen: 0.6,
      sheenRoughness: 0.6,
      sheenColor: 0x993D00,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      specularIntensity: 1.0,
      specularColor: 0xB34700,
    });

    const esferaLineasMaterial = new THREE.MeshStandardMaterial({
      color: 0x000000,
      wireframe: true,
      wireframeLinewidth: 2,
      transparent: true,
      opacity: 0.4,
      precision: 'highp',
    });

    // }


    // Geometría {

    const esferaGeometry = new THREE.IcosahedronGeometry(tam, resolucion);
    const esferaLineasGeometry = new THREE.IcosahedronGeometry(tam + tam / 500, resolucion);

    // }


    // Mesh {

    const esferaMesh = new THREE.Mesh(esferaGeometry, esferaMaterial);

    const esferaLineasMesh = new THREE.Mesh(esferaLineasGeometry, esferaLineasMaterial);
    esferaMesh.position.y = esferaLineasMesh.position.y = tam * 1.25;

    // }

    this.add(esferaMesh);
    this.add(esferaLineasMesh);
  }

  update() {}
}


export { Escudo }
