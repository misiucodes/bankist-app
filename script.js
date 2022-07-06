'use strict';

// MODAL WINDOW /////////////

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// SCROLL FEATURE /////////////////

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
// To do: Add other sections later

btnScrollTo.addEventListener('click', function(e) {
  section1.scrollIntoView({behavior: 'smooth'});
});

// Page Navigating using Event Delegation

// 1. Add event listener to common parent element
// 2. Determine what element orginated the event

document.querySelector('.nav__links').addEventListener('click', function(e) {
  e.preventDefault();

  // Matching strategy - write a condition that ensures the parent contains the class of the elements we want. This ensures we can ignore clicks that are within the parent element but NOT the target elements we want.

  if(e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
});

// Tab Feature

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Event delegation - apply event listener to tabs container (parent)

tabsContainer.addEventListener('click', function(e) {
  e.preventDefault();
  // Match strategy - select only button tabs within the parent
  const clicked = e.target.closest('.operations__tab');
  // Guard clause - prevent unwanted clicks 
  if (!clicked) return;
  // Remove active styles 
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  console.log(clicked);
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Apply active styles
  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


// Nav Link Hover Animation

const nav = document.querySelector('.nav'); // event delegation - target parent element 

// Refactor handleHover function into separate function
const handleHover = function (e) {
  const links = e.target;
  const siblings = links.closest('.nav').querySelectorAll('.nav__link');

  siblings.forEach(s => {
    if (s !== links) s.style.opacity = this;
  });
};

// Pass in opacity argument using bind method to handleHover function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


// Sticky Nav using Observer API

const header = document.querySelector('.header');

const navHeight = nav.getBoundingClientRect().height; // calc the height of the rootMargin dynamically vs hardcoing it
// console.log(navHeight); // returns a height property of 90px - use it as a template literal in the object

// Call back function 
const stickyNav = function (entries) {
  const [entry] = entries; 
  // console.log(entry);
  if(!entry.isIntersecting) nav.classList.add('sticky'); // if target is NOT intersecting the root, add the sticky class. Note. the ".isIntersecting" property is from the new IntersectionObserver object in the console
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0, // when 0% of the header is visible, we want the sticky nav to trigger
  rootMargin: `-${navHeight}px`, // a box of 90 pixels that will be applied outside our target element meaning the sticky nav will get applied 90px before our specific threshold. Must be specific in px.
});

headerObserver.observe(header);


// Revealing Elements on Scroll Feature

const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
 const [entry] = entries;
//  console.log(entry); // read the IntersectionObserver object to access the target property

 if(!entry.isIntersecting) return;

 entry.target.classList.remove('section--hidden');

 observer.unobserve(entry.target); // turn off observer
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
}); 
  allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});


// Lazy Image Loading Feature

const imgs = document.querySelectorAll('img[data-src]'); // select only the images that have the custom attribute "data-src"

const loadImg = function (entries, observer) {
  const [entry] = entries; // use this when we only have one threshold

  if (!entry.isIntersecting) return;

  // Replace src attribute with the original data-src
  entry.target.src = entry.target.dataset.src;
  
  entry.target.addEventListener('load', function() {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '-200px', // delays loading to see the fade in
});

imgs.forEach(img => imgObserver.observe(img));


// Slider Feature
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;
  const maxSlide = slides.length;

// // Test settings 
// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.9)';
// slider.style.overflow = 'visible';

// Create a function that loops over all the slides (simply because we want to repeat the same HTML element of dots under each slide)
  const createDots = function() {
    slides.forEach(function(_, i) {
        dotContainer.insertAdjacentHTML('beforeend', 
        `<button class="dots__dot" data-slide="${i}"></button>`
        );
      });
    };
  
  const activateDot = function(slide) {
    // Remove active class on all first
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));
    
    // Select the active dot using the dataslide attribute on the dot element
    document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
  };
  
  // Loop through each slide and apply the translateX property multiplied by the index to get 0%, 100%, 200%, 300%
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
    };
    
  // Next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };
  
  // Previous slide
  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
      goToSlide(currentSlide);
      activateDot(currentSlide);
    }
  };
  
  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  
  // Adding an event listener to the entire page that allows user to scroll through slides using keyboard
  document.addEventListener('keydown', function(e) {
    console.log(e);
    if (e.key === 'ArrowLeft') prevSlide();
    // Can also use short circuiting as a condition:
    e.key === 'ArrowRight' && nextSlide();
  });
  
  dotContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide; 
      // could also use destructuring: const {slide} = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });

  // Instead of calling each function at the end of the code block, we can consolidate them into one initalization function 
  const initialize = function () {
    goToSlide(0); // starts the slides at 1
    createDots(); // displays the dots under each slide
    activateDot(0); // will make sure that first dot is active upon load
  };
  initialize();
};
slider();

