// add autocomplete

// edited index.html (for elements), sam.css (for find elements), slides.js (to add find.js), slide-deck.js (to add case)

var currentMatchIndex = 0;
var matches = [];
var slides = [];
var queryString;

var findButton = document.querySelector('div#find button');
var findDiv = document.querySelector('div#find');
var findInput = document.querySelector('div#find input');

// handle click if in findDiv, otherwise hide findDiv
document.body.onclick = function(e){
  console.log(e.target);
  if (findDiv.contains(e.target)) {
    e.preventDefault();
  } else {
    findDiv.classList.remove('shown');
  }
}

findInput.onkeydown = function(e){
  if (e.keyCode === 13) {
    find();
  }
}

findButton.onclick = find();

function find(){
  queryString = findInput.value.replace(/[^a-zA-Z()_.=<>]/g, " ").toLowerCase();
  numResults = 0;
  numSlides = 0;
  searchResultsString = '';
  console.time('Time for search:');
  for (var i = 0; i !== slides.length; ++i) {
    matches = [];
    if (slides[i].text.indexOf(queryString) !== -1) {
      console.log(slides[i].text);
      matches.push(i +1); // slides[0] corresponds to slide #1
    }
  }
  if (matches.length > 0) {
    displayNextMatch();
  }
};

function displayMatch(){
  // !!!hack
  location.hash = '#' + (matches[currentMatchIndex]);
  currentMatchIndex = (currentMatchIndex + 1) % matches.length;
//  location.reload();
}

function getSlideData(){
  // cope with different document formats
  // Chrome Dev Rel presentations have article elements in slide elements
  var d =  window.document;
  var slideElements = d.querySelectorAll('slide') || d.querySelector('article') || d.querySelector('section');
  if (!slideElements) {
    console.log('Could not find element name for slides for ', url);
    return;
  }
  for (var i = 0; i !== slideElements.length; ++i){
    addSlideData(slideElements[i]);
  }
}

// each slide may have a heading, article, aside (speaker notes) and images
function addSlideData(slideElement){

  var slide = {
    text: ''
  };

  var h1 = slideElement.querySelector('h1');
  if (h1 && h1.textContent.trim() !== ''){
    slide.heading = getText(h1);
  }
  var h2 = slideElement.querySelector('h2');
  if (h2 && h2.textContent.trim() !== ''){
    // if both h2, add it
    slide.heading = slide.heading ? slide.heading + ' · ' + getText(h2) : getText(h2);
  }
  var h3 = slideElement.querySelector('h3');
  if (h3 && h3.textContent.trim() !== ''){
    // if h3, add it
    slide.heading = slide.heading.length > 0 ? slide.heading + ' · ' + getText(h3) : getText(h2);
  }
  slide.text += slide.heading;

  var article = slideElement.querySelector('article');
  if (article && article.textContent.trim() !== ''){
    slide.article = getText(article);
  }
  slide.text += slide.article;

  var aside = slideElement.querySelector('aside');
  if (aside && aside.textContent.trim() !== ''){
    slide.aside = getText(aside);
  }
  slide.text += slide.aside;

  var images = slideElement.querySelectorAll('img');
  if (images.length){
    slide.images = [];
    for (var i = 0; i != images.length; ++i){
      var image = images[i];
      var alt = image.alt || image.title;
      if (alt && alt.trim() != ''){
        slide.text += image.alt;
        slide.images.push({alt: alt, src: image.src});
      }
    }
    if (slide.images.length === 0){
      // remove empty image array caused when no images on the slide have alt attributes
      delete slide.images;
    }
  }

  // combine and lowercase text to enable faster search
  slide.text = slide.text.toLowerCase();
  slides.push(slide);
}



function getText(element){
  return element.textContent.trim().replace(/\s+/g, ' ');
}
