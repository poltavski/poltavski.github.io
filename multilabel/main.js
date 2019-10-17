const FOOD_CLASSES = {
    0: 'healthy',
    1: 'junk',
    2: 'dessert',
    3: 'appetizer',
    4: 'mains',
    5: 'soups',
    6: 'carbs',
    7: 'protein',
    8: 'fats',
    9: 'meat'
};



$(document).ready()
{
  $('.progress-bar').hide();
  $('.slider-for').slick({
   slidesToShow: 1,
   slidesToScroll: 1,
   arrows: false,
   fade: true,
   asNavFor: '.slider-nav'
 });
 $('.slider-nav').slick({
   centerMode: true,
//    adaptiveHeight: true,
   centerPadding: '40px',
   slidesToShow: 4,
   slidesToScroll: 1,
   asNavFor: '.slider-for',
   dots: true,
   arrows: true,
   focusOnSelect: true,
   responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        focusOnSelect: true,
        arrows: true,
        dots: true
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        focusOnSelect: true,
        arrows: true,
        dots: true
      }
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        focusOnSelect: true,
        arrows: true,
        dots: true
      }
    }
    // You can unslick at a given breakpoint now by adding:
    // settings: "unslick"
    // instead of a settings object
  ]
 });
//  $('a[data-slide]').click(function(e) {
//    e.preventDefault();
//    var slideno = $(this).data('slide');
//    $('.slider-nav').slick('slickGoTo', slideno - 1);
//  });

}

// $('.slider').slick({
//     dots: false,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2000,
//     arrows: true,
//     responsive: [{
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1
//         }  
//     },
//     {
//         breakpoint: 400,
//         settings: {
//             arrows: false,
//             slidesToShow: 1,
//             slidesToScroll: 1
//         }
//     }]
// });

// $(".slick-current" ).change(function(){
// $(".slick-current")    
    
// $("button").change(function(){
    
// $(".slider-nav").on("beforeChange", function (){
//     //change color here
//     $(".slick-current" ).css( "border", "3px solid red" );

// });
$('.main').on('afterChange', function(event, slick, currentSlide, nextSlide){
    // debugger;
    $(".slick-slide").removeClass('works');
    $('.slick-current').addClass('works');
});


