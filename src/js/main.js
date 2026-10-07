import '../css/tailwind.css';
import 'lenis/dist/lenis.css'
import '../scss/main.scss';
import Lenis from 'lenis'
import gsap from 'gsap';
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import SplitText from "gsap/SplitText";
import {dom, raaf} from './assets/utils.js';
import Scene from './scene.js';

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

/*--------------------
Lenis
--------------------*/
const lenis = new Lenis({
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  lerp: 0.1,
  smooth: true
})

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0)


/*--------------------
Parallax data-scroll
--------------------*/
document.querySelectorAll('[data-scroll]').forEach((el) => {

  const speed = el.dataset.scrollSpeed * 100
  const zoom = el.dataset.scrollZoom || 1

  gsap.set(el, {
    scale: zoom
  })

  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      scrub: true,
      start: 'top 90%',
      end: 'bottom 0%',
      once: false
    },
    y: `${-speed}%`,
    ease: 'none'
  })
})


const Bubbles = new Scene({
  domElement: document.querySelector('#nice')
})

const logo = document.querySelector(".header-logo");
const overlay = document.querySelector(".overlay");
const nice = document.querySelector(".nice");
const skillSection = document.querySelector(".skills");

const introTl = gsap.timeline({ delay: .5, paused: true });
const scrollTl = gsap.timeline({ paused: true });
const bigWords = SplitText.create('.heading', {type: "lines, words"});
const shadowText = SplitText.create('.text-effect', {type: "words"});
const shadowWords = shadowText.words;
const skillItems = gsap.utils.toArray(".skills__item");

introTl.from(logo, {
  autoAlpha: 0,
  duration: 1.2,
  ease: "linear"
})
.to(logo, {
  top: 0,
  duration: 1,
  ease: "power3.out"
})
.to(overlay, {
  autoAlpha: 0,
  ease: "linear"
})
.to(logo, {
  filter: "invert(0%)"
}, "-=0.5")
.from(bigWords.words, {
  autoAlpha: 0.1,
  stagger: 0.2,
  ease: "linear",
  duration: 1,
})
.from(nice, {
  opacity: 0,
  duration: 0.7,
  ease: "power1.inOut"
}, "-=0.5")

shadowWords.forEach(word => {

  gsap.from(word, {
    autoAlpha: 0.1,
    stagger: 0.2,
    ease:"power1.inOut",
    scrollTrigger: {
      trigger: word,
      start: "top 85%",
      end: "bottom 60%",
      scrub: 0.2
    }
  })

})

skillItems.forEach(item => {
  gsap.from(item, {
    autoAlpha: 0,
    ease: "power1.in",
    scrollTrigger: {
      trigger: item,
      start: "top 70%"
    }
  })
})

scrollTl.from('#what', {
  scrollTrigger: {
    trigger: '#what',
    start: 'top 40%',
    end: 'bottom 50%',
    pin: '#what'
  }
})

gsap.to(skillSection, {
  opacity: 1,
  background: '#000',
  color: '#fffffff',
  ease: "linear",
  scrollTrigger: {
    animation: scrollTl,
    trigger: skillSection,
    start: 'top 20%',
    end: 'bottom 60%',
    toggleActions: 'play reverse play reverse',
  }
})

function initHorizontal() {

  const viewport = document.querySelector('.services__gallery')
  const imagesPin = viewport.querySelector('.translate-images')
  const getDistance = () => Math.max(0, imagesPin.scrollWidth - viewport.clientWidth)

  const containerAnimation = gsap.to(imagesPin, {
    scrollTrigger: {
      trigger: viewport,
      start: 'top top',
      end: () => "+=" + getDistance(),
      pin: true,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
    },
    x: () => -getDistance(),
    ease: 'none'
  })

  imagesPin.querySelectorAll('.translate-images__item').forEach(imageWrapper => {
    ScrollTrigger.create({
      trigger: imageWrapper,
      start: 'left center',
      end: 'right center',
      containerAnimation: containerAnimation,
      toggleClass: 'active',
    })
  })

  ScrollTrigger.sort()
  ScrollTrigger.refresh()
}


dom.events.on( window, 'DOMContentLoaded', () => {
  Bubbles.init()
  introTl.play()
  initHorizontal()
} )
