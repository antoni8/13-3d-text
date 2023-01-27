import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {TextGeometry} from "three/examples/jsm/geometries/TextGeometry";

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// AxesHelper

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/prova/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/prova/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/prova/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/prova/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/prova/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/prova/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/prova/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg')

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ map: doorColorTexture })
)
const cylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ map: doorColorTexture })
)
const torus = new THREE.Mesh(
    new THREE.TorusGeometry(1),
    new THREE.MeshBasicMaterial({ map: doorColorTexture })
)

cube.position.x = 3
cylinder.position.x = -3

scene.add(cube, cylinder, torus)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// text
const fontLoader = new FontLoader()
fontLoader.load(
    '/fonts/Viking-Normal_Regular.json',
    (font) =>{
        console.log('Font loaded', font)
        const textGeometry = new TextGeometry(
            'Viking Font',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        )
        textGeometry.center()

        //const textMaterial = new THREE.MeshBasicMaterial({wireframe: true,})
        const textMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture
        })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        text.position.z = 1
        scene.add(text)
    }
)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Gui Controls
const fs = gui.addFolder("Escalar objectes");
fs.add(cube.scale, 'x').name("X scale Cube").min(1).max(5).step(0.01)
fs.add(cube.scale, 'y').name("Y scale Cube").min(1).max(5).step(0.01)
fs.add(cube.scale, 'z').name("Z scale Cube").min(1).max(5).step(0.01)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    cube.rotation.y += 0.01
    cylinder.rotation.y += 0.01
    torus.rotation.z += 0.01

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()