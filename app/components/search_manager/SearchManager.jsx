// Libs
import React                        from 'react';
import firebase                     from 'firebase';
import uuid                         from 'node-uuid';
import {Tooltip, OverlayTrigger}    from 'react-bootstrap';
import update                       from 'react-addons-update';

// Files
import SearchAccordion              from './SearchAccordion.jsx';
import SearchHints                  from './SearchHints.jsx';
import SearchToggler                from './SearchToggler.jsx';
import ProjectSelector              from '../manage/ProjectSelector.jsx';

/**
 * TODO
 */
export default class SearchManager extends React.Component {
    state = {
        searchCategories: {
            general: false,
            artist : false,
            tag    : false,
            title  : false,
            time   : false,
            color  : false
        },
        accordion: {
            general : false,
            artist  : false,
            tag     : false,
            title   : false,
            time    : false,
            color   : false
        },
        allAccordion : false,
        artistNames  : [],
        clearable    : true,
        general: "",
        artist: "",
        title: "",
        tags: [],
        time: {
            day: {
                selected: false
            },
            week: {
                selected: false
            },
            range: {
                selected: false,
                from: "",
                to: ""
            },
        },
        suggestions: ["happy","sad", "insane", "membrane", "hydrophilic"],
        htmlColors: [
           {
              "name":"Black",
              "hex":"000000",
              "hue":0,
              "sat":0,
              "val":0
           },
           {
              "name":"Red",
              "hex":"FF0000",
              "hue":0,
              "sat":1,
              "val":1
           },
           {
              "name":"Gray",
              "hex":"808080",
              "hue":0,
              "sat":0,
              "val":0.5019607843137255
           },
           {
              "name":"White",
              "hex":"FFFFFF",
              "hue":0,
              "sat":0,
              "val":1
           },
           {
              "name":"Brown",
              "hex":"A52A2A",
              "hue":0,
              "sat":0.7454545454545455,
              "val":0.6470588235294118
           },
           {
              "name":"Dark Gray",
              "hex":"A9A9A9",
              "hue":0,
              "sat":0,
              "val":0.6627450980392157
           },
           {
              "name":"Fire Brick",
              "hex":"B22222",
              "hue":0,
              "sat":0.8089887640449438,
              "val":0.6980392156862745
           },
           {
              "name":"Dim Gray",
              "hex":"696969",
              "hue":0,
              "sat":0,
              "val":0.4117647058823529
           },
           {
              "name":"Rosy Brown",
              "hex":"BC8F8F",
              "hue":0,
              "sat":0.23936170212765961,
              "val":0.7372549019607844
           },
           {
              "name":"Snow",
              "hex":"FFFAFA",
              "hue":0,
              "sat":0.019607843137254943,
              "val":1
           },
           {
              "name":"White Smoke",
              "hex":"F5F5F5",
              "hue":0,
              "sat":0,
              "val":0.9607843137254902
           },
           {
              "name":" Indian Red",
              "hex":"CD5C5C",
              "hue":0,
              "sat":0.551219512195122,
              "val":0.803921568627451
           },
           {
              "name":"Light Coral",
              "hex":"F08080",
              "hue":0,
              "sat":0.4666666666666667,
              "val":0.9411764705882353
           },
           {
              "name":"Dark Red",
              "hex":"8B0000",
              "hue":0,
              "sat":1,
              "val":0.5450980392156862
           },
           {
              "name":"Light Gray",
              "hex":"D3D3D3",
              "hue":0,
              "sat":0,
              "val":0.8274509803921568
           },
           {
              "name":"Gainsboro",
              "hex":"DCDCDC",
              "hue":0,
              "sat":0,
              "val":0.8627450980392157
           },
           {
              "name":"Misty Rose",
              "hex":"FFE4E1",
              "hue":6.000000000000034,
              "sat":0.11764705882352944,
              "val":1
           },
           {
              "name":"Salmon",
              "hex":"FA8072",
              "hue":6.176470588235292,
              "sat":0.5439999999999999,
              "val":0.9803921568627451
           },
           {
              "name":"Tomato",
              "hex":"FF6347",
              "hue":9.130434782608695,
              "sat":0.7215686274509804,
              "val":1
           },
           {
              "name":"Dark Salmon",
              "hex":"E9967A",
              "hue":15.135135135135137,
              "sat":0.4763948497854077,
              "val":0.9137254901960784
           },
           {
              "name":"Coral",
              "hex":"FF7F50",
              "hue":16.114285714285714,
              "sat":0.6862745098039216,
              "val":1
           },
           {
              "name":"Orange Red",
              "hex":"FF4500",
              "hue":16.235294117647058,
              "sat":1,
              "val":1
           },
           {
              "name":"Light Salmon",
              "hex":"FFA07A",
              "hue":17.142857142857142,
              "sat":0.5215686274509803,
              "val":1
           },
           {
              "name":"Sienna",
              "hex":"A0522D",
              "hue":19.30434782608696,
              "sat":0.7187499999999999,
              "val":0.6274509803921569
           },
           {
              "name":"Sea Shell",
              "hex":"FFF5EE",
              "hue":24.705882352941195,
              "sat":0.06666666666666665,
              "val":1
           },
           {
              "name":"Saddle Brown",
              "hex":"8B4513",
              "hue":24.999999999999996,
              "sat":0.8633093525179856,
              "val":0.5450980392156862
           },
           {
              "name":"Chocolate",
              "hex":"D2691E",
              "hue":24.999999999999996,
              "sat":0.8571428571428571,
              "val":0.8235294117647058
           },
           {
              "name":"Sandy Brown",
              "hex":"F4A460",
              "hue":27.56756756756757,
              "sat":0.6065573770491803,
              "val":0.9568627450980393
           },
           {
              "name":"Peach Puff",
              "hex":"FFDAB9",
              "hue":28.285714285714278,
              "sat":0.27450980392156865,
              "val":1
           },
           {
              "name":"Peru",
              "hex":"CD853F",
              "hue":29.577464788732396,
              "sat":0.6926829268292682,
              "val":0.803921568627451
           },
           {
              "name":"Linen",
              "hex":"FAF0E6",
              "hue":30,
              "sat":0.07999999999999995,
              "val":0.9803921568627451
           },
           {
              "name":"Bisque",
              "hex":"FFE4C4",
              "hue":32.54237288135594,
              "sat":0.2313725490196078,
              "val":1
           },
           {
              "name":"Dark Orange",
              "hex":"FF8C00",
              "hue":32.94117647058824,
              "sat":1,
              "val":1
           },
           {
              "name":"Burly Wood",
              "hex":"DEB887",
              "hue":33.79310344827586,
              "sat":0.3918918918918919,
              "val":0.8705882352941177
           },
           {
              "name":"Antique White",
              "hex":"FAEBD7",
              "hue":34.28571428571427,
              "sat":0.13999999999999996,
              "val":0.9803921568627451
           },
           {
              "name":"Tan",
              "hex":"D2B48C",
              "hue":34.2857142857143,
              "sat":0.33333333333333326,
              "val":0.8235294117647058
           },
           {
              "name":"Navajo White",
              "hex":"FFDEAD",
              "hue":35.853658536585364,
              "sat":0.32156862745098036,
              "val":1
           },
           {
              "name":"Blanched Almond",
              "hex":"FFEBCD",
              "hue":35.99999999999998,
              "sat":0.196078431372549,
              "val":1
           },
           {
              "name":"Papaya Whip",
              "hex":"FFEFD5",
              "hue":37.14285714285714,
              "sat":0.16470588235294115,
              "val":1
           },
           {
              "name":"Moccasin",
              "hex":"FFE4B5",
              "hue":38.10810810810811,
              "sat":0.2901960784313725,
              "val":1
           },
           {
              "name":"Orange",
              "hex":"FFA500",
              "hue":38.82352941176471,
              "sat":1,
              "val":1
           },
           {
              "name":"Wheat",
              "hex":"F5DEB3",
              "hue":39.09090909090909,
              "sat":0.2693877551020409,
              "val":0.9607843137254902
           },
           {
              "name":"Old Lace",
              "hex":"FDF5E6",
              "hue":39.130434782608695,
              "sat":0.09090909090909093,
              "val":0.9921568627450981
           },
           {
              "name":"Floral White",
              "hex":"FFFAF0",
              "hue":39.999999999999964,
              "sat":0.05882352941176472,
              "val":1
           },
           {
              "name":"Dark Dolden Rod",
              "hex":"B8860B",
              "hue":42.65895953757225,
              "sat":0.9402173913043479,
              "val":0.7215686274509804
           },
           {
              "name":"Golden Rod",
              "hex":"DAA520",
              "hue":42.903225806451616,
              "sat":0.8532110091743119,
              "val":0.8549019607843137
           },
           {
              "name":"Cornsilk",
              "hex":"FFF8DC",
              "hue":47.999999999999986,
              "sat":0.13725490196078427,
              "val":1
           },
           {
              "name":"Light Golden Rod",
              "hex":"EEDD82",
              "hue":50.55555555555556,
              "sat":0.45378151260504207,
              "val":0.9333333333333333
           },
           {
              "name":"Gold",
              "hex":"FFD700",
              "hue":50.588235294117645,
              "sat":1,
              "val":1
           },
           {
              "name":"Lemon Chiffon",
              "hex":"FFFACD",
              "hue":53.999999999999986,
              "sat":0.196078431372549,
              "val":1
           },
           {
              "name":"Khaki",
              "hex":"F0E68C",
              "hue":54,
              "sat":0.41666666666666663,
              "val":0.9411764705882353
           },
           {
              "name":"Pale Golden Rod",
              "hex":"EEE8AA",
              "hue":54.70588235294117,
              "sat":0.28571428571428575,
              "val":0.9333333333333333
           },
           {
              "name":"Dark Khaki",
              "hex":"BDB76B",
              "hue":55.609756097560975,
              "sat":0.4338624338624339,
              "val":0.7411764705882353
           },
           {
              "name":"Yellow",
              "hex":"FFFF00",
              "hue":60,
              "sat":1,
              "val":1
           },
           {
              "name":"Olive",
              "hex":"808000",
              "hue":60,
              "sat":1,
              "val":0.5019607843137255
           },
           {
              "name":"Beige",
              "hex":"F5F5DC",
              "hue":60,
              "sat":0.10204081632653059,
              "val":0.9607843137254902
           },
           {
              "name":"Light Golden Rod Yellow",
              "hex":"FAFAD2",
              "hue":60,
              "sat":0.16,
              "val":0.9803921568627451
           },
           {
              "name":"Light Yellow",
              "hex":"FFFFE0",
              "hue":60,
              "sat":0.1215686274509804,
              "val":1
           },
           {
              "name":"Ivory",
              "hex":"FFFFF0",
              "hue":60,
              "sat":0.05882352941176472,
              "val":1
           },
           {
              "name":"Olive Drab",
              "hex":"6B8E23",
              "hue":79.62616822429906,
              "sat":0.7535211267605634,
              "val":0.5568627450980392
           },
           {
              "name":"Yellow Green",
              "hex":"9ACD32",
              "hue":79.74193548387098,
              "sat":0.7560975609756098,
              "val":0.803921568627451
           },
           {
              "name":"Dark Olive Green",
              "hex":"556B2F",
              "hue":82,
              "sat":0.5607476635514018,
              "val":0.4196078431372549
           },
           {
              "name":"Green Yellow",
              "hex":"ADFF2F",
              "hue":83.65384615384615,
              "sat":0.8156862745098039,
              "val":1
           },
           {
              "name":"Chartreuse",
              "hex":"7FFF00",
              "hue":90.11764705882354,
              "sat":1,
              "val":1
           },
           {
              "name":"Lawn Green",
              "hex":"7CFC00",
              "hue":90.47619047619048,
              "sat":1,
              "val":0.9882352941176471
           },
           {
              "name":"Green",
              "hex":"008000",
              "hue":120,
              "sat":1,
              "val":0.5019607843137255
           },
           {
              "name":"Forest Green",
              "hex":"228B22",
              "hue":120,
              "sat":0.7553956834532375,
              "val":0.5450980392156862
           },
           {
              "name":"Pale Green",
              "hex":"98FB98",
              "hue":120,
              "sat":0.3944223107569721,
              "val":0.984313725490196
           },
           {
              "name":"Honey Dew",
              "hex":"F0FFF0",
              "hue":120,
              "sat":0.05882352941176472,
              "val":1
           },
           {
              "name":"Dark Green",
              "hex":"006400",
              "hue":120,
              "sat":1,
              "val":0.39215686274509803
           },
           {
              "name":"Dark Sea Green",
              "hex":"8FBC8F",
              "hue":120,
              "sat":0.23936170212765961,
              "val":0.7372549019607844
           },
           {
              "name":"Lime Green",
              "hex":"32CD32",
              "hue":120,
              "sat":0.7560975609756098,
              "val":0.803921568627451
           },
           {
              "name":"Sea Green",
              "hex":"2E8B57",
              "hue":146.45161290322582,
              "sat":0.6690647482014388,
              "val":0.5450980392156862
           },
           {
              "name":"Medium Sea Green",
              "hex":"3CB371",
              "hue":146.72268907563026,
              "sat":0.664804469273743,
              "val":0.7019607843137254
           },
           {
              "name":"Spring Green",
              "hex":"00FF7F",
              "hue":149.88235294117646,
              "sat":1,
              "val":1
           },
           {
              "name":"Mint Cream",
              "hex":"F5FFFA",
              "hue":149.99999999999991,
              "sat":0.039215686274509776,
              "val":1
           },
           {
              "name":"Medium Spring Green",
              "hex":"00FA9A",
              "hue":156.96,
              "sat":1,
              "val":0.9803921568627451
           },
           {
              "name":"Medium Aqua Marine",
              "hex":"66CDAA",
              "hue":159.61165048543688,
              "sat":0.5024390243902439,
              "val":0.803921568627451
           },
           {
              "name":"Aquamarine",
              "hex":"7FFFD4",
              "hue":159.84375,
              "sat":0.5019607843137255,
              "val":1
           },
           {
              "name":"Turquoise",
              "hex":"40E0D0",
              "hue":174,
              "sat":0.7142857142857143,
              "val":0.8784313725490196
           },
           {
              "name":"Light Sea Green",
              "hex":"20B2AA",
              "hue":176.7123287671233,
              "sat":0.8202247191011236,
              "val":0.6980392156862745
           },
           {
              "name":"Medium Turquoise",
              "hex":"48D1CC",
              "hue":177.8102189781022,
              "sat":0.6555023923444976,
              "val":0.8196078431372549
           },
           {
              "name":"Cyan",
              "hex":"00FFFF",
              "hue":180,
              "sat":1,
              "val":1
           },
           {
              "name":"Dark Cyan",
              "hex":"008B8B",
              "hue":180,
              "sat":1,
              "val":0.5450980392156862
           },
           {
              "name":"Light Cyan",
              "hex":"E0FFFF",
              "hue":180,
              "sat":0.1215686274509804,
              "val":1
           },
           {
              "name":"Dark Slate Gray",
              "hex":"2F4F4F",
              "hue":180,
              "sat":0.4050632911392405,
              "val":0.30980392156862746
           },
           {
              "name":"Aqua",
              "hex":"00FFFF",
              "hue":180,
              "sat":1,
              "val":1
           },
           {
              "name":"Pale Turquoise",
              "hex":"AFEEEE",
              "hue":180,
              "sat":0.2647058823529412,
              "val":0.9333333333333333
           },
           {
              "name":"Azure",
              "hex":"F0FFFF",
              "hue":180,
              "sat":0.05882352941176472,
              "val":1
           },
           {
              "name":"Teal",
              "hex":"008080",
              "hue":180,
              "sat":1,
              "val":0.5019607843137255
           },
           {
              "name":"Dark Turquoise",
              "hex":"00CED1",
              "hue":180.86124401913875,
              "sat":1,
              "val":0.8196078431372549
           },
           {
              "name":"Cadet Blue",
              "hex":"5F9EA0",
              "hue":181.84615384615384,
              "sat":0.40625,
              "val":0.6274509803921569
           },
           {
              "name":"Powder Blue",
              "hex":"B0E0E6",
              "hue":186.66666666666669,
              "sat":0.2347826086956522,
              "val":0.9019607843137255
           },
           {
              "name":"Light Blue",
              "hex":"ADD8E6",
              "hue":194.73684210526318,
              "sat":0.24782608695652172,
              "val":0.9019607843137255
           },
           {
              "name":"Deep Sky Blue",
              "hex":"00BFFF",
              "hue":195.05882352941177,
              "sat":1,
              "val":1
           },
           {
              "name":"Sky Blue",
              "hex":"87CEEB",
              "hue":197.39999999999998,
              "sat":0.42553191489361697,
              "val":0.9215686274509803
           },
           {
              "name":"Light Sky Blue",
              "hex":"87CEFA",
              "hue":202.95652173913044,
              "sat":0.45999999999999996,
              "val":0.9803921568627451
           },
           {
              "name":"Steel Blue",
              "hex":"4682B4",
              "hue":207.27272727272728,
              "sat":0.611111111111111,
              "val":0.7058823529411765
           },
           {
              "name":"Alice Blue",
              "hex":"F0F8FF",
              "hue":208,
              "sat":0.05882352941176472,
              "val":1
           },
           {
              "name":"Dodger Blue",
              "hex":"1E90FF",
              "hue":209.6,
              "sat":0.8823529411764706,
              "val":1
           },
           {
              "name":"Light Slate Gray",
              "hex":"778899",
              "hue":210,
              "sat":0.22222222222222218,
              "val":0.6
           },
           {
              "name":"Slate Gray",
              "hex":"708090",
              "hue":210,
              "sat":0.2222222222222222,
              "val":0.5647058823529412
           },
           {
              "name":"Light Steel Blue",
              "hex":"B0C4DE",
              "hue":213.91304347826085,
              "sat":0.20720720720720723,
              "val":0.8705882352941177
           },
           {
              "name":"Cornflower Blue",
              "hex":"6495ED",
              "hue":218.54014598540147,
              "sat":0.5780590717299579,
              "val":0.9294117647058824
           },
           {
              "name":"Royal Blue",
              "hex":"4169E1",
              "hue":225,
              "sat":0.7111111111111111,
              "val":0.8823529411764706
           },
           {
              "name":"Navy",
              "hex":"000080",
              "hue":240,
              "sat":1,
              "val":0.5019607843137255
           },
           {
              "name":"Lavender",
              "hex":"E6E6FA",
              "hue":240,
              "sat":0.07999999999999995,
              "val":0.9803921568627451
           },
           {
              "name":"Blue",
              "hex":"0000FF",
              "hue":240,
              "sat":1,
              "val":1
           },
           {
              "name":"Midnight Blue",
              "hex":"191970",
              "hue":240,
              "sat":0.7767857142857143,
              "val":0.4392156862745098
           },
           {
              "name":"Medium Blue",
              "hex":"0000CD",
              "hue":240,
              "sat":1,
              "val":0.803921568627451
           },
           {
              "name":"Ghost White",
              "hex":"F8F8FF",
              "hue":240,
              "sat":0.027450980392156876,
              "val":1
           },
           {
              "name":"Dark Blue",
              "hex":"00008B",
              "hue":240,
              "sat":1,
              "val":0.5450980392156862
           },
           {
              "name":"Slate Blue",
              "hex":"6A5ACD",
              "hue":248.34782608695653,
              "sat":0.5609756097560975,
              "val":0.803921568627451
           },
           {
              "name":"Light Slate",
              "hex":"8470FF",
              "hue":248.3916083916084,
              "sat":0.5607843137254902,
              "val":1
           },
           {
              "name":"Dark Slate Blue",
              "hex":"483D8B",
              "hue":248.46153846153845,
              "sat":0.5611510791366905,
              "val":0.5450980392156862
           },
           {
              "name":"Medium Slate Blue",
              "hex":"7B68EE",
              "hue":248.50746268656718,
              "sat":0.5630252100840336,
              "val":0.9333333333333333
           },
           {
              "name":"Medium Purple",
              "hex":"9370DB",
              "hue":259.6261682242991,
              "sat":0.4885844748858447,
              "val":0.8588235294117647
           },
           {
              "name":"Rebecca Purple",
              "hex":"663399",
              "hue":270,
              "sat":0.6666666666666666,
              "val":0.6
           },
           {
              "name":"Blue Violet",
              "hex":"8A2BE2",
              "hue":271.1475409836066,
              "sat":0.8097345132743362,
              "val":0.8862745098039215
           },
           {
              "name":"Indigo",
              "hex":"4B0082",
              "hue":274.61538461538464,
              "sat":1,
              "val":0.5098039215686274
           },
           {
              "name":"Purple",
              "hex":"A020F0",
              "hue":276.9230769230769,
              "sat":0.8666666666666667,
              "val":0.9411764705882353
           },
           {
              "name":"Dark Orchid",
              "hex":"9932CC",
              "hue":280.12987012987014,
              "sat":0.7549019607843138,
              "val":0.8
           },
           {
              "name":"Dark Violet",
              "hex":"9400D3",
              "hue":282.08530805687207,
              "sat":1,
              "val":0.8274509803921568
           },
           {
              "name":"Medium Orchid",
              "hex":"BA55D3",
              "hue":288.0952380952381,
              "sat":0.5971563981042654,
              "val":0.8274509803921568
           },
           {
              "name":"Dark Magenta",
              "hex":"8B008B",
              "hue":300,
              "sat":1,
              "val":0.5450980392156862
           },
           {
              "name":"Violet",
              "hex":"EE82EE",
              "hue":300,
              "sat":0.45378151260504207,
              "val":0.9333333333333333
           },
           {
              "name":"Plum",
              "hex":"DDA0DD",
              "hue":300,
              "sat":0.27601809954751133,
              "val":0.8666666666666667
           },
           {
              "name":"Magenta",
              "hex":"FF00FF",
              "hue":300,
              "sat":1,
              "val":1
           },
           {
              "name":"Thistle",
              "hex":"D8BFD8",
              "hue":300,
              "sat":0.11574074074074073,
              "val":0.8470588235294118
           },
           {
              "name":"Orchid",
              "hex":"DA70D6",
              "hue":302.2641509433962,
              "sat":0.4862385321100917,
              "val":0.8549019607843137
           },
           {
              "name":"Violet Red",
              "hex":"D02090",
              "hue":321.8181818181818,
              "sat":0.8461538461538461,
              "val":0.8156862745098039
           },
           {
              "name":"Medium Violet Red",
              "hex":"C71585",
              "hue":322.24719101123594,
              "sat":0.8944723618090452,
              "val":0.7803921568627451
           },
           {
              "name":"Deep Pink",
              "hex":"FF1493",
              "hue":327.5744680851064,
              "sat":0.9215686274509804,
              "val":1
           },
           {
              "name":"Hot Pink",
              "hex":"FF69B4",
              "hue":330,
              "sat":0.5882352941176471,
              "val":1
           },
           {
              "name":"Maroon",
              "hex":"B03060",
              "hue":337.5,
              "sat":0.7272727272727273,
              "val":0.6901960784313725
           },
           {
              "name":"Lavender Blush",
              "hex":"FFF0F5",
              "hue":339.99999999999994,
              "sat":0.05882352941176472,
              "val":1
           },
           {
              "name":"Pale Violet Red",
              "hex":"DB7093",
              "hue":340.3738317757009,
              "sat":0.4885844748858447,
              "val":0.8588235294117647
           },
           {
              "name":"Crimson",
              "hex":"DC143C",
              "hue":348,
              "sat":0.9090909090909092,
              "val":0.8627450980392157
           },
           {
              "name":"Pink",
              "hex":"FFC0CB",
              "hue":349.5238095238095,
              "sat":0.24705882352941178,
              "val":1
           },
           {
              "name":"Light Pink",
              "hex":"FFB6C1",
              "hue":350.95890410958907,
              "sat":0.28627450980392155,
              "val":1
           }
        ],
        searchColors: {
            one: {
                    number: 0,
                    hex: "#000000"
                },
            two: {
                    number: 0,
                    hex: "#000000"
                },
            three: {
                    number: 0,
                    hex: "#000000"
                }
        }

    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        console.log("-----SearchManager");
    }

