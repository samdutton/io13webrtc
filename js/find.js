// add autocomplete
// match find box and behaviour
// datalist using var words = document.body.textContent.split(/\s+/).sort().filter( function(v,i,o){return v!==o[i-1];});
// h3manth.com/content/javascript-one-liner-extracting-unique-words-webpages


// edited index.html (for elements), sam.css (for find elements), slides.js (to add find.js), slide-deck.js (add case for F; setCurrentSlide())

var currentMatchIndex = 0;
var matches = [];
var slides = [];
var queryString;
var slideElements;

var findButton = document.querySelector('div#find button');
var findDiv = document.querySelector('div#find');
var findInput = document.querySelector('div#find input');

getSlideData();

function getSlideData(){
  // cope with different document formats
  // Chrome Dev Rel presentations have article elements in slide elements
  var d =  window.document;
  slideElements = d.querySelectorAll('slide') || d.querySelector('article') || d.querySelector('section');
  if (!slideElements) {
    console.log('Could not find element name for slides for ', url);
    return;
  }
  for (var i = 0; i !== slideElements.length; ++i){
    addSlideData(slideElements[i]);
  }
  // console.log('slides', slides.length, slides);
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

  if (slide.heading) {
    slide.text += slide.heading;
  }

  var article = slideElement.querySelector('article');
  if (article && article.textContent.trim() !== ''){
    slide.article = getText(article);
    slide.text += slide.article;
  }

  var aside = slideElement.querySelector('aside');
  if (aside && aside.textContent.trim() !== ''){
    slide.aside = getText(aside);
  }

  var images = slideElement.querySelectorAll('img');
  if (images.length > 0){
    slide.images = [];
    for (var i = 0; i != images.length; ++i){
      var image = images[i];
      var alt = image.alt || image.title;
      if (alt && alt.trim() != ''){
        slide.text += alt;
        slide.images.push({alt: alt, src: image.src});
      }
    }
    if (slide.images.length === 0){
      // remove empty image array caused when no images on the slide have alt attributes
      delete slide.images;
    }
  }

  slides.push(slide);
}



function getText(element){
  return element.textContent.trim().replace(/\s+/g, ' ').toLowerCase();
}

// handle click if in findDiv, otherwise hide findDiv
document.body.onclick = function(e){
  if (findDiv.contains(e.target)) {
    e.preventDefault();
  } else {
    findDiv.classList.remove('shown');
  }
}

findInput.onkeydown = function(e){
  if (e.keyCode === 13) {
    find();
  } else {
    matches = [];
  }
}

findButton.onclick = find;

function find(){
  if (matches.length === 0) {
    currentMatchIndex = 0;
    // to be secure might want alphanumeric only
    queryString = findInput.value.replace(/[^a-zA-Z0-9()_.=<>]/g, " ").toLowerCase();
    numResults = 0;
    numSlides = 0;
    searchResultsString = '';
    for (var i = 0; i !== slides.length; ++i) {
      if (slides[i].text.indexOf(queryString) !== -1) {
        matches.push({slideIndex: i, type: 'text'});
      }
      // for matches in presenter notes
      if (slides[i].aside && slides[i].aside.indexOf(queryString) !== -1) {
        matches.push({slideIndex: i, type: 'aside'});
      }
    }
  }
  if (matches.length > 0) {
    highlight(queryString);
    displayNextMatch();
  }
};

function displayNextMatch(){
  console.log(matches);
  var slideIndex = matches[currentMatchIndex].slideIndex;
  console.log(slideIndex);
  slidedeck.setCurrentSlide(slideIndex);
  // if this match is in presenter notes
  if (matches[currentMatchIndex].type === 'aside') {
    document.body.classList.add('with-notes');
  } else {
    document.body.classList.remove('with-notes');
  }
  // increment matchIndex
  currentMatchIndex = (currentMatchIndex + 1) % matches.length;
}

function highlight(text){
  for (var i = 0; i != slideElements.length; ++i) {
    var re = new RegExp('(' + text + ')', 'gi');
    slideElements[i].innerHTML =
      slideElements[i].innerHTML.replace(re, '<mark>\$1</mark>');
    // highlight images with matching alt text
  }
}
