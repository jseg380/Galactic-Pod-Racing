import { TextureLoader, RepeatWrapping } from 'three'


const textureLoader = new TextureLoader();

const mappingNames = {
  map: 'Color',
  aoMap: 'AmbientOcclusion',
  displacementMap: 'Displacement',
  metalnessMap: 'Metalness',
  normalMap: 'NormalGL',
  roughnessMap: 'Roughness',
};


function getCachedTexture(textureName) {
  let cachedTexture = localStorage.getItem(textureName);

  // It was not present in the cache, store it
  if (cachedTexture === null) {

  }
  else {
    cachedTexture = JSON.parse(cachedTexture);
  }

  return cachedTexture;
}


function loadSimpleTexture(textureName) {
  // TODO: Make the cache usable and useful, if needed
  // return { map: getCachedTexture(textureName) };
  const file = `../imgs/${textureName}`;
  return { map: textureLoader.load(file) };
}


function loadTexture(textureName, exclude = [], repeatValues = null) {
  let textureMaps = {};

  // Exclude maps of the texture
  exclude.forEach(excludedMap => {
    if (excludedMap.toLowerCase().endsWith('map'))
      delete mappingNames[excludedMap];
    else {
      const key = Object.keys(mappingNames).find(key => {
        return mappingNames[key] === excludedMap;
      });
      if (key !== undefined)
        delete mappingNames[key];
    }
  });

  // Filling the textureMaps dictionary with corresponding key : value pairs
  Object.entries(mappingNames).forEach(([mapName, fileName]) => {
    const file = `../imgs/${textureName}/${textureName}_${fileName}.jpg`;
    textureMaps[mapName] = textureLoader.load(file);
  });

  // Repeat the texture
  if (repeatValues !== null) {
    Object.keys(textureMaps).forEach(key => {
      // Enable wrapping for all the maps in use of the texture
      const tMap = textureMaps[key];
      tMap.wrapS = tMap.wrapT = RepeatWrapping;

      // Accept both dictionarys with keys 'S' and 'T' and arrays
      if (!Array.isArray(repeatValues))
        tMap.repeat.set(...Object.values(repeatValues));
      else
        tMap.repeat.set(...repeatValues);
    });
  }

  return textureMaps;
}


export { loadSimpleTexture, loadTexture }