$("#image-selector").change(function(){
    let reader = new FileReader();

    reader.onload = function(){
        // console.log(reader.result)
        let dataURL = reader.result;
        $("#selected-image").attr("src",dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop('files')[0];
    console.log(file);
    reader.readAsDataURL(file);
});





// $("#model-selector").change(function(){
// $(function(value){
//     var input = $('.input'),
//         bar = $('.bar'),
//         bw = bar.width(),
//         percent = bar.find('.percent'),
//         circle = bar.find('.circle'),
//         ps = percent.find('span'),
//         cs = circle.find('span'),
//         name = 'rotate';

//     input.on('keydown', function (e) {
//         if (e.keyCode == 13) {
//             var t = $(this), val = t.val();
//             if (val >= 0 && val <= 100) {
//                 var w = 100 - val, pw = (bw * w) / 100,
//                     pa = {
//                         width: w + '%'
//                     },
//                     cw = (bw - pw) / 2,
//                     ca = {
//                         left: cw
//                     }
//                 ps.animate(pa);
//                 cs.text(val + '%');
//                 circle.animate(ca, function () {
//                     circle.removeClass(name)
//                 }).addClass(name);
//             } else {
//                 alert('range: 0 - 100');
//                 t.val('');
//             }
//         }
//     });
//     //         
//     var e = jQuery.Event("keydown");
//     e.keyCode = e.which = 13; // # Some key code value
//     $(input).trigger(e);
// });  
// function draw_bar(value, counter ){
//     var bar = $(`.bar-${counter}`),
//         bw = bar.width(),
//         percent = bar.find(`.percent-${counter}`),
//         circle = bar.find(`.circle-${counter}`),
//         ps = percent.find(`span`),
//         cs = circle.find(`span`),
//         name = `rotate`;

//      val = value;
//         if (val >= 0 && val <= 100) {
//             var w = 100 - val, pw = (bw * w) / 100,
//                 pa = {
//                         width: w + '%'
//                 },
//                 cw = (bw - pw) / 2,
//                 ca = {
//                         left: cw
//                 }
//             ps.animate(pa);
//             cs.text(val + '%');
//             circle.animate(ca, function () {
//                 circle.removeClass(name)
//             }).addClass(name);
//         } else {
//             alert('range: 0 - 100');
//             t.val('');
//         }
// };
    //         
    
// })

let model;
async function loadModel(){
    // model=await tf.loadLayersModel('mobilenet/model.json');
    // model = await tf.loadLayersModel('model/model.json');
    model = await tf.loadLayersModel('https://poltavski.github.io/multilabel/model/model.json');
    // model.summary();
    $('.progress-bar').hide();
}

loadModel(); // $("#model-selector").val()
$('.progress-bar').show();

// function getBase64Image(img1) {
//     var img = new Image();
//     img.crossOrigin = 'Anonymous';
//     img.src = img1.src;
//     console.log(img);
//     var canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;
//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);
//     var dataURL = canvas.toDataURL("image/png");
//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// };
    // .load(function(){

// function getBase64Image(img) {
//   var canvas = document.createElement("canvas");
//   canvas.crossOrigin = 'Anonymous';
//   canvas.width = img.width;
//   canvas.height = img.height;
//   var ctx = canvas.getContext("2d");
//   ctx.drawImage(img, 0, 0);
//   var dataURL = canvas.toDataURL("image/png");
//   return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// }



  
// function getBase64Image(img) {
//     // Create an empty canvas element
//     var canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;

//     // Copy the image contents to the canvas
//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);

//     // Get the data-URL formatted image
//     // Firefox supports PNG and JPEG. You could check img.src to
//     // guess the original format, but be aware the using "image/jpg"
//     // will re-encode the image.
//     var dataURL = canvas.toDataURL("/media/artem/opt/code/multilabel/gallery/18_guacamole_hostedLargeUrl.jpg");

//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// }
var counter = 0;
$("#predict-button").click(async function(){
    counter +=3;
    $(".predictions").prepend(`<h4>Image ${counter/3}</h2><div class="row text-center">
    <div class="col-4" id="chart-${counter-2}"></div>
    <div class="col-4" id="chart-${counter-1}"></div> 
    <div class="col-4" id="chart-${counter}"></div>  
</div>`)
    
    let image1= ($('.works').find('.sl-img')).get(0);  
    // console.log(image1);
    // console.log(image1.src)
    // var base64 = getBase64Image(image);
    // console.log("base go");
    // console.log(base64);
    // let image= $('#selected-image').get(0);
    // var img2 = new Image();
    // img2.crossOrigin = 'Anonymous';
    // img2 = image1.src
    // img2.innerHTML = image1.innerHTML;
    // console.log(image);
    let tensor = preprocessImage(image1);
    // let tensor1 = preprocessImage(image1);

    let prediction = await model.predict(tensor).data();
    let top10=Array.from(prediction)
                .map(function(p,i){
    return {
        probability: p,
        className: FOOD_CLASSES[i]
    };
    }).sort(function(a,b){
        return b.probability-a.probability;
    });

    $("#predict-your").click(async function(){
        counter +=3;
        $(".predictions").prepend(`<h4>Image ${counter/3}</h2><div class="row text-center">
        <div class="col-4" id="chart-${counter-2}"></div>
        <div class="col-4" id="chart-${counter-1}"></div> 
        <div class="col-4" id="chart-${counter}"></div>  
    </div>`)
        
        // let image1= ($('.works').find('.sl-img')).get(0);  
        // console.log(image1);
        // console.log(image1.src)
        // var base64 = getBase64Image(image);
        // console.log("base go");
        // console.log(base64);
        let image= $('#selected-image').get(0);
        // var img2 = new Image();
        // img2.crossOrigin = 'Anonymous';
        // img2 = image1.src
        // img2.innerHTML = image1.innerHTML;
        // console.log(image);
        let tensor = preprocessImage(image);
        // let tensor1 = preprocessImage(image1);
    
        let prediction = await model.predict(tensor).data();
        let top10=Array.from(prediction)
                    .map(function(p,i){
        return {
            probability: p,
            className: FOOD_CLASSES[i]
        };
        }).sort(function(a,b){
            return b.probability-a.probability;
        });
    

 
var lab = [];
var ser = [];

var lab_rad = [];
var ser_rad = [];

top5 = top10.slice(0,5);
// $("#prediction-list").empty();
top5.forEach(function(p){
    lab.push(p.className);
    ser.push(p.probability.toFixed(2)*100);

    // $("#prediction-list").append(`<li>${p.className}:${p.probability.toFixed(6)}</li>`);
});
top10.forEach(function(p){
    lab_rad.push(p.className);
    ser_rad.push(p.probability.toFixed(2)*100);

    // $("#prediction-list").append(`<li>${p.className}:${p.probability.toFixed(6)}</li>`);
});


var options = {
    chart: {
        width: 400,
        type: 'donut',
    },
    labels: lab,
    series: ser,
    responsive: [{
        breakpoint: 400,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
        
    }],
}

var options_rad = {
    chart: {
        height: 350,
        type: 'radar',
    },
    series: [{
        name: 'Food classification',
        data: ser_rad,
    }],
    responsive: [{
        breakpoint: 400,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }], 
    title: {
        text: 'Radar Food Chart'
    },
    labels: lab_rad
}

var options_bar = {
    chart: {
        height: 250,
        type: 'bar',
    },
    plotOptions: {
        bar: {
            horizontal: true,
        }
    },
    dataLabels: {
        enabled: false
    },
    series: [{
        data: ser
    }],
    xaxis: {
        categories: lab,
    }
}



var chart = new ApexCharts(
    document.querySelector(`#chart-${counter-2}`),
    options
);

chart.render();

var chart_rad = new ApexCharts(
    document.querySelector(`#chart-${counter-1}`),
    options_rad
);

chart_rad.render();

var chart_bar = new ApexCharts(
    document.querySelector(`#chart-${counter}`),
    options_bar
);

chart_bar.render();



});


function preprocessImage(image)
{
    let tensor=tf.browser.fromPixels(image)
    .resizeNearestNeighbor([224,224])
    .toFloat();//.sub(meanImageNetRGB)
    let meanImageNetRGB= tf.tensor1d([51.072815, 51.072815, 51.072815]);
    let STD = tf.tensor1d([108.75629,  92.98068,  85.61884]);
    return tensor.sub(meanImageNetRGB)
                .div(STD)
                .expandDims();      
}