    render() {
        return this.manager();
    }

    componentDidMount() {
        console.log("+++++SearchManager");
    }

    componentWillReceiveProps(nextProps) {

    }

// ============= Flow Control ===============

    manager = () => {
        const addAlbumTooltip = (
            <Tooltip
                id="add-album-tooltip"
                className="tooltip">
                Create new album
            </Tooltip>
        );

        let containerWidth = {
            height: window.innerHeight - 60,
            width: window.innerWidth * 0.4 - 40,
            maxWidth: "400px"
        }

        const openManager = {
            height: window.innerHeight - 60,
            right: 0
        }

        let managerWidth = 200; // Magic Number to Instantiate

        if (document.getElementsByClassName('search-manager')[0]) {
            managerWidth = document.getElementsByClassName('search-manager')[0].offsetWidth;
        }

        const closedManager = {
            height: window.innerHeight - 60,
            right: -1 * managerWidth + 40
        }

        return (
            <section
                style={this.props.managerIsOpen ? openManager: closedManager}
                className="search-manager">
                <SearchToggler
                    background      ={"#323232"}
                    height          ={window.innerHeight - 60}
                    managerIsOpen   ={this.props.managerIsOpen}
                    toggleManager   ={this.props.toggleManager}/>
                <div
                    style={containerWidth}
                    className="search-manager-container">
                    <ProjectSelector
                        addNewProject={this.props.addNewProject}
                        currentProject={this.props.currentProject}
                        changeProject={this.props.changeProject}
                        projects={this.props.projects} />
                    <SearchHints
                        searchCategories={this.state.searchCategories} />
                    <SearchAccordion
                        accordion={this.state.accordion}
                        toggleAccordion={this.toggleAccordion}
                        doQuery={this.props.doQuery}
                        toggleSearchCategory={this.toggleSearchCategory}
                        artistNames={this.state.artistNames}
                        clearable={this.state.clearable}
                        general={this.state.general}
                        artist={this.state.artist}
                        title={this.state.title}
                        tags={this.state.tags}
                        time={this.state.time}
                        suggestions={this.state.suggestions}
                        htmlColors={this.state.htmlColors}
                        selectableColors={this.state.selectableColors}
                        searchColors={this.state.searchColors}
                        artistChange={this.artistChange}
                        generalChange={this.generalChange}
                        titleChange={this.titleChange}
                        timeChange={this.timeChange}
                        handleDrag={this.handleDrag}
                        handleAddition={this.handleAddition}
                        handleDelete={this.handleDelete}
                        colorChange={this.colorChange}
                        varyColor={this.varyColor}
                        setSearchColors={this.setSearchColors} />
                    <div className="search-tools">
                        <div
                            onClick={this.toggleAllAccordion}
                            className="search-tool right-border"
                            title="Open All Search Fields">
                            <img src="assets/images/icons/open-accordion.svg" />
                            <h4 className="search-tool-writing">
                                Open
                            </h4>
                        </div>
                        <div
                            onClick={this.clearAllSearch}
                            className="search-tool"
                            title="Clear All Search Fields">
                            <img src="assets/images/icons/cross.svg" />
                            <h4 className="search-tool-writing">
                                Clear
                            </h4>
                        </div>
                    </div>
                    <div className="search-button"
                         onClick={this.megaSearch}>
                        <h3>SEARCH</h3>
                    </div>
                </div>
            </section>
        );
    };

// ============= Methods ===============

