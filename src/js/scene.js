import * as THREE from 'three';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {dom, raf} from './assets/utils.js';
import {noise, planeFragment, planeVertex} from './assets/shaders.js';

const Mouse = { x: 0, y: 0, nX: 0, nY: 0 }
const Window = { w: window.innerWidth, h: window.innerHeight }
const map = ( num, min1, max1, min2, max2 ) => {
  let num1 = ( num - min1 ) / ( max1 - min1 )
  let num2 = ( num1 * ( max2 - min2 ) ) + min2
  return num2
}

class Plane extends THREE.Group {
  constructor (args = {couleur: 0xFCB909}) {
    super()

    const bgGeometry = new THREE.PlaneGeometry( 1, 1 )
    const bgMaterial = new THREE.MeshStandardMaterial( {
      color: 0xFFFFFF,
      side: THREE.DoubleSide,
      roughness: 0.9,
      metalness: 0.
    } )

    this.color = args.couleur
    this.bgMesh = new THREE.Mesh( bgGeometry, bgMaterial )
    this.add( this.bgMesh )
    const geometry = new THREE.PlaneGeometry( 1, 1 )
    this.uniforms = {
      uTime: { value: 0 },
      uTexture: { value: new THREE.TextureLoader().load( 'https://dl.dropboxusercontent.com/s/etrli436g9f1m7t/texture5.png' ) },
      uResolution: { value: new THREE.Vector2( Window.w, Window.h ) },
      uColor: { value: new THREE.Color( this.color ) },
      uMouse: { value: new THREE.Vector2( map( Mouse.nX, -1, 1, 0, 1 ), map( Mouse.nY, -1, 1, 0, 1 ) ) }
    }
    const material = new THREE.ShaderMaterial( {
      uniforms: this.uniforms,
      fragmentShader: planeFragment,
      vertexShader: planeVertex,
      side: THREE.DoubleSide,
      transparent: true
    } )
    this.mesh = new THREE.Mesh( geometry, material )
    this.add( this.mesh )
    this.update = this.update.bind( this )
  }
  update ( d ) {
    this.uniforms.uTime.value += d * 0.0001
  }
  mouseMove ( mouse ) {
    this.uniforms.uMouse.value.x = map( mouse.x, -1, 1, 0, 1 )
    this.uniforms.uMouse.value.y = map( mouse.y, -1, 1, 0, 1 )
  }
  resize ( w, h ) {
    this.uniforms.uResolution.value.x = Window.w
    this.uniforms.uResolution.value.y = Window.h
    this.bgMesh.scale.x = w
    this.bgMesh.scale.y = h
    this.mesh.scale.x = h
    this.mesh.scale.y = h
  }
}

class Xp {
  constructor () {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera( 45, Window.w / Window.h, 1, 1000 )
    this.camera.position.z = 100
    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
    this.renderer.setSize( Window.w, Window.h )
    dom.select.one( '.nice' ).appendChild( this.renderer.domElement )

    this.DELTA_TIME = 0
    this.LAST_TIME = Date.now()

    this.mouse = new THREE.Vector2()

    this.bind()
    this.initLights()
    this.initMeshes()
    this.resize()
  }
  bind () {
    [ 'update', 'resize', 'mouseMove' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )
  }
  initMeshes () {
    this.plane = new Plane({couleur:0xFCB905})
    this.planeTwo = new Plane({couleur:0x0D00FF})

    console.log(this.planeTwo.position)

    this.planeTwo.position.x = -24
    this.planeTwo.position.y = -24

    this.scene.add( this.plane )
    this.scene.add( this.planeTwo )
  }
  initLights () {
    const ambientLight = new THREE.AmbientLight( 0xffffff, 4 )
    this.scene.add( ambientLight )

    const light = new THREE.DirectionalLight( 0xfcfcfc )
    light.position.set( 2, 2, -2 )
    this.scene.add( light )

    const light2 = new THREE.DirectionalLight( 0xa7a5a5 )
    light2.position.set( -1, -1, -1 )
    this.scene.add( light2 )
  }
  mouseMove () {
    this.mouse.x = Mouse.nX
    this.mouse.y = Mouse.nY
    this.planeTwo.mouseMove( this.mouse )
  }
  update () {
    this.DELTA_TIME = Date.now() - this.LAST_TIME
    this.LAST_TIME = Date.now()
    this.plane.update( this.DELTA_TIME )
    this.planeTwo.update( this.DELTA_TIME )
    this.renderer.render( this.scene, this.camera )
  }
  resize () {
    const aspect = Window.w / Window.h
    this.camera.aspect = aspect
    this.camera.updateProjectionMatrix()
    const vFov = this.camera.fov * Math.PI / 180
    const h = Math.ceil( 2 * Math.tan( vFov / 2 ) * this.camera.position.z )
    const w = Math.ceil( h * aspect )
    this.plane.resize( w, h )
    this.planeTwo.resize( w, h )
    this.renderer.setSize( Window.w, Window.h )
  }
}

export default class App {
  constructor () {
    this.bind()
    this.addListeners()
    this.xp = new Xp()
  }
  bind () {
    [ 'onResize', 'onMouseMove', 'update' ]
      .forEach( ( fn ) => this[ fn ] = this[ fn ].bind( this ) )
  }
  addListeners () {
    dom.events.on( window, 'resize', this.onResize )
    dom.events.on( window, 'mousemove', this.onMouseMove )
  }
  init () {
    this.update()
  }
  onResize () {
    Window.w = window.innerWidth
    Window.h = window.innerHeight
    this.xp.resize()
  }
  onMouseMove ( e ) {
    e.preventDefault()
    Mouse.x = e.clientX || Mouse.x
    Mouse.y = e.clientY || Mouse.y
    Mouse.nX = ( Mouse.x / Window.w ) * 2 - 1
    Mouse.nY = -( Mouse.y / Window.h ) * 2 + 1
    this.xp.mouseMove()
  }
  update () {
    this.xp.update()
    raf( this.update )
  }
}

