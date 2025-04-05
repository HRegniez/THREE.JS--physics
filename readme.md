# Three.js Physics Playground 🎮

An interactive 3D physics simulation built with Three.js and Cannon.js, demonstrating realistic physics behaviors in a web browser environment.

## 🌟 Features

- **Real-time Physics Simulation**: Powered by Cannon.js physics engine
- **Interactive Objects**: 
  - Spheres and boxes with realistic physics properties
  - Dynamic object creation through user interface
  - Collision detection and response
- **Environmental Effects**:
  - Realistic gravity simulation
  - Material properties (friction and restitution)
  - Environmental mapping for realistic reflections
- **Audio Feedback**: Dynamic collision sounds based on impact strength
- **Debug Controls**: GUI interface for creating and managing physics objects

## 🔧 Technical Implementation

### Physics Engine
- Uses `cannon-es` for physics calculations
- Implements a world with gravity (9.82 m/s²)
- Features advanced broadphase collision detection (SAP)
- Supports object sleep states for performance optimization

### Materials and Interactions
- Custom material properties:
  - Concrete (static ground plane)
  - Plastic (dynamic objects)
- Configurable contact materials with:
  - Friction coefficient: 0.1
  - Restitution (bounciness): 0.7

### Visual Rendering
- Three.js for 3D graphics rendering
- PerspectiveCamera with orbital controls
- Dynamic shadow mapping
- Environment mapping for realistic material appearance
- Responsive window resizing

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your system
```

## 🎮 Controls

- **Orbit Controls**: Click and drag to rotate the camera
- **GUI Interface**:
  - Create Sphere: Adds a sphere with random size and position
  - Create Box: Adds a box with random dimensions and position
  - Reset: Removes all dynamic objects from the scene

## 🛠️ Technologies Used

- Three.js v0.174.0
- Cannon-es v0.15.1
- lil-gui v0.20.0
- Vite (for development and building)