    /**
     * TODO
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    toggleAccordion = (item) => {
        let accordion   = this.state.accordion;
        accordion[item] = !accordion[item];
        this.setState({
            accordion: accordion
        });
    }

    /**
     * [toggleAllAccordion description]
     * @return {[type]} [description]
     */
    toggleAllAccordion = () => {
        let allAccordion = this.state.allAccordion;

        let accordion   = {
            general : !allAccordion,
            artist  : !allAccordion,
            tag     : !allAccordion,
            title   : !allAccordion,
            time    : !allAccordion,
            color   : !allAccordion,
        };

        this.setState({
            accordion: accordion,
            allAccordion: !allAccordion
        });
    }

    /**
     * Removes all data in the search accordion
     */
    clearAllSearch = () => {
        // Turn off search hints
        let searchCategories = this.state.searchCategories;

        for (let category in searchCategories) {
            searchCategories[category] = false;
        }

        let accordion = this.state.accordion;

        for (let field in accordion) {
            accordion[field] = false;
        }

        // Clear time
        let times = document.getElementsByName("time");
        for (let i=0 ; i< times.length; i++) {
            times[i].checked = false;
        }

        let timeFrom = document.getElementById("search-time-from");
        timeFrom.value = "";
        let timeTo = document.getElementById("search-time-to");
        timeTo.value = "";

        // Clear general
        let general = document.getElementById("search-general");
        general.value = "";

        // Clear title
        let  title = document.getElementById("search-title");
        title.value = "";

        // Reset color ranges
        let  rangeOne = document.getElementById("colorRange-one");
        let  rangeTwo = document.getElementById("colorRange-two");
        let  rangeThree = document.getElementById("colorRange-three");
        rangeOne.value = 0;
        rangeTwo.value = 0;
        rangeThree.value = 0;

        this.setState({
            general: "",
            title: "",
            artist: "",
            tags: [],
            searchColors: {
                one: {
                        number: 0,
                        hex: "#000000"
                    },
                two: {
                        number: 0,
                        hex: "#000000"
                    },
                three: {
                        number: 0,
                        hex: "#000000"
                    }
            },
            accordion: accordion,
            searchCategories: searchCategories
        });

    }

