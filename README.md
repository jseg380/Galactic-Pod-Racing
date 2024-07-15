# Galactic Pod Racing

## Table of Contents

- Description of the Game
- Main Character
- Obstacles
- Bonuses
- Enemy Flying Object
- Articulated Object
- Application Design
- Hierarchical Models
  - Player's Ship
  - Enemy Ship
  - Oil Slick
  - Kerosene
  - Cactus
  - Wrench
- Important Algorithms
  - placeObject(object, position, offSet=0.0)
  - checkCollisions()
- User Manual
- References

## Description of the Game
Galactic Pod Racing is a game inspired by the pod races from Star Wars Episode I: The Phantom Menace. Players control a pod to race on the planet Tatooine, aiming to beat their own times and survive through various challenges.

## Main Character
The player controls Anakin Skywalker's pod, navigating through the track, avoiding obstacles, collecting bonuses, and shooting enemies, with the speed gradually increasing for added difficulty.

## Obstacles
- **Rock:** Causes damage on collision.
- **Cactus:** Breaks on collision but causes damage.
- **Oil Slick:** Blurs the player's vision temporarily.

## Bonuses
- **Kerosene:** Temporarily increases the ship's speed.
- **Shield:** Grants temporary invincibility.
- **Wrench:** Restores part of the ship's health.

## Enemy Flying Object
Players can shoot TIE enemy ships to gain bonuses. Shooting these ships grants extra lives to repair the player's ship.

## Articulated Object
The player's ship features multiple moving parts:
- **Body:** Adjusts height for a levitation effect.
- **Propulsor:** Adjusts height for a levitation effect.
- **Propulsor Fin:** Opens and closes like in the movie.
- **Propulsor Fire:** Changes size.
- **Connector Cable:** Moves to stay connected to the propulsor.

## Application Design
This web application consists of HTML served to the client, along with scripts for the scene, models, and required libraries.

## Hierarchical Models

### Player's Ship
- Composed of multiple meshes including flame, upper part, fin, propulsor body, connector, main body, and glass sphere.

### Enemy Ship
- Composed of meshes including cabin, visor, wing, and arm.

### Oil Slick
- Formed by torus, cylinders, and an extruded stain.

### Kerosene
- Composed of a tube and an extruded bottle.

### Cactus
- Made up of a cylinder, spheres, and a tube.

### Wrench
- Formed by a simple extruded shape.

## Important Algorithms

### placeObject(object, position, offSet=0.0)
Places a 3D object along a spline-defined track, adjusting position and orientation based on the spline, with optional offset and rotation.

### checkCollisions()
Efficiently detects collisions by dividing the map into sections and checking only the obstacles in the current section. Updates the player's bounding box and applies effects if collisions are detected.

## User Manual
To launch the game:
1. Start the server with `python -m http.server`.
2. Open in the browser:
   - To play: `http://localhost:8000/main/`
   - To view models: `http://localhost:8000/visualizer/`

### Controls
- **'A' Key:** Turn left.
- **'D' Key:** Turn right.
- **'C' Key:** Switch between third-person and free camera.
- **Spacebar:** Stop the player.
- **Left Mouse Click:** Shoot enemies/rotate in free view.
- **Right Mouse Click:** Move aim point in free view.
- **Mouse Wheel:** Zoom in/out in free view.

### Obstacles and Objects
- **Shield:** Temporary invincibility.
- **Wrench:** Restores health.
- **Kerosene:** Boosts speed.
- **Enemy Ships:** Shooting grants extra lives.
- **Cactus:** Causes damage but disappears.
- **Rock:** Causes damage.
- **Oil Slick:** Causes temporary vision blur.

The goal is to survive as long as possible, with increasing speed and diminishing bonuses.

## References

### Models
- Rock Model: [Free3D](https://free3d.com/3d-model/free-low-poly-rock-model-pack-131559.html)

### Textures
- Ground: [AmbientCG Ground054](https://ambientcg.com/view?id=Ground054)
- Metal: [AmbientCG Metal024](https://ambientcg.com/view?id=Metal024)
- Desert: [PolyHaven Desert_Xk](https://polyhaven.com/a/goegap)
