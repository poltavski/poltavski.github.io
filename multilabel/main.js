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



//
// $(document).ready()
// {
//   $('.progress-bar').hide();
//   $('.slider-for').slick({
//    slidesToShow: 1,
//    slidesToScroll: 1,
//    arrows: false,
//    fade: true,
//    asNavFor: '.slider-nav'
//  });
//  $('.slider-nav').slick({
//    centerMode: true,
// //    adaptiveHeight: true,
//    centerPadding: '40px',
//    slidesToShow: 3,
//    slidesToScroll: 1,
//    asNavFor: '.slider-for',
//    dots: true,
//    arrows: true,
//    focusOnSelect: true,
//    responsive: [
//     {
//       breakpoint: 1024,
//       settings: {
//         slidesToShow: 3,
//         slidesToScroll: 1,
//         asNavFor: '.slider-for',
//         focusOnSelect: true,
//         arrows: true,
//         dots: true
//       }
//     },
//     {
//       breakpoint: 600,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 1,
//         asNavFor: '.slider-for',
//         focusOnSelect: true,
//         arrows: true,
//         dots: true
//       }
//     },
//     {
//       breakpoint: 480,
//       settings: {
//         slidesToShow: 2,
//         slidesToScroll: 1,
//         asNavFor: '.slider-for',
//         focusOnSelect: true,
//         arrows: true,
//         dots: true
//       }
//     }
//     // You can unslick at a given breakpoint now by adding:
//     // settings: "unslick"
//     // instead of a settings object
//   ]
//  });
// //  $('a[data-slide]').click(function(e) {
// //    e.preventDefault();
// //    var slideno = $(this).data('slide');
// //    $('.slider-nav').slick('slickGoTo', slideno - 1);
// //  });
//
// }
//
// $('.main').on('afterChange', function(event, slick, currentSlide, nextSlide){
//     // debugger;
//     $(".slick-slide").removeClass('works');
//     $('.slick-current').addClass('works');
// });
// const TF = require('tfjs');

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

var script = document.createElement("script");
script.type = 'text/javascript';
script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest';
document.head.appendChild(script);


let model;
async function loadModel(){

    // model=await tf.loadLayersModel('mobilenet/model.json');
    model = await tf.loadLayersModel('model/model.json');
    // model = await tf.loadLayersModel('https://poltavski.github.io/multilabel/model/model.json');
    model.summary();

    // $('.progress-bar').hide();
}

loadModel(); // $("#model-selector").val()
// $('.progress-bar').show();


var counter = 0;
$("#predict-button").click(async function(){
    counter +=3;
    $(".predictions").prepend(`<h4>Image ${counter/3}</h2><div class="row text-center">
    <div class="col-4" id="chart-${counter-2}"></div>
    <div class="col-4" id="chart-${counter-1}"></div>
//     <div class="col-4" id="chart-${counter}"></div>
</div>`);
    let $itemBig = $('.owl-item.big > div').clone();
    $('#cur-img').html($itemBig);
    let image1= ($('.owl-item.big > div > div > img').get(0)); //.find('.sl-img'))
    image1.crossOrigin = "Anonymous";
    // alert(image1);
    let tensor = preprocessImage(image1);
    let prediction = await model.predict(tensor).data();
    let top10=Array.from(prediction)
        .map(function(p,i){
            return {
                probability: p,
                className: FOOD_CLASSES[i]
            };
        });
    alert(top10);

    var lab = [];
    var ser = [];

    var lab_rad = [];
    var ser_rad = [];

    top10.forEach(function(p){
        lab_rad.push(p.className);
        ser_rad.push(p.probability.toFixed(2)*100);
        // $("#prediction-list").append(`<li>${p.className}:${p.probability.toFixed(6)}</li>`);
    });

    top5 = top10.sort(function(a,b){
        return b.probability-a.probability;
    }).slice(0,5);

    // $("#prediction-list").empty();
    top5.forEach(function(p){
        lab.push(p.className);
        ser.push(p.probability.toFixed(2)*100);
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

// $("#predict-your").click(async function(){
//     counter +=3;
//     $(".predictions").prepend(`<h4>Image ${counter/3}</h2><div class="row text-center">
//     <div class="col-4" id="chart-${counter-2}"></div>
//     <div class="col-4" id="chart-${counter-1}"></div>
//     <div class="col-4" id="chart-${counter}"></div>
// </div>`)
//     let image= $('#selected-image').get(0);
//     let tensor = preprocessImage(image);
//     let prediction = await model.predict(tensor).data();
//     let top10=Array.from(prediction)
//                 .map(function(p,i){
//     return {
//         probability: p,
//         className: FOOD_CLASSES[i]
//     };
//     });
//
//     var lab = [];
//     var ser = [];
//
//     var lab_rad = [];
//     var ser_rad = [];
//
//     top10.forEach(function(p){
//         lab_rad.push(p.className);
//         ser_rad.push(p.probability.toFixed(2)*100);
//     });
//
//     top5 = top10.sort(function(a,b){
//         return b.probability-a.probability;
//     }).slice(0,5);
//
//     // $("#prediction-list").empty();
//     top5.forEach(function(p){
//         lab.push(p.className);
//         ser.push(p.probability.toFixed(2)*100);
//     });
//
//
//     var options = {
//         chart: {
//             width: 400,
//             type: 'donut',
//         },
//         labels: lab,
//         series: ser,
//         responsive: [{
//             breakpoint: 400,
//             options: {
//                 chart: {
//                     width: 200
//                 },
//                 legend: {
//                     position: 'bottom'
//                 }
//             }
//
//         }],
//     }
//
//     var options_rad = {
//         chart: {
//             height: 350,
//             type: 'radar',
//         },
//         series: [{
//             name: 'Food classification',
//             data: ser_rad,
//         }],
//         responsive: [{
//             breakpoint: 400,
//             options: {
//                 chart: {
//                     width: 200
//                 },
//                 legend: {
//                     position: 'bottom'
//                 }
//             }
//         }],
//         title: {
//             text: 'Radar Food Chart'
//         },
//         labels: lab_rad
//     }
//
//     var options_bar = {
//         chart: {
//             height: 250,
//             type: 'bar',
//         },
//         plotOptions: {
//             bar: {
//                 horizontal: true,
//             }
//         },
//         dataLabels: {
//             enabled: false
//         },
//         series: [{
//             data: ser
//         }],
//         xaxis: {
//             categories: lab,
//         }
//     }
//
//     var chart = new ApexCharts(
//         document.querySelector(`#chart-${counter-2}`),
//         options
//     );
//
//     chart.render();
//
//     var chart_rad = new ApexCharts(
//         document.querySelector(`#chart-${counter-1}`),
//         options_rad
//     );
//
//     chart_rad.render();
//
//     var chart_bar = new ApexCharts(
//         document.querySelector(`#chart-${counter}`),
//         options_bar
//     );
//
//     chart_bar.render();
//
// });


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