    /**
     * [TODO toggleSearchCategory description]
     * @param  {String} category [description]
     * @param  {Boolean} bool     [description]
     */
    toggleSearchCategory = (category, bool) => {
        let searchCategories = this.state.searchCategories;
        searchCategories[category] = bool;

        this.setState({
            searchCategories: searchCategories
        });

        console.log("Set it in State searchManager");;
    }

    /**
     * [generalChange description] ??
     * @param  {[type]} general [description]
     * @param  {HTML event} e       [description]
     */
    generalChange = (general, e) => {
        console.log(e);

        // Toggles Search Hint
        if (general.length) {
            this.toggleSearchCategory("general", true);
        } else {
            this.toggleSearchCategory("general", false);
        }

        if (e.key === "Enter") {
            console.log(">>",general);
            this.setState({
                general: general
            });

            this.props.doQuery(general);

            let message = "Performing your search. Results will arrive shortly...";
            this.props.sendToSnackbar(message);
        }
    }

    /**
     * [artistChange description]
     * @param  {[type]} artist [description]
     */
    artistChange = (artist) => {
        console.log("Entered artistChange");
        this.setState({
            artist: artist
        });

        // Toggles Search Hint
        if (artist) {
            this.toggleSearchCategory("artist", true);
        } else {
            this.toggleSearchCategory("artist", false);
        }
    }

