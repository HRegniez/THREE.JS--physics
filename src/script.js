import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import * as CANNON from 'cannon-es'


/**
 * Debug
 */
const gui = new GUI()
const debugObject = {}

debugObject.createSphere = () => {
    createSphere(
        Math.random() * 0.5 + 0.1,
        { 
            x: (Math.random() -0.5) * 3,
            y: 3, 
            z: (Math.random() -0.5) * 3
        })
}
debugObject.createBox = () => {
    createBox(
        Math.random() * 0.5 + 0.1,
        Math.random() * 0.5 + 0.1,
        Math.random() * 0.5 + 0.1,
        { 
            x: (Math.random() -0.5) * 3,
            y: 3, 
            z: (Math.random() -0.5) * 3
        })
}
debugObject.reset = () => {
    for(const object of objectToUpdate){
        // remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // remove mesh
        scene.remove(object.mesh)
    }
    objectToUpdate.splice(0, objectToUpdate.length)
}

gui.add(debugObject, 'createSphere')
gui.add(debugObject, 'createBox')
gui.add(debugObject, 'reset')
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sounds
 */

const hitSound = new Audio('./sounds/hit.mp3')

const playHitSound = (e) => {
    const impactStrength = e.contact.getImpactVelocityAlongNormal()
    if(impactStrength > 1.5){
        hitSound.volume = Math.min(impactStrength / 10, 1.0)
        hitSound.currentTime = 0
        hitSound.play()
    }
}



/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */

// World
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, -9.82, 0)

// Materials
const concreteMaterial = new CANNON.Material('concrete')
const plasticMaterial = new CANNON.Material('plastic')

const concretePlasticContactMaterial = new CANNON.ContactMaterial(
    concreteMaterial,
    plasticMaterial,
    {
        friction: 0.1,
        restitution: 0.7
    }
)
world.addContactMaterial(concretePlasticContactMaterial)

// sphere
const sphereShape = new CANNON.Sphere(0.5)
const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: sphereShape,
    material: plasticMaterial
})
// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))
world.addBody(sphereBody)

// floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.material = concreteMaterial
world.addBody(floorBody)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)

// /**
//  * Test sphere
//  */
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(0.5, 32, 32),
//     new THREE.MeshStandardMaterial({
//         metalness: 0.3,
//         roughness: 0.4,
//         envMap: environmentMapTexture,
//         envMapIntensity: 0.5
//     })
// )
// sphere.castShadow = true
// sphere.position.y = 0.5
// scene.add(sphere)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Utils
 */
const objectToUpdate = []

// sphere

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32)
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})


const createSphere = (radius, position) => {
    // THREE mesh
    const mesh = new THREE.Mesh(
        sphereGeometry,
        sphereMaterial
    )
    mesh.scale.set(radius, radius, radius)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // CANNON body
    const shape = new CANNON.Sphere(radius)
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: plasticMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectToUpdate.push({
        mesh,
        body
    })
}

createSphere(0.5, { x: 0, y: 3, z: 0 })

// box

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
})


const createBox = (width, height, depth, position) => {
    // THREE mesh
    const mesh = new THREE.Mesh(
        boxGeometry,
        boxMaterial
    )
    mesh.scale.set(width, height, depth)
    mesh.castShadow = true
    mesh.position.copy(position)
    scene.add(mesh)

    // CANNON body
    const shape = new CANNON.Box(new CANNON.Vec3(width/2, height/2, depth/2))
    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: plasticMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    objectToUpdate.push({
        mesh,
        body
    })
}


/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // // Update physics world
    // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position)
    world.step(1/60, deltaTime, 3)

    for (const object of objectToUpdate) {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }

    // // Update sphere position
    // sphere.position.copy(sphereBody.position)
    

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()