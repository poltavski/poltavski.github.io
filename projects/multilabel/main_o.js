
$(document).ready()
{
  $('.progress-bar').hide();
}
$("#image-selector").change(function(){
    let reader = new FileReader();

    reader.onload = function(){
        let dataURL = reader.result;
        $("#selected-image").attr("src",dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});


// $("#model-selector").change(function(){
//     loadModel($("#model-selector").val());
//     $('.progress-bar').show();
// })

let model;
async function loadModel(name){
    // model=await tf.loadModel(`http://localhost:8081/${name}/model.json`);
    // model=await tf.loadLayersModel('mobilenet/model.json');
    const model = await tf.loadLayersModel(
        'https://poltavski.github.io/multilabel/mn/model.json');
    // model.summary();
    // model = await tf.loadLayersModel('model/model.json');
    $('.progress-bar').hide();
}

$(function(){
    var $button = $('.active').clone();
    $('.result').html($button);
});


$("#predict-button").click(async function(){
    let image= $('#selected-image').get(0);
    let tensor = preprocessImage(image,$("#model-selector").val());

    let prediction = await model.predict(tensor).data();
    let top5=Array.from(prediction)
                .map(function(p,i){
    return {
        probability: p,
        className: IMAGENET_CLASSES[i]
    };
    }).sort(function(a,b){
        return b.probability-a.probability;
    }).slice(0,5);

$("#prediction-list").empty();
top5.forEach(function(p){
    $("#prediction-list").append(`<li>${p.className}:${p.probability.toFixed(6)}</li>`);
});

});


function preprocessImage(image,modelName)
{
    let tensor=tf.fromPixels(image)
    .resizeNearestNeighbor([224,224])
    .toFloat();//.sub(meanImageNetRGB)
          
    if(modelName==undefined)
    {
        return tensor.expandDims();
    }
    else if(modelName=="vgg")
    {
        let meanImageNetRGB= tf.tensor1d([123.68,116.779,103.939]);
        return tensor.sub(meanImageNetRGB)
                    .reverse(2)
                    .expandDims();
    }
    else if(modelName=="mobilenet")
    {
        let offset=tf.scalar(127.5);
        return tensor.sub(offset)
                    .div(offset)
                    .expandDims();
    }
    else
    {
        throw new Error("UnKnown Model error");
    }
}