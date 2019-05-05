// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image classification using MobileNet and p5.js
This example uses a callback pattern to create the classifier
=== */

// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
const classifier = ml5.imageClassifier('MobileNet', modelReady);

// A variable to hold the image we want to classify
let img;
let input;

function preload() {
  input = createFileInput(handleFile);
  input.position(100, 1000);
}

function handleFile(file) {
  print(file);
  if (file.type === 'image') {
    img = createImg(file.data);
    imageReady();
  }
}


function setup() {
  noCanvas();
  // Load the image
  img = createImg('images/bird.jpg', imageReady);
  img.size(400, 400);
}

// Change the status when the model loads.
function modelReady(){
  document.getElementById('status').html('Model Loaded')
}

// When the image has been loaded,
// get a prediction for that image
function imageReady() {
  classifier.predict(img, gotResult);
  // You can also specify the amount of classes you want
  // classifier.predict(img, 10, gotResult);
}

// A function to run when we get any errors and the results
function gotResult(err, results) {
  if (err) {
    console.error(err);
  }
  // The results are in an array ordered by probability.
  select('#result').html(results[0].className);
  select('#probability').html(nf(results[0].probability, 0, 2));
}
