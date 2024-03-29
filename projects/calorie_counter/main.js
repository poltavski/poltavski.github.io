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

$("#image-selector").change(function () {
    let reader = new FileReader();

    reader.onload = function () {
        // console.log(reader.result)
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        $("#prediction-list").empty();
    }
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
});

// var script = document.createElement("script");
// script.type = 'text/javascript';
// script.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest';
// document.head.appendChild(script);

let model;

async function loadModel() {

    // model=await tf.loadLayersModel('mobilenet/model.json');
    // model = await tf.loadLayersModel('model/model.json');
    model = await tf.loadLayersModel('https://poltavski.github.io/projects/multilabel/model/model.json');
    // model.summary();

    // $('.progress-bar').hide();
}

loadModel();
// $('.progress-bar').show();

var imageUrl;
var counter = 0;
$("#predict-button").click(async function () {
    counter += 3;
    $(".predictions").prepend(`
    <div class="row text-center">
        <div class="col-5">
            <div class="row">
                <div class="col-12" id="chart-${counter - 2}"></div>
                <div class="col-12" id="chart-${counter}"></div>
            </div>
        </div>
        <div class="col-7" id="chart-${counter - 1}"></div>
    </div>`
    );
    $('.food-pred').slick({
        centerMode: true,
        centerPadding: '60px',
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            },
            {
                breakpoint: 480,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: '40px',
                    slidesToShow: 1
                }
            }
        ]
    });
    let image = ($('.owl-item.big > div > div > img').get(0)); //.find('.sl-img'))
    let image_src = image.src
    // TODO: request Calorie Counter API for Image Bytes
    var urlLabel = "https://cc-prod-dvzsqhul3a-lm.a.run.app/image/label/url?url=" + image_src + "&percentage=false"
    var urlMask = "https://cc-prod-dvzsqhul3a-lm.a.run.app/image/mask/url?url=" + image_src + "&food_restriction=false"
    var food_classes = []
    var food_preds = []
    await fetch(urlLabel, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        credentials: 'omit', // include, *same-origin, omit
    }).then((data) => {
        if (data.status === 200) {
            data.json().then((jsonObj) => {
                Object.entries(jsonObj).forEach((entry) => {
                    const [key, value] = entry;
                    food_classes.push(key)
                    food_preds.push(value*100)
                });
            });
        }
    });

    await fetch(urlMask, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        credentials: 'omit', // include, *same-origin, omit
    }).then((data) => {
        if (data.status === 200) {
            data.blob().then((buf) => {
                var blob = new Blob([buf], {type: "image/jpeg"});
                var urlCreator = window.URL || window.webkitURL;
                imageUrl = urlCreator.createObjectURL(blob);
                $(`#chart-${counter - 2}`).html(`<img width="400px" src=${imageUrl}>`);
            });
        }
    });


    let tensor = preprocessImage(image);
    let prediction = await model.predict(tensor).data();
    // alert(prediction);
    let top10 = Array.from(prediction)
        .map(function (p, i) {
            return {
                probability: p,
                className: FOOD_CLASSES[i]
            };
        });
    // alert(top10);

    var labels = [];
    var series = [];

    // var lab_rad = [];
    // var ser_rad = [];
    //
    // top10.forEach(function(p){
    //     lab_rad.push(p.className);
    //     ser_rad.push(p.probability.toFixed(2)*100);
    //     // $("#prediction-list").append(`<li>${p.className}:${p.probability.toFixed(6)}</li>`);
    // });

    // top5 = top10.sort(function(a,b){
    //     return b.probability-a.probability;
    // }).slice(0,5);

    // $("#prediction-list").empty();
    top10.forEach(function (p) {
        labels.push(p.className);
        series.push(p.probability.toFixed(2) * 100);
    });
    // Draw ApexCharts
    var options_bar = {
        chart: {
            width: 400,
            height: 300,
            type: 'bar',
        },
        legend: {
            show: false,
            position: 'bottom',
            horizontalAlign: 'center',
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true
            },
        },
        // labels: food_classes,
        series: [{
            data:food_preds
        }],
        plotOptions: {
            bar: {
                barHeight: '100%',
                distributed: true,
                horizontal: true,
                dataLabels: {
                    position: 'bottom',
                    show: false,
                },
            }
        },
        // colors: ['#33b2df', '#546E7A', '#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4', '#90ee7e',
        //     '#f48024', '#69d2e7'
        // ],
        dataLabels: {
        enabled: true,
            textAnchor: 'start',
            style: {
            colors: ['#000']
            },
            formatter: function (val, opt) {
                return opt.w.globals.labels[opt.dataPointIndex] + ":  " + Math.round(val) + "%"
            },
            offsetX: 170,
            dropShadow: {
                enabled: true,
                color: '#fff',
            }
         },
        stroke: {
            width: 1,
                colors: ['#fff']
        },
        xaxis: {
            categories: food_classes,
            min: 0,
            max: 100,
        },
        yaxis: {
            labels: {
                show: false
            }
        },
        tooltip: {
            theme: 'dark',
                x: {
                show: false
            },
            y: {
                title: {
                    formatter: function () {
                        return ''
                    }
                }
            }
        }
    };
    var chart_bar = new ApexCharts(document.querySelector(`#chart-${counter}`), options_bar);
    chart_bar.render();

    var options_circle = {
        series: series,
        chart: {
            width: 600,
            height: 800,
            type: 'radialBar',
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'center',
            onItemClick: {
                toggleDataSeries: true
            },
            onItemHover: {
                highlightDataSeries: true

            },
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'Average value',
                    }
                }
            }
        },
        labels: labels,
    };
    var chart_circle = new ApexCharts(
        document.querySelector(`#chart-${counter - 1}`),
        options_circle
    );
    chart_circle.render();
    // Show element
    // $(`#chart-${counter-2}`).html($itemBig);
    // $(`#chart-${counter-2}`).attr('src', imageUrl);
});

function preprocessImage(image) {
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([224, 224])
        .toFloat();//.sub(meanImageNetRGB)
    let meanImageNetRGB = tf.tensor1d([51.072815, 51.072815, 51.072815]);
    let STD = tf.tensor1d([108.75629, 92.98068, 85.61884]);
    return tensor.sub(meanImageNetRGB)
        .div(STD)
        .expandDims();
}