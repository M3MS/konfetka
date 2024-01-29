import '../scss/main.scss'
import Lenis from '@studio-freight/lenis'
import gsap from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import {dom, raf} from './assets/utils.js';
import App from './scene.js';

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis()

lenis.on('scroll', (e) => {
  //console.log(e)
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

const ShaolinApp = new App()

dom.events.on( window, 'DOMContentLoaded', () => {
  ShaolinApp.init()
} )