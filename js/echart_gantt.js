var ROOT_PATH = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';

var chartDom = document.getElementById('main');
chartDom.style.height = window.innerHeight - 50 +'px';
var myChart = echarts.init(chartDom);
var option;

var HEIGHT_RATIO = 0.6;
var DIM_CATEGORY_INDEX = 0;
var DIM_TIME_ARRIVAL = 1;
var DIM_TIME_DEPARTURE = 2;

var _rawData;

$.getJSON('../data/airport-schedule.json', function (rawData) {
    _rawData = rawData;
    myChart.setOption(option = makeOption());
});

function makeOption() {
    return {
        tooltip: {
        },
        animation: false,
        toolbox: {
            left: 20,
            top: 0,
            itemSize: 20,
            feature: {
            }
        },
        title: {
            text: 'Gantt of Airport Flight',
            left: 'center'
        },
        dataZoom: [{
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            height: 20,
            bottom: 0,
            start: 0,
            end: 26,
            showDetail: false
        }, {
            type: 'inside',
            id: 'insideX',
            xAxisIndex: 0,
            filterMode: 'weakFilter',
            start: 0,
            end: 26,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true
        }, {
            type: 'slider',
            yAxisIndex: 0,
            zoomLock: true,
            width: 10,
            right: 10,
            top: 70,
            bottom: 20,
            start: 95,
            end: 100,
            handleSize: 0,
            showDetail: false,
        }, {
            type: 'inside',
            id: 'insideY',
            yAxisIndex: 0,
            start: 95,
            end: 100,
            zoomOnMouseWheel: false,
            moveOnMouseMove: true,
            moveOnMouseWheel: true
        }],
        grid: {
            show: true,
            top: 70,
            bottom: 20,
            left: 100,
            right: 20,
            backgroundColor: '#fff',
            borderWidth: 0
        },
        xAxis: {
            type: 'time',
            position: 'top',
            splitLine: {
                lineStyle: {
                    color: ['#E9EDFF']
                }
            },
            axisLine: {
                show: false
            },
            axisTick: {
                lineStyle: {
                    color: '#929ABA'
                }
            },
            axisLabel: {
                color: '#929ABA',
                inside: false,
                align: 'center'
            }
        },
        yAxis: {
            axisTick: {show: false},
            splitLine: {show: false},
            axisLine: {show: false},
            axisLabel: {show: false},
            min: 0,
            max: _rawData.parkingApron.data.length
        },
        series: [{
            id: 'flightData',
            type: 'custom',
            renderItem: renderGanttItem,
            dimensions: _rawData.flight.dimensions,
            encode: {
                x: [DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE],
                y: DIM_CATEGORY_INDEX,
                tooltip: [DIM_CATEGORY_INDEX, DIM_TIME_ARRIVAL, DIM_TIME_DEPARTURE]
            },
            data: _rawData.flight.data
        }, {
            type: 'custom',
            renderItem: renderAxisLabelItem,
            dimensions: _rawData.parkingApron.dimensions,
            encode: {
                x: -1, // Then this series will not controlled by x.
                y: 0
            },
            data: _rawData.parkingApron.data.map(function (item, index) {
                return [index].concat(item);
            })
        }]
    };
}

function renderGanttItem(params, api) {
    var categoryIndex = api.value(DIM_CATEGORY_INDEX);
    var timeArrival = api.coord([api.value(DIM_TIME_ARRIVAL), categoryIndex]);
    var timeDeparture = api.coord([api.value(DIM_TIME_DEPARTURE), categoryIndex]);

    var barLength = timeDeparture[0] - timeArrival[0];
    // Get the heigth corresponds to length 1 on y axis.
    var barHeight = api.size([0, 1])[1] * HEIGHT_RATIO;
    var x = timeArrival[0];
    var y = timeArrival[1] - barHeight;

    var flightNumber = api.value(3) + '';
    var flightNumberWidth = echarts.format.getTextRect(flightNumber).width;
    var text = (barLength > flightNumberWidth + 40 && x + barLength >= 180)
        ? flightNumber : '';

    var rectNormal = clipRectByRect(params, {
        x: x, y: y, width: barLength, height: barHeight
    });
    var rectVIP = clipRectByRect(params, {
        x: x, y: y, width: (barLength) / 2, height: barHeight
    });
    var rectText = clipRectByRect(params, {
        x: x, y: y, width: barLength, height: barHeight
    });

    return {
        type: 'group',
        children: [{
            type: 'rect',
            ignore: !rectNormal,
            shape: rectNormal,
            style: api.style()
        }, {
            type: 'rect',
            ignore: !rectVIP && !api.value(4),
            shape: rectVIP,
            style: api.style({fill: '#ddb30b'})
        }, {
            type: 'rect',
            ignore: !rectText,
            shape: rectText,
            style: api.style({
                fill: 'transparent',
                stroke: 'transparent',
                text: text,
                textFill: '#fff'
            })
        }]
    };
}

function renderAxisLabelItem(params, api) {
    var y = api.coord([0, api.value(0)])[1];
    if (y < params.coordSys.y + 5) {
        return;
    }
    return {
        type: 'group',
        position: [
            10,
            y
        ],
        children: [{
            type: 'path',
            shape: {
                d: 'M0,0 L0,-20 L30,-20 C42,-20 38,-1 50,-1 L70,-1 L70,0 Z',
                x: 0,
                y: -20,
                width: 90,
                height: 20,
                layout: 'cover'
            },
            style: {
                fill: '#368c6c'
            }
        }, {
            type: 'text',
            style: {
                x: 24,
                y: -3,
                text: api.value(1),
                textVerticalAlign: 'bottom',
                textAlign: 'center',
                textFill: '#fff'
            }
        }, {
            type: 'text',
            style: {
                x: 75,
                y: -2,
                textVerticalAlign: 'bottom',
                textAlign: 'center',
                text: api.value(2),
                textFill: '#000'
            }
        }]
    };
}


function clipRectByRect(params, rect) {
    return echarts.graphic.clipRectByRect(rect, {
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
    });
}

option && myChart.setOption(option);