    /**
     * [titleChange description] what is a title?
     * @param  {String} title [description]
     */
    titleChange = (title) => {
        this.setState({
            title: title
        });

        // Toggles Search Hint
        if (title.length) {
            this.toggleSearchCategory("title", true);
        } else {
            this.toggleSearchCategory("title", false);
        }
    }

    timeChange = (time) => {
        this.setState({
            time: time
        });
    }

    handleDelete = (i) => {
        let tags = this.state.tags;
        tags.splice(i, 1);
        this.setState({tags: tags});

        // Toggles Search Hint
        if (this.state.tags.length > 0) {
            this.toggleSearchCategory("tag", true);
        } else {
            this.toggleSearchCategory("tag", false);
        }
    }

    handleAddition = (tag) => {
        let tags = this.state.tags;
        tags.push({
            id: tags.length + 1,
            text: tag
        });

        this.setState({tags: tags});
        console.log(this.state.tags);

        // Toggles Search Hint
        if (this.state.tags.length > 0) {
            this.toggleSearchCategory("tag", true);
        } else {
            this.toggleSearchCategory("tag", false);
        }
    }

    handleDrag = (tag, currPos, newPos) => {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    }

    colorChange = (searchColors) => {

        this.setState({
            searchColors: searchColors
        });
    }


    setSearchColors = (searchColors) => {
        this.setState({
            searchColors: searchColors
        });
    }

    /**
     * [TODO megaSearch description]
     */
    megaSearch = () => {
        const general = String(document.getElementById("search-general").value || '').trim();
        const title   = String(document.getElementById("search-title").value || '').trim();
        const artist  = String(document.getElementById("search-artist").value || '').trim();

        // const artist  = String(this.state.artist || '').trim();

        let fields = {};
        if (this.state.searchCategories.title && title.length > 0)
            fields.title = title;
        if (this.state.searchCategories.artist && artist.length > 0)
            fields.artist = artist;
        if (this.state.searchCategories.color) {
            fields.color_list = [this.state.searchColors.one.hex,
                                 this.state.searchColors.two.hex,
                                 this.state.searchColors.three.hex];
        }
        if (this.state.searchCategories.tag) {
            fields.text_tag_list = this.state.tags;
        }

        if (general.length === 0 && fields === {})
            return;

        console.log('Megasearch: ', general, fields);
        this.props.doQuery(general, fields);

        let message = "Performing your search. Results will arrive shortly...";
        this.props.sendToSnackbar(message);
    }
}
