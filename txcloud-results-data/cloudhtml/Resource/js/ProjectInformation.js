// 地图样式json
var mapjsonstyle =[
          {
                    "featureType": "land",
                    "elementType": "all",
                    "stylers": {
                              "color": "#eef3ec"
                    }
          },
          {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": {
                              "color": "#caddf2"
                    }
          },
          {
                    "featureType": "green",
                    "elementType": "all",
                    "stylers": {
                              "color": "#d4efd5"
                    }
          },
          {
                    "featureType": "manmade",
                    "elementType": "all",
                    "stylers": {
                              "color": "#dfe1d2"
                    }
          },
          {
                    "featureType": "building",
                    "elementType": "all",
                    "stylers": {
                              "color": "#dfe1d2"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "all",
                    "stylers": {
                              "color": "#f8fffb"
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#f2e6ac",
                              "weight": "1"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#f8fef8"
                    }
          },
          {
                    "featureType": "arterial",
                    "elementType": "geometry.stroke",
                    "stylers": {
                              "color": "#e5ece4"
                    }
          },
          {
                    "featureType": "railway",
                    "elementType": "geometry.fill",
                    "stylers": {
                              "color": "#e5ece4",
                              "lightness": 100,
                              "saturation": -100
                    }
          },
          {
                    "featureType": "highway",
                    "elementType": "labels.text.fill",
                    "stylers": {}
          }
]

// 楼盘概况监控
var cacheDatas = {
    // 数据实时监控
    DataMonitorLine: { IsExists: false, Data: {} },
    // 竞争楼盘实时监控
    ContentProjectMonitor: { IsExists: false, Data: {} },
    // 用户来源监控
    EnterPath: { IsExists: false, Data: {} },
    // 用户偏好
    UserPrefer: { IsExists: false, Data: {} },
    // 关键词
    KeyWord: { IsExists: false, Data: {} },
    // 数据实时监测
    DataMonitorMap: { IsExists: false, Data: {} }
};
var urlstr = "Resource/json/";
var hz = ".json";
// 用于Resize事件
var timer = 0;
// 页面模式（0：小图 1：大图）
var pageMode = 0;
// 当前是哪个模块放大（A：数据实时监控Line B：竞争楼盘实时监控 C：用户浏览路径监控 D：用户偏好 E：关键词 F：数据实时监测Map）
var part = "";
// 当前放大的Canvas和ECharts的Selector集合
var Container = { Canvas: [], ECharts: [] };
var AllCharts = [];
var parentDocument = window.parent.document;
window.requestAnimFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) { window.setTimeout(a, 1E3 / 60) }
}();
$(function () {
    initEvent();
    initPage();
})
function BigGraph(part) {

    var parts = {
        "A": function () {
            // 数据实时监控Line
            initPartPA(Container.ECharts[0], Container.Canvas[0]);
        },
        "B": function () {
            // 竞争楼盘实时监测
            initPartPB(true, Container.Canvas[0], Container.Canvas[1], Container.Canvas[2]);
        },
        "C": function () {
            // 用户来源监控
            initPartPC(Container.Canvas[0], Container.Canvas[1], Container.ECharts[0], Container.ECharts[1]);
        },
        "D": function () {
            // 用户偏好
            initPartPD(Container.ECharts[0], 1);
        },
        "E": function () {
            // 关键词
            initPartPE(300, 400, 5, 20, Container.Canvas[0]);
        },
        "F": function () {
            // 数据实时监测Map
            initPartPF(Container.ECharts[0]);
        },
        "G": function(){
            // 终端分布
            initPartPG();
        }
    };
    if (typeof parts[part] !== 'function') {
        return false;
    }
    return parts[part]();
}
$(window).resize(function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
        if (pageMode == 0) {
            initPage();
        } else {
            BigGraph(part);
        }
    }, 200);
});

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
// 获得当前楼盘NewCode
function GetSearchCondition() {
    var newcode = GetQueryString("newcode");// "1010122369";//$('#newcode', window.parent.document).attr('data-newcode');
    return newcode;
}
function ClearContainer() {
    Container.Canvas = [];
    Container.ECharts = [];
}
// 用于判断是否已经初始化过
var existsParts = [];
// 初始化各种事件
function initEvent() {
    $(".title_fen").css("cursor", "pointer");
    //  点击放大
    $(".data_plus").click(function (e) {
        //alert("dd")
        $(".box").css({"width":"100%","height":'100%',"overflow":'hidden'})
        if (e.target) {
            if ($(e.target).hasClass("BMap_stdMpPan") || $(e.target).hasClass("BMap_button")) {
                return;
            }
        }
        pageMode = 1;
        part = $(this).find(".title_fen").attr("data-part");
        ClearContainer();
        var copyContainer = $(".swiper-slide-plus");
        copyContainer.find(".plusBox").hide();
        if (existsParts.indexOf(part) > -1) {
            copyContainer.find("[data-part='" + part + "']").closest(".plusBox").show();
        } else {
            $(this).closest(".dataBox").clone().appendTo('.swiper-slide-plus').css({ 'height': '100%', 'margin': 0, 'width': '100%' }).addClass('plusBox');
            if (part == "F") {
                copyContainer.find("[data-part='" + part + "']").closest(".plusBox").find(".legend").removeClass("active");
            }
            existsParts.push(part);
        }
        var srcContainer = $(this).closest(".dataBox");
        if (srcContainer.find(".chartsContainer").size() > 0) {
            srcContainer.find(".chartsContainer").each(function () {
                var cid = $(this).attr("id");
                var cpid = $(this).attr("id") + "Copy";
                copyContainer.find("#" + cid).attr("id", cpid);
                Container.ECharts.push(cpid);
            });
        }
        if (srcContainer.find(".canvasContainer").size() > 0) {
            srcContainer.find(".canvasContainer").each(function () {
                var cid = $(this).attr("id");
                var cpid = $(this).attr("id") + "Copy";
                copyContainer.find("#" + cid).attr("id", cpid);
                Container.Canvas.push(cpid);
            });
        }
        BigGraph(part);
        $(".swiper-prev").click();



        $(".plusBox .data_plus").click(function (be) {
            $(".box").css({"height":'888px',"overflow":'auto'})
            if (be.target) {
                if ($(be.target).hasClass("BMap_stdMpPan") || $(be.target).hasClass("BMap_button")) {
                    return;
                }
            }
            pageMode = 0;
            $(".swiper-next").click();
        })
    })
    $(".swiper-wrapper").on("click", ".zhedie", function () {
        if ($(this).hasClass('zhedie1')) {
            $(".swiper-slide-active .user_search ul").animate({ 'width': 0, 'opacity': 0, 'padding-left': 0 });
            $(this).removeClass('zhedie1').addClass('zhedie2');
        } else if ($(this).hasClass('zhedie2')) {
            $(".swiper-slide-active .user_search ul").animate({ 'width': '125px', 'opacity': 1, 'padding-left': '8px' });
            $(this).removeClass('zhedie2').addClass('zhedie1');
        }
    });
    $(".swiper-wrapper").on("click", ".user_search li", function () {
        $(this).toggleClass('active');
    });
}
function changeProject() {
    if (pageMode == 1) {
        pageMode = 0;
        $(".swiper-next").click();
    }
    cacheDatas = {
        // 数据实时监控
        DataMonitorLine: { IsExists: false, Data: {} },
        // 竞争楼盘实时监控
        ContentProjectMonitor: { IsExists: false, Data: {} },
        // 用户来源监控
        EnterPath: { IsExists: false, Data: {} },
        // 用户偏好
        UserPrefer: { IsExists: false, Data: {} },
        // 关键词
        KeyWord: { IsExists: false, Data: {} },
        // 数据实时监测
        DataMonitorMap: { IsExists: false, Data: {} }
    };
    setTimeout(function () {
        initPage();
    }, 1000);
}
function initPage() {
    try {
        // 数据实时监控
        initPartPA();
        // 竞争楼盘实时监测
        initPartPB(false);
        // 用户来源监控
        initPartPC();
        // 用户偏好
        initPartPD();
        // 关键词
        initPartPE(80, 200, 10, 10);
        // 数据实时监测
        initPartPF();
        // 终端分布
        initPartPG();
    }
    catch (e) {
        console.log(e);
    }
}
//PartPA Start
var dataRealTimeJianKongId = "";
//var data = { "xdata": xdata, "data0": data0, "data1": data1, "data2": data2, "data3": data3 };

function initPartPA(echartsId, canvasId) {
    if (!echartsId) {
        echartsId = "dataRealTimeJianKong";
    }
    if (!canvasId) {
        canvasId = "dataRealTimeJianKongCanvas";
    }
    initDataMonitor(echartsId, canvasId)
}
var lineIndex = 0;
function initDataMonitor(echartsId, canvasId) {
    //初始化echarts和canvas宽高
    initWidthHeight(echartsId, canvasId);
    //初始化echarts背景的网格图
    //initCanvas(canvasId);
    setData(echartsId);
    clearInterval(lineIndex);
    lineIndex = setInterval(function () {
        changeDataMonitorLineData(echartsId);
    }, 1000);
}

function initCanvas(canvasId) {
    var canvas = $("#" + canvasId)[0];
    //canvas.style.cssText = "";
    if (canvas.getContext) {
        var ctx = canvas.getContext("2d"),
            width = canvas.width,
            height = canvas.height;
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#51B4D5";
        var xleft = 20,//echarts x轴offset
            left = 20,//echarts grid_left
            bottom = 30,
            interval = 5;//背景网格间隔

        //先画横线
        for (var i = 1; i * interval < height - bottom ; i++) {
            ctx.beginPath();
            ctx.moveTo(left, i * interval);
            ctx.lineTo(width, i * interval);
            ctx.stroke();
        }
        //再画纵线
        for (var j = left / interval; j * interval < width ; j++) {
            ctx.beginPath();
            ctx.moveTo(j * interval, 0);
            ctx.lineTo(j * interval, height - bottom);
            ctx.stroke();
        }
    }
}
function initWidthHeight(echartsId, canvasId) {
    var canvas = $("#" + canvasId)[0];
    var echartDiv = $("#" + echartsId)[0];
    var parent = $("#" + canvasId).parent();
    var containerWidth = $("#" + canvasId).parent().width();
    var containerHeight = $("#" + canvasId).parent().height();
    $("#" + echartsId).width(containerWidth * 1 + "px");
    $("#" + echartsId).height(containerHeight * 0.7 + "px");
    $("#" + canvasId).width(containerWidth * 1 + "px");
    $("#" + canvasId).height(containerHeight * 0.7 + "px");
}

var DataMonitorLineOption = function () {
    return {
        title: {
            text: '数据实时监控',
            show: false
        },
        tooltip: {
            trigger: 'axis',
            //formatter:'{b},{c}',
            axisPointer: {
                lineStyle: {
                    color: '#d6dae1'
                }
            }
        },
        legend: {
            data: "",
            show: false
        },
        grid: {
            left: 60,
            right: 40,
            top: 30,
            bottom: 30
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                //data: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'],
                data: [],
                axisTick:{show:false},
                axisLabel: {margin:10, textStyle: { color: '#333',fontSize:12 } },
                axisLine: {
                    lineStyle: {
                        color: '#d6dae1',
                        width: 1,
                        type: 'solid'
                    }
                },
                splitLine: {
                    show: true,
                    interval: "auto",
                    lineStyle: {
                        color: "#f6f6f9"
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisTick:{show:false},
                axisLabel: {margin:10, textStyle: { color: '#333',fontSize:12 } },
                axisLine: {
                    lineStyle: {
                        color: '#d6dae1',
                        width: 1,
                        type: 'solid'
                    }
                },
                splitLine: {
                    show: true,
                    interval: "auto",
                    lineStyle: {
                        color: "#f6f6f9"
                    }
                }
            }
        ],
        series: [
            {
                name: "",
                type: 'line',
                stack: '总量', 
                symbolSize: 7, 
                lineStyle: {
                    normal: {
                        type: 'solid',
                        color: '#fe7984',
                        width: 2
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#fe7984',
                    }
                }, 
                areaStyle: {
                    normal: {
                        color:'#fe7984',
                        opacity:0.08
                    }
                },
                data: []
            }
        ]
    }
}

function setDataMonitorLineData(echartsId, Data) {
    if (Data) {
        $("#" + echartsId).parent().find(".lun").removeClass("backLight");
        // YHS
        var isExists = false;
        var myechart;
        AllCharts.forEach(function (e, index) {
            if (e.ID == echartsId) {
                isExists = true;
                myechart = e.Chart;
                myechart.resize();
            }
        });
        if (!isExists) {
            myechart = echarts.init($("#" + echartsId)[0]);
            $("#" + echartsId).mouseenter(function (e) {
                myechart.dispatchAction({
                    type: "timelinePlayChange",
                    playState: false
                });
                $(this).mouseleave(function (e) {
                    myechart.dispatchAction({
                        type: "timelinePlayChange",
                        playState: true
                    });
                });
            });
            $("#" + echartsId).parent().find(".lun").mouseenter(function (e) {
                var index = $(this).attr("data-id");
                myechart.dispatchAction({
                    type: "timelineChange",
                    currentIndex: index
                });
                myechart.dispatchAction({
                    type: "timelinePlayChange",
                    playState: false
                });
                $(this).mouseleave(function (e) {
                    myechart.dispatchAction({
                        type: "timelinePlayChange",
                        playState: true
                    });
                });
            });
            myechart.on("timelinechanged", function (params) {
                var currentIndex = params.currentIndex;
                $("#" + echartsId).parent().find(".lun").removeClass("backLight");
                $("#" + echartsId).parent().find(".lun").eq(currentIndex).addClass("backLight");
            })
            AllCharts.push({
                ID: echartsId,
                Chart: myechart
            });
        }
        // YHS
        var uvNumber = $("#" + echartsId).siblings(".lun").find(".pa_uv").html();
        var pvNumber = $("#" + echartsId).siblings(".lun").find(".pa_pv").html();
        var callNumber = $("#" + echartsId).siblings(".lun").find(".pa_400").html();
        var imNumber = $("#" + echartsId).siblings(".lun").find(".pa_im").html();
        $("#" + echartsId).siblings(".lun").find(".pa_uv").prop("number", uvNumber).animateNumber({ number: Data.TotalVistorCount }, 500);
        $("#" + echartsId).siblings(".lun").find(".pa_pv").prop("number", pvNumber).animateNumber({ number: Data.TotalPV }, 500);
        $("#" + echartsId).siblings(".lun").find(".pa_400").prop("number", callNumber).animateNumber({ number: Data.TotalCallCount }, 500);
        $("#" + echartsId).siblings(".lun").find(".pa_im").prop("number", imNumber).animateNumber({ number: Data.TotalIMCount }, 500);
        var options = [];
        // 实时访客数
        var vistorOption = new DataMonitorLineOption();
        vistorOption.legend.data = "实时访客量";
        vistorOption.xAxis[0].data = Data.TimeArr;
        vistorOption.series[0].data = Data.VistorCountArr;
        vistorOption.series[0].lineStyle.normal.color = "#5cd9c1";
        vistorOption.series[0].itemStyle.normal.color = "#5cd9c1";
        vistorOption.series[0].areaStyle.normal.color = "#5cd9c1";
        // 实时浏览量
        var pvOption = new DataMonitorLineOption();
        pvOption.legend.data = "实时浏览量";
        pvOption.xAxis[0].data = Data.TimeArr;
        pvOption.series[0].data = Data.PVArr;
        pvOption.series[0].lineStyle.normal.color = "#a695c6";
        pvOption.series[0].itemStyle.normal.color = "#a695c6";
        pvOption.series[0].areaStyle.normal.color = "#a695c6";
        // 实时来电量
        var callcountOption = new DataMonitorLineOption();
        callcountOption.legend.data = "实时来电量";
        callcountOption.xAxis[0].data = Data.TimeArr;
        callcountOption.series[0].data = Data.CallCountArr;
        callcountOption.series[0].lineStyle.normal.color = "#32cef1";
        callcountOption.series[0].itemStyle.normal.color = "#32cef1";
        callcountOption.series[0].areaStyle.normal.color = "#32cef1";
        // 线索量
        var imcountOption = new DataMonitorLineOption();
        imcountOption.legend.data = "线索量";
        imcountOption.xAxis[0].data = Data.TimeArr;
        imcountOption.series[0].data = Data.IMCountArr;
        imcountOption.series[0].lineStyle.normal.color = "#fe7984";
        imcountOption.series[0].itemStyle.normal.color = "#fe7984";
        imcountOption.series[0].areaStyle.normal.color = "#fe7984";
        options.push(imcountOption);
        options.push(callcountOption); 
        options.push(vistorOption);
        options.push(pvOption);
        
        var option = {
            baseOption: {
                timeline: {
                    show: false,
                    axisType: 'category',
                    orient: 'vertical',
                    autoPlay: true,
                    inverse: true,
                    playInterval: 5000,
                    left: null,
                    right: 0,
                    top: 20,
                    bottom: 20,
                    width: 55,
                    height: null,
                    label: {
                        normal: {
                            textStyle: {
                                color: '#999'
                            }
                        },
                        emphasis: {
                            textStyle: {
                                color: '#fff'
                            }
                        }
                    },
                    symbol: 'none',
                    lineStyle: {
                        color: '#555'
                    },
                    checkpointStyle: {
                        color: '#bbb',
                        borderColor: '#777',
                        borderWidth: 2
                    },
                    controlStyle: {
                        showNextBtn: false,
                        showPrevBtn: false,
                        normal: {
                            color: '#666',
                            borderColor: '#666'
                        },
                        emphasis: {
                            color: '#aaa',
                            borderColor: '#aaa'
                        }
                    },
                    data: [1, 2, 3, 4]
                }
            },
            options: options
        };
        myechart.setOption(option);
    }
}

function changeDataMonitorLineData(echartsId) {
    var newcode = GetSearchCondition();
    $.ajax({
        async: true,
        type: "POST",
        url: urlstr + "DataMonitorLine" + hz + "?newcode=" + newcode,
        cache: false,
        timeout: 60 * 60 * 1000,
        dataType: "json",
        success: function (json) {
            //json = JSON.parse(json);
            if (json != null && json.IsSuccess == true) {
                cacheDatas.DataMonitorLine.Data = {
                    TimeArr: [],
                    VistorCountArr: [],
                    PVArr: [],
                    CallCountArr: [],
                    IMCountArr: [],
                    TotalVistorCount: json.TotalVistorCount,
                    TotalPV: json.TotalPV,
                    TotalCallCount: json.TotalCallCount,
                    TotalIMCount: json.TotalIMCount
                }
                for (var i = 0; i < json.List.length; i++) {
                    cacheDatas.DataMonitorLine.Data.TimeArr.push(json.List[i].Time);
                    cacheDatas.DataMonitorLine.Data.VistorCountArr.push(json.List[i].VisitorCount);
                    cacheDatas.DataMonitorLine.Data.PVArr.push(json.List[i].PV);
                    cacheDatas.DataMonitorLine.Data.CallCountArr.push(json.List[i].CallCount);
                    cacheDatas.DataMonitorLine.Data.IMCountArr.push(json.List[i].IMCount);
                }
                setDataMonitorLineData(echartsId, cacheDatas.DataMonitorLine.Data);
            }
        }
    });
}

function setData(echartsId) {
    var newcode = GetSearchCondition();
    if (!cacheDatas.DataMonitorLine.IsExists) {
        $.ajax({
            async: true,
            type: "POST",
            url: urlstr + "DataMonitorLine" + hz + "?newcode=" + newcode,
            cache: false,
            timeout: 60 * 60 * 1000,
            dataType: "json",
            success: function (json) {
                //json = JSON.parse(json);
                if (json != null && json.IsSuccess == true) {
                    cacheDatas.DataMonitorLine.Data = {
                        TimeArr: [],
                        VistorCountArr: [],
                        PVArr: [],
                        CallCountArr: [],
                        IMCountArr: [],
                        TotalVistorCount: json.TotalVistorCount,
                        TotalPV: json.TotalPV,
                        TotalCallCount: json.TotalCallCount,
                        TotalIMCount: json.TotalIMCount
                    }
                    for (var i = 0; i < json.List.length; i++) {
                        cacheDatas.DataMonitorLine.Data.TimeArr.push(json.List[i].Time);
                        cacheDatas.DataMonitorLine.Data.VistorCountArr.push(json.List[i].VisitorCount);
                        cacheDatas.DataMonitorLine.Data.PVArr.push(json.List[i].PV);
                        cacheDatas.DataMonitorLine.Data.CallCountArr.push(json.List[i].CallCount);
                        cacheDatas.DataMonitorLine.Data.IMCountArr.push(json.List[i].IMCount);
                    }
                    setDataMonitorLineData(echartsId, cacheDatas.DataMonitorLine.Data);
                    cacheDatas.DataMonitorLine.IsExists = true;
                }
            }
        });
    } else {
        setDataMonitorLineData(echartsId, cacheDatas.DataMonitorLine.Data);
    }
}
//PartPA End

// PartPB START
var loopBooleans = [];
var loopBoolean = function () {
    return {
        IsStop: false,
        Name: ""
    }
}
var loopBooleans1 = [];
var loopBoolean1 = function () {
    return {
        IsStop: false,
        Name: ""
    }
}
var ContendProjectAttr = [];
//竞争楼盘
function initPartPB(isClick, c, d, f) {
    if (!c) {
        c = "c";
    }
    if (!d) {
        d = "d";
    }
    if (!f) {
        f = "f";
    }

    //获取后台楼盘信息
    if (!cacheDatas.ContentProjectMonitor.IsExists) {
        $.ajax({
            url: urlstr + "ContendProjectMonitor" + hz + "?newcode=" + GetSearchCondition(),
            success: function (result) {
                result = JSON.parse(result);
                if (result != null && result.IsSuccess == true) {
                    for (var i = 0; i < result.List.length - 1; i++) {
                        var row = result.List[i];
                        ContendProjectAttr.push(row.Name);
                    }
                    cacheDatas.ContentProjectMonitor.Data = ContendProjectAttr;
                    cacheDatas.ContentProjectMonitor.IsExists = true;
                    contendProject(isClick, c, d, f);
                }
            }
        });
    } else {
        contendProject(isClick, c, d, f);
    }
}

function contendProject(isClick, cId, dId, fId) {
    var canvasF = document.getElementById(fId);
    var cxtF = canvasF.getContext("2d");

    var canvasD = document.getElementById(dId);
    var cxt = canvasD.getContext("2d");

    var c = document.getElementById(cId);
    var ctx = c.getContext('2d');

    var marginTop = 52; 
    var canvasWidth = $("#" + cId).closest('.data_plus').width();
    var canvasHeight = $("#" + cId).closest('.data_plus').height()-52; 
    cxt.clearRect(0, 0, canvasWidth, canvasHeight);
    cxt.beginPath();

    cxtF.clearRect(0, 0, canvasWidth, canvasHeight);
    cxtF.beginPath();

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();

    canvasF.width = canvasD.width = c.width = cw = canvasWidth;//window.innerWidth;
    canvasF.height = canvasD.height = c.height = ch = canvasHeight;  // window.innerHeight;
    // console.log(canvasWidth)
    // console.log(canvasHeight)
    SaoMiao(ctx, cxtF, canvasWidth, canvasHeight, isClick, cId);
    //画外圈闪动圆环、闪动圆弧、内圈多圆 start
    var circle = (canvasWidth / 5);
    var r1 = circle;
    var pointNumber = 80;
    if (isClick) { 
        r1 = canvasWidth / 5;
        pointNumber = 120;
    }
    var arr = setPoint(pointNumber, { "px": 0, "py": 0 }, r1); 
    cxt.translate(canvasWidth / 2, (canvasHeight / 2));
    var sign = false;
    //DongYuan(cxt, 0, 0, arr, r1, isClick, canvasWidth, canvasHeight, dId, sign);

    // //画外圈闪动圆环 end
    var circle1 = (canvasWidth / 5);
    if (isClick) {
        circle1 = canvasWidth / 5;
    }
    for (var i = 0; i < 8; i++) {
        cxt.beginPath();
        cxt.arc(0, 0, circle1, 0, Math.PI * 2, false);

        if (i % 2 == 0) {
            cxt.lineWidth = 1;
            cxt.strokeStyle = '#def6fb'//'rgba(105, 105, 105, 1)';

        } else {
            cxt.strokeStyle = '#def6fb'//'rgba(105, 105, 105, 1)';
            cxt.lineWidth = 1;
        }
        if (i == 5) {
            cxt.strokeStyle = '#def6fb'//'rgba(105, 105, 105, 1)';
            cxt.lineWidth = 1;
        }
        cxt.stroke();
        cxt.closePath();
        if (isClick) {
            if (circle1 >= 26) {
                circle1 -= 26;
            }
        }
        if (circle1 >= 16) {
            circle1 -= 16;
        }
    }
    //画闪动圈内的多个圆 end

    //画直线（十字形） start
    var lineHeight = canvasWidth / 5//120;
    if (isClick) {
        lineHeight = canvasWidth / 5;//lineR;
    }
    cxt.moveTo(0, 0);
    cxt.lineTo(0, 0 + lineHeight);
    cxt.lineTo(0, 0 - lineHeight);
    cxt.lineTo(0, 0);
    cxt.lineTo(0 + lineHeight, 0);
    cxt.lineTo(0 - lineHeight, 0);
    cxt.stroke();
    cxt.strokeStyle = '#e5f7fc';
    cxt.stroke();
    cxt.closePath();
}
function SaoMiao(ctx, cxtF, canvasWidth, canvasHeight, isClick, c) {
    if (loopBooleans) {
        loopBooleans.forEach(function (e) {
            if (e.Name == c) {
                e.IsStop = true;
            }
        })
    }
    var lb = new loopBoolean();
    lb.Name = c;
    loopBooleans.push(lb);
    //画扫描图 start
    window.requestAnimFrame = function () { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) { window.setTimeout(a, 1E3 / 60) } }();

    ctx.lineCap = 'round';
    var orbs = [];
    var orbCount = 30;
    var radius;
    var linex = 0;
    var liney = 0;
    function createOrb(mx, my, count1) {
        //alert(count1)
        var dx = (cw / 2) - mx;
        var dy = (ch / 2) - my;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var angle = Math.atan2(dy, dx);
        orbs.push({
            x: mx,
            y: my,
            lastX: mx,
            lastY: my,
            colorAngle: 191,
            angle: angle + Math.PI / 2,
            size: 2,
            centerX: cw / 2, //扫描圆心
            centerY: ch / 2, 
            radius: dist,
            speed: 0.01,
            draw: function () { 
                ctx.strokeStyle = 'hsla(' + this.colorAngle + ',80%,80%,0.3)';
                ctx.lineWidth = this.size;
                ctx.beginPath();
                ctx.moveTo(this.lastX, this.lastY);
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
            },
            update: function () { 
                this.lastX = this.x;
                this.lastY = this.y;
                this.colorAngle = 191; 
                this.x = this.centerX + Math.sin(this.angle * -1) * this.radius;
                this.y = this.centerY + Math.cos(this.angle * -1) * this.radius;
                if (count1 <= 35) { 
                    linex = this.x;
                    liney = this.y;
                }
                this.angle += this.speed;
            }
        });
    }
    var count = Math.ceil((canvasWidth / 2) / 5);
    if (isClick) {
        count = Math.ceil(canvasWidth / 10);//saomiaoR;
    }
    /*if(count<35){
        count =36
    }*/
    console.log("dddd"+count)
    while (count--) {
        createOrb(cw / 2, ch / 2 + (count * 2), count);
    } 
    var numbers1 = 180;
    var counts = 0;
    var num6 = -1;
    var number1 = 0;
    var number2 = 0;
    var number3 = 0;
    var k = 0;
    var attr = [];
    var loop = function () {
        counts++;
        if (counts % 2 == 0) {
            ctx.fillStyle = 'rgba(0,0,0,.05)'; //'rgba(23,47,80,.05)';
            ctx.fillStyle = 'rgba(253,253,253,.05)'; //'rgba(23,47,80,.05)';
            if (isClick) {
                ctx.arc(canvasWidth / 2, canvasHeight / 2, Math.ceil(canvasWidth / 5), 0, Math.PI * 2);
            } else {
                ctx.arc(canvasWidth / 2, canvasHeight / 2, Math.ceil(canvasWidth / 5), 0, Math.PI * 2);
            }
            ctx.fill();
            var i = orbs.length;
            if (num6 == -1) {
                number1 = 0;
                number2 = 1;
                number3 = 2;
            }
            if (num6 == 0) {
                number1 = 3;
                number2 = 4;
                number3 = 5;
            }
            if (num6 == 1) {
                number1 = 6;
                number2 = 7;
                number3 = 8;
            }
            if (counts == 10) {
                if (k == 0) {
                    attr.push(linex + ',' + liney)
                }

                var x1 = attr[0].split(',')[0];
                var y1 = attr[0].split(',')[1]; 
                paintingWord(cxtF, canvasWidth, canvasHeight, isClick, 0, x1, y1, number1)
            }
            if (counts == 76) {
                if (k == 0) {
                    attr.push(linex + ',' + liney)
                }
                var x1 = attr[1].split(',')[0];
                var y1 = attr[1].split(',')[1];
                paintingWord(cxtF, canvasWidth, canvasHeight, isClick, 0, x1, y1, number2)
            }
            if (counts == 138) {
                if (k == 0) {
                    attr.push(linex + ',' + liney)
                }
                var x1 = attr[2].split(',')[0];
                var y1 = attr[2].split(',')[1];
                paintingWord(cxtF, canvasWidth, canvasHeight, isClick, 0, x1, y1, number3)
            }
            while (i--) {
                var orb = orbs[i];
                var updateCount = 7;
                while (updateCount--) {
                    orb.update();
                    orb.draw(ctx);
                }
            }
        }
        if (counts == numbers1) { 
            k++;
            num6++;
            cxtF.clearRect(0, 0, canvasWidth, canvasHeight)
            counts = 0;
        }
        if (!lb.IsStop) {
            if (num6 == 2) {
                num6 = -1;
            } 
            window.requestAnimFrame(loop);
        } else {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        }
    }
    loop();
}
var sign = false;
var istrue1 = 0;

function paintingWord(cxtF, canvasWidth, canvasHeight, isClick, key, x1, y1, number3) {
    //画圆点clearTimeout
    cxtF.save();
    cxtF.beginPath();
    if (ContendProjectAttr.length > 0) { 
        words(cxtF, x1, y1, isClick, number3, canvasWidth)
    }
}

function words(cxtF, canvasWidth, canvasHeight, isClick, number3, w) {



    //设置字体填充颜色
    cxtF.fillStyle = "#666";
    if (canvasWidth > 400) {
        cxtF.font = "25px 微软雅黑";
    } else {
        cxtF.font = "12px 微软雅黑";
    }
    if (isClick) {
        if (number3 == 0 || number3 == 3 || number3 == 6) {
            cxtF.arc(canvasWidth * 0.9, canvasHeight * 1.1, 12, 0, Math.PI * 2);
            cxtF.fillText(ContendProjectAttr[number3], canvasWidth * 0.8, canvasHeight * 1.3);

        }
        if (number3 == 1 || number3 == 4 || number3 == 7) {
            cxtF.arc(canvasWidth * 0.8, canvasHeight * 0.8, 8, 0, Math.PI * 2);
            cxtF.fillText(ContendProjectAttr[number3], canvasWidth * 0.7, canvasHeight * 1.05);
        }
        if (number3 == 2 || number3 == 5 || number3 == 8) {
            cxtF.arc(canvasWidth * 1.2, canvasHeight * 1, 5, 0, Math.PI * 2);
            cxtF.fillText(ContendProjectAttr[number3], canvasWidth * 1.05, canvasHeight * 1.1);
        }

    } else {
        if (number3 == 0 || number3 == 3 || number3 == 6) {
            cxtF.arc(canvasWidth, canvasHeight, 6, 0, Math.PI * 2);
            cxtF.fillText(ContendProjectAttr[number3], canvasWidth * 0.5, canvasHeight * 0.9);
        }
        if (number3 == 1 || number3 == 4 || number3 == 7) {
            cxtF.arc(canvasWidth, canvasHeight, 5, 0, Math.PI * 2);
            cxtF.fillText(ContendProjectAttr[number3], canvasWidth * 0.6, canvasHeight * 1.4);
        }
        if (number3 == 2 || number3 == 5 || number3 == 8) {
            cxtF.arc(canvasWidth, canvasHeight, 4, 0, Math.PI * 2);
            //if (Math.ceil((w / 2) / 2.5) < 50 && ContendProjectAttr[number3].length > 4 && ContendProjectAttr[number3].length <= 7) {
            /*if (Math.ceil((w / 2) / 2.5) < 60) {
                var proj = ContendProjectAttr[number3];
                var str1 = proj.substr(0, 4);
                var str2 = proj.substr(str1.length, proj.length - str1.length);
                cxtF.fillText(str1, canvasWidth * 0.7, canvasHeight * 1.13);
                cxtF.fillText(str2, canvasWidth * 0.7, canvasHeight * 1.25);
            }
            else if (ContendProjectAttr[number3].length > 7) {
                var proj = ContendProjectAttr[number3];
                var str1 = proj.substr(0, 8);
                var str2 = proj.substr(str1.length, proj.length - str1.length);
                cxtF.fillText(str1, canvasWidth * 0.7, canvasHeight * 1.13);
                cxtF.fillText(str2, canvasWidth * 0.7, canvasHeight * 1.25);
            } else { 
                cxtF.fillText(ContendProjectAttr[number3], canvasWidth * 0.7, canvasHeight * 1.15);
            }*/
            cxtF.fillText(ContendProjectAttr[number3], canvasWidth * 0.7, canvasHeight * 1.15);

        }
    }
    //cxtF.shadowOffsetX = 3; // 阴影Y轴偏移
    //cxtF.shadowOffsetY = 3; // 阴影X轴偏移
    cxtF.fillStyle = "#80e0f5";
    cxtF.shadowBlur = 0; // 模糊尺寸
    cxtF.shadowColor = 'rgba(122 ,197 ,205 ,0.9)'; // 颜色
    cxtF.closePath();
    cxtF.fill();
    cxtF.restore();
}
function setPoint(num, p, radius) { 
    // 计算平均角度 [ 360度 ÷ 个数 ] 
    var each_degree = 360 / num;
    // 临时数组
    var arr = new Array(num);

    // 开始计算每个圆点坐标
    for (i = 0; i < num; i++) {

        // 得出每个圆点需要变换的弧度
        var radian = (i * each_degree) * Math.PI / 180;
        // 圆点坐标变换公式 [ x = radius * cos(degree) ,  y = radius * sin(degree) ]
        var _x = Math.round(radius * Math.cos(radian));
        var _y = Math.round(radius * Math.sin(radian));
        // 基于圆心平移X,Y
        arr[i] = {
            x: _x + p["px"],
            y: _y + p["py"],
            degree: i * each_degree
        }
    }
    arr.radius = radius;
    arr.center = {};
    arr.center.x = p["px"];
    arr.center.y = p["py"];
    // 返回带有坐标值的数组
    return arr;
}

/*function rotate(arr, add_deg) {
    for (i = 0; i < arr.length; i++) {
        var new_deg = arr[i].degree + add_deg;
        var radian = new_deg * Math.PI / 180;
        var new_x = Math.round(arr.radius * Math.cos(radian));
        var new_y = Math.round(arr.radius * Math.sin(radian));
        arr[i].x = new_x + arr.center.x;
        arr[i].y = new_y + arr.center.y;
        arr[i].degree = new_deg;
    }
    return arr;
}*/

// PartPB END
// PartPC START
function initPartPC(bkId1, bkId2, chartsId1, chartsId2) {
    if (!bkId1) {
        bkId1 = "cav1";
    }
    if (!bkId2) {
        bkId2 = "cav2";
    }
    if (!chartsId1) {
        chartsId1 = "main";
    }
    if (!chartsId2) {
        chartsId2 = "main2";
    }
    if (!cacheDatas.EnterPath.IsExists) {
        $.ajax({
            url: urlstr + 'EnterPath' + hz + '?newcode=' + GetSearchCondition(),
            type: "POST",
            success: function (src) {
                src = JSON.parse(src);
                if (src && src.IsSuccess) {
                    var data = [];
                    var data2 = [];
                    var i = 0;
                    for (; i < src.List.length; i++) {
                        if (src.List[i].Type == 1) {
                            data2.push({ "name": src.List[i].Name, "value": src.List[i].Value });
                            data2.push({ "name": "", "value": 0 });
                        } else {
                            data.push({ "name": src.List[i].Name, "value": src.List[i].Value });
                            data.push({ "name": "", "value": 0 });
                        }
                    }
                    data2.sort(function (a, b) {
                        return a.name < b.name ? 1 : -1;
                    });
                    data.sort(function (a, b) { return a.name < b.name ? 1 : -1; });
                    initEnterPath(data, data2, bkId1, bkId2, chartsId1, chartsId2);
                    cacheDatas.EnterPath.Data = [data, data2];
                    cacheDatas.EnterPath.IsExists = true;
                }
            }
        });
    } else {
        initEnterPath(cacheDatas.EnterPath.Data[0], cacheDatas.EnterPath.Data[1], bkId1, bkId2, chartsId1, chartsId2);
    }
};

function initEnterPath(data, data2, bkId1, bkId2, chartsId1, chartsId2) {
    var option = {
        cid: chartsId1,
        bkid: bkId1,
        location: ['50%', '95%'],
        timeline: true,
        data: data,
        circlesize: 6,
        bkcirclesize: 6//,
        //radius: ($("#" + chartsId1).width() > $("#" + chartsId1).height() ? $("#" + chartsId1).height() : $("#" + chartsId1).width()) * 1 / 2
    };
    var option2 = {
        cid: chartsId2,
        bkid: bkId2,
        location: ['50%', '95%'],
        timeline: true,
        data: data2,
        circlesize: 6,
        bkcirclesize: 6//,
        //radius: ($("#" + chartsId1).width() > $("#" + chartsId1).height() ? $("#" + chartsId1).height() : $("#" + chartsId1).width()) * 1 / 2
    };
    //DrawHalfCircle(option);
    //DrawHalfCircle(option2);
}
// PartPC END

// PartPD START

function initPartPD(containerId, type) {
    if (!containerId) {
        containerId = "userPrefer";
    }
    // type 0：小图 1：大图
    if (!type) {
        type = 0;
    }
    initUserPrefer(containerId, type);
}

// 用户偏好
var UserPreferPoint = function () {
    return {
        name: "Point",
        //type: "effectScatter",
        type: "scatter",
        coordinateSystem: 'cartesian2d',
        data: [],
        zlevel: 1,
        symbol: "image://Resource/images/pUser.png",
        symbolSize: parseInt($("#userPrefer").css("height")) / 4,
        showEffectOn: 'render',
        rippleEffect: {
            brushType: 'stroke'
        },
        rippleEffect: {
            scale: 1.7
        },
        hoverAnimation: true,
        label: {
            normal: {
                formatter: '{b}',
                position: 'top',
                show: true,
                textStyle: {
                    color: "#333",
                    fontSize: 12
                },
            }
        },
        itemStyle: {
            normal: {
                color: '#f4e925',
                shadowBlur: 0,
                shadowColor: '#333'
            }
        }
    }
};

function getUserPreferImageUrl(dataType) {
    var pImg = "pUser";
    // 1：用户图标 2：价格图标 3：户型图标 4: 区域（怎么添加区域数据？？？）
    switch (dataType) {
        case 1:
            pImg = "pUser";
            break;
        case 2:
            pImg = "pPrice";
            break;
        case 3:
            pImg = "pHouse";
            break;
        case 4:
            pImg = "pQuyu";
            break;
        default:
            break;
    }
    return "image://Resource/images/" + pImg + ".png";
}

function setUserPreferData(containerId, userPreferCharts, result, type) {
    var rankOneMaxSize = parseInt($("#" + containerId).css("height")) / 4 > 100 ? 100 : parseInt($("#" + containerId).css("height")) / 4;
    var rankTwoMaxSize = rankOneMaxSize / 1.5;
    var rankThirdMaxSize = rankOneMaxSize / 2;
    var series = [];
    var pointsL = {
        user: [50, 50],
        price: { position: [30, 10], cPositions: [] },
        totalprice: { position: [20, 70], cPositions: [] },
        house: { position: [80, 60], cPositions: [] }
    };
    var pointsB = {
        user: [50, 50],
        price: { position: [30, 20], cPositions: [[10, 35], [15, 10], [55, 12]] },
        totalprice: { position: [25, 75], cPositions: [[8, 52], [10, 85], [40, 85]] },
        house: { position: [75, 55], cPositions: [[60, 80], [90, 65], [80, 20]] }
    };
    var points = type == 0 ? pointsL : pointsB;
    if (result && result.List && result.List.identity && result.List.price && result.List.house && result.List.totalPrice) {
        var point = new UserPreferPoint();
        var line = {
            name: name,
            type: "lines",
            zlevel: 0,
            coordinateSystem: 'cartesian2d',
            effect: {
                show: true,
                //show: false,
                period: 2,
                //constantSpeed:80,
                trailLength: 0.2,
                symbol: "circle",
                symbolSize: 2,
                color: "white" // 流动的颜色
            },
            lineStyle: {
                normal: { color: "#51B6D7", width: 0.1, opacity: 0.9, curveness: 0.2, type: "doshed" }
            },
            data: []
        };
        // 用户
        point.data.push({ name: "用户", value: points.user, symbol: getUserPreferImageUrl(1), symbolSize: rankOneMaxSize });
        if (type == 1) {
            // 单价
            point.data.push({ name: "单价", value: points.price.position, symbol: getUserPreferImageUrl(2), symbolSize: rankTwoMaxSize });
            // 总价
            point.data.push({ name: "总价", value: points.totalprice.position, symbol: getUserPreferImageUrl(2), symbolSize: rankTwoMaxSize });
            // 户型
            point.data.push({ name: "户型", value: points.house.position, symbol: getUserPreferImageUrl(3), symbolSize: rankTwoMaxSize });
        } else {
            var value = "";
            var name = "";
            if (result.List.price.prices.length > 0) {
                value = result.List.price.prices[0].percent + "%";
                name = result.List.price.prices[0].label;
                if (name.indexOf("999999") > 0 && name.indexOf("-") > 0) {
                    name = name.split("-").length > 0 ? name.split("-")[0] + "以上" : name;
                }
            }
            // 单价
            point.data.push({ name: "单价", value: points.price.position, symbol: getUserPreferImageUrl(2), symbolSize: rankTwoMaxSize, text: name, count: value });
            value = "";
            name = "";
            if (result.List.house.houses.length > 0) {
                value = result.List.house.houses[0].percent + "%";
                name = result.List.house.houses[0].label;
            }
            // 户型
            point.data.push({ name: "户型", value: points.house.position, symbol: getUserPreferImageUrl(3), symbolSize: rankTwoMaxSize, text: name, count: value });
            value = "";
            name = "";
            if (result.List.totalPrice.totalPrices.length > 0) {
                value = result.List.totalPrice.totalPrices[0].percent + "%";
                name = result.List.totalPrice.totalPrices[0].label;
                if (name.indexOf("999999") > 0 && name.indexOf("-") > 0) {
                    name = name.split("-").length > 0 ? name.split("-")[0] + "万以上" : name;
                } else {
                    priceName += "万";
                }
            }
            // 总价
            point.data.push({ name: "总价", value: points.totalprice.position, symbol: getUserPreferImageUrl(2), symbolSize: rankTwoMaxSize, text: name, count: value });
        }
        line.data.push({ coords: [points.user, points.price.position] });
        line.data.push({ coords: [points.user, points.house.position] });
        line.data.push({ coords: [points.user, points.totalprice.position] });
        for (var i = 0; i < result.List.price.prices.length && i < points.price.cPositions.length; i++) {
            var priceName = result.List.price.prices[i].label;
            if (priceName.indexOf("999999") > 0 && priceName.indexOf("-") > 0) {
                priceName = priceName.split("-").length > 0 ? priceName.split("-")[0] + "以上" : priceName;
            }
            // 单价
            point.data.push({
                name: priceName + "(" + result.List.price.prices[i].percent + "%)",
                text: priceName,
                value: points.price.cPositions[i], //[x, y],
                symbol: getUserPreferImageUrl(2),
                symbolSize: rankThirdMaxSize * (parseInt(result.List.price.prices[i].value) / parseInt(result.List.price.prices[0].value)),
                count: result.List.price.prices[i].percent + "%"
            });
            line.data.push({ coords: [points.price.position, points.price.cPositions[i]] });
        }
        for (var i = 0; i < result.List.house.houses.length && i < points.house.cPositions.length; i++) {
            // 户型
            point.data.push({
                name: result.List.house.houses[i].label + "(" + result.List.house.houses[i].percent + "%)",
                text: result.List.house.houses[i].label,
                value: points.house.cPositions[i],
                symbol: getUserPreferImageUrl(3),
                symbolSize: rankThirdMaxSize * (parseInt(result.List.house.houses[i].value) / parseInt(result.List.house.houses[0].value)),
                count: result.List.house.houses[i].percent + "%"
            });
            line.data.push({ coords: [points.house.position, points.house.cPositions[i]] });
        }
        for (var i = 0; i < result.List.totalPrice.totalPrices.length && i < points.totalprice.cPositions.length; i++) {
            var priceName = result.List.totalPrice.totalPrices[i].label;
            if (priceName.indexOf("999999") > 0 && priceName.indexOf("-") > 0) {
                priceName = priceName.split("-").length > 0 ? priceName.split("-")[0] + "万以上" : priceName;
            } else {
                priceName += "万";
            }
            // 总价
            point.data.push({
                name: priceName + "(" + result.List.totalPrice.totalPrices[i].percent + "%)",
                text: priceName,
                value: points.totalprice.cPositions[i],
                symbol: getUserPreferImageUrl(2),
                symbolSize: rankThirdMaxSize * (parseInt(result.List.totalPrice.totalPrices[i].value) / parseInt(result.List.totalPrice.totalPrices[0].value)),
                count: result.List.totalPrice.totalPrices[i].percent + "%"
            });
            line.data.push({ coords: [points.totalprice.position, points.totalprice.cPositions[i]] });
        }
        series.push(point);
        series.push(line);
        var option = {
            grid: [
                {
                    show: false,
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: $("#" + containerId).css("width"),
                    height: $("#" + containerId).css("height")
                }
            ],
            xAxis: {
                gridIndex: 0, min: 0, max: 100,
                splitLine: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false }
            },
            yAxis: {
                gridIndex: 0, min: 0, max: 100,
                splitLine: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: { show: false }
            },
            tooltip: {
                show: true,
                formatter: function (a) {
                    var val = "";
                    if (a.data.count && a.data.text) {
                        val = a.data.text + "：" + a.data.count;
                    }
                    return val;
                }
            },
            series: series
        };
        userPreferCharts.setOption(option);
    }
}

function initUserPrefer(containerId, type) {
    $("#" + containerId).css("height",
        (parseInt($("#" + containerId).closest(".xsjk .data_plus").css("height"))
        - parseInt($("#" + containerId).siblings(".header").css("height"))-20) + "px");
    console.log($("#" + containerId).height())
    // YHS
    var isExists = false;
    var userPreferCharts;
    AllCharts.forEach(function (e, index) {
        if (e.ID == containerId) {
            isExists = true;
            userPreferCharts = e.Chart;
            userPreferCharts.resize();
        }
    });
    if (!isExists) {
        userPreferCharts = echarts.init($("#" + containerId)[0]);
        AllCharts.push({
            ID: containerId,
            Chart: userPreferCharts
        });
    }
    // YHS
    var data = "newcode=" + GetSearchCondition();
    if (!cacheDatas.UserPrefer.IsExists) {
        $.ajax({
            url: urlstr + "UserPrefer" + hz,
            data: data,
            success: function (result) {
                result = JSON.parse(result);
                setUserPreferData(containerId, userPreferCharts, result, type);
                cacheDatas.UserPrefer.IsExists = true;
                cacheDatas.UserPrefer.Data = result;
            }
        });
    } else {
        setUserPreferData(containerId, userPreferCharts, cacheDatas.UserPrefer.Data, type);
    }
    return userPreferCharts;
}
// PartPD END

// PartPE START
var dateList = [];
function DateGet(radius, d, mouseMoveSpeed, count, containerId) {
    if (!cacheDatas.KeyWord.IsExists) {
        $.ajax({
            url: urlstr + "KeyWord" + hz + "?newcode=" + GetSearchCondition(),
            success: function (result) {
                result = JSON.parse(result);
                if (result.Msg == "获取数据成功！" && result.List != null && result.List.length > 0) {
                    dateList = cacheDatas.KeyWord.Data = result.List;
                    KeyWordShow(radius, d, mouseMoveSpeed, count, containerId);
                    cacheDatas.KeyWord.IsExists = true;
                }
            }
        })
    } else {
        dateList = cacheDatas.KeyWord.Data;
        KeyWordShow(radius, d, mouseMoveSpeed, count, containerId);
    }
}
//******************************页面启动时动态展示******************************
function KeyWordShow(radius, d, mouseMoveSpeed, count, containerId) {
    if (count == 10) {
        if (dateList.length > 10) {
            dateList = dateList.slice(0, 10);
        }
    }

    var dtr = Math.PI / 180;

    var lasta = 1;
    var lastb = 1;
    var distr = true;
    var tspeed = 5;
    var size = 250;

    var mouseX = -10;
    var mouseY = -10;

    var howElliptical = 1;
    var active = true;

    var keyWordHeight = 10;

    var oDiv = document.getElementById(containerId);

    var keyWord = document.getElementById(containerId);
    var keyctx = keyWord.getContext('2d');

    keyWord.width = $("#" + containerId).parent().width();
    keyWord.height = $("#" + containerId).parent().height() - $("#" + containerId).parent().find("p").height();

    var orbs_keyWord = [];
    var wordCount = 8;
    sineCosine(0, 0, 0);

    var phi = 0;
    var theta = 0;
    var max = dateList.length;
    var i = 0;

    for (var i = 0; i < dateList.length; i++) {
        phi = Math.acos(-1 + (2 * (i + 1) - 1) / max);
        theta = Math.sqrt(max * Math.PI) * phi;

        var mx = radius * Math.cos(theta) * Math.sin(phi) + keyWord.width / 2 - keyctx.measureText(dateList[i]).width / 2;
        var my = radius * Math.sin(theta) * Math.sin(phi) + keyWord.height / 2 - keyWordHeight / 2;

        orbs_keyWord.push({
            x: mx,
            y: my,
            value: dateList[i],
            direction: "left",
            speed: 0.008 * (parseInt(i / wordCount) + 1),
            size: 35,
            cx: radius * Math.cos(theta) * Math.sin(phi),
            cy: radius * Math.sin(theta) * Math.sin(phi),
            cz: radius * Math.cos(phi),
            opacity: 0.9,
            draw: function () {
                keyctx.font = this.size + " 微软雅黑";
                keyctx.fillStyle = "rgba(142,121,181," + this.opacity + ")";
                keyctx.fillText(this.value, this.x, this.y);
            },
            update: function () {
                var a;
                var b;

                if (active) {
                    a = (-Math.min(Math.max(-mouseY, -size), size) / radius) * tspeed;
                    b = (Math.min(Math.max(-mouseX, -size), size) / radius) * tspeed;
                }
                else {
                    a = lasta * 0.98;
                    b = lastb * 0.98;
                }
                lasta = a;
                lastb = b;

                if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
                    return;
                }

                var c = 0;
                sineCosine(a, b, c);

                var rx1 = this.cx;
                var ry1 = this.cy * ca + this.cz * (-sa);
                var rz1 = this.cy * sa + this.cz * ca;

                var rx2 = rx1 * cb + rz1 * sb;
                var ry2 = ry1;
                var rz2 = rx1 * (-sb) + rz1 * cb;

                var rx3 = rx2 * cc + ry2 * (-sc);
                var ry3 = rx2 * sc + ry2 * cc;
                var rz3 = rz2;

                this.cx = rx3;
                this.cy = ry3;
                this.cz = rz3;

                per = d / (d + rz3);

                this.x = (howElliptical * rx3 * per) - (howElliptical * 2);
                this.y = ry3 * per;
                this.scale = per;
                this.alpha = per;

                this.alpha = (this.alpha - 0.6) * (10 / 6);

                var l = keyWord.width / 2;
                var t = keyWord.height / 2;

                this.x = this.cx + l - keyctx.measureText(this.value).width / 2;
                this.y = this.cy + t - keyWordHeight / 2;

                this.size = (radius < 100 ? 14 : 20) + 'px';

                this.opacity = this.alpha;

            }
        });
    }
    function sineCosine(a, b, c) {
        sa = Math.sin(a * dtr);
        ca = Math.cos(a * dtr);
        sb = Math.sin(b * dtr);
        cb = Math.cos(b * dtr);
        sc = Math.sin(c * dtr);
        cc = Math.cos(c * dtr);
    }
    oDiv.onmouseover = function () {
        active = true;
    };

    oDiv.onmouseout = function () {
        //active = false;
    };

    oDiv.onmousemove = function (ev) {
        var oEvent = window.event || ev;

        mouseX = oEvent.offsetX - (oDiv.offsetLeft + oDiv.offsetWidth / 2);
        mouseY = oEvent.offsetY - (oDiv.offsetTop + oDiv.offsetHeight / 2);

        mouseX /= mouseMoveSpeed;
        mouseY /= mouseMoveSpeed;
    };
    var loop = function () {
        window.requestAnimFrame(loop);
        keyctx.clearRect(0, 0, keyWord.width, keyWord.height);
        var i = orbs_keyWord.length;
        while (i--) {
            var orb = orbs_keyWord[i];

            orb.update();
            orb.draw(keyctx);
        }
    }

    loop();
}
//******************************调用事件******************************
function initPartPE(radius, d, mouseMoveSpeed, count, containerId) {
    if (!containerId) {
        containerId = "keyWord";
    }
    DateGet(radius, d, mouseMoveSpeed, count, containerId);
}
// PartPE END

// PartPF START

function initPartPF(containerId) {
    if (!containerId) {
        containerId = "dataMonitor";
    }
    initDataMonitorMap(containerId);
    setInterval(function () {
        $.ajax({
            url: urlstr + "DataMonitorMap" + hz,
            data: "type=0&newcode=" + GetSearchCondition(),
            success: function (result) {
                result = JSON.parse(result);
                if (result != null && result.IsSuccess == true) {
                    var mapCharts;
                    AllCharts.forEach(function (e, index) {
                        if (e.ID == containerId) {
                            isExists = true;
                            mapCharts = e.Chart;
                        }
                    });
                    setMapData(containerId, mapCharts, result);
                    cacheDatas.DataMonitorMap.Data = result;
                }
            }
        });
    }, 60 * 1000);
}
function setMapData(containerId, mapCharts, result) {
    var colors = [
        { name: "浏览", value: "#32cef1" }, { name: "订阅收藏", value: "#fe7984" }, { name: "参加活动", value: "#ffc644" },
        { name: "400电话", value: "#6ddda7" }, { name: "IM聊天", value: "#9885be" }];
    if (result != null && result.IsSuccess == true) {
        var series = [];
        for (var i = 0; i < result.List.length; i++) {
            var row = result.List[i];
            var name = colors[parseInt(row.Type)].name;
            var color = colors[parseInt(row.Type)].value;
            var point = [parseFloat(row.UserLocationX), parseFloat(row.UserLocationY)];
            var curveness = Math.random();
            var coords = [];
            // 楼盘样式
            coords = [point, [result.ProjectLocationX, result.ProjectLocationY]];
            var x0 = 0;
            var y0 = 0;
            var x2 = 1;
            var y2 = 1;
            if (point[1] > result.ProjectLocationY) {
                x0 = 0;
                y0 = 0;
                x2 = 1;
                y2 = 1;
            }
            if (point[1] <= result.ProjectLocationY) {
                x0 = 1;
                y0 = 1;
                x2 = 0;
                y2 = 0;
            }
            series.push({
                name: name + containerId,
                type: "lines",
                zlevel: 1,
                coordinateSystem: 'bmap',
                effect: {
                    show: true,
                    //period: 3,
                    constantSpeed: 100,
                    trailLength: 0,
                    symbol: "circle",
                    symbolSize: 2,
                    color: "white"
                },
                lineStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(x0, y0, x2, y2, [{
                            offset: 0, color: '#fe7984' // 0% 处的颜色
                        }, {
                            offset: 1, color: '#fe7984' // 100% 处的颜色
                        }], false),
                        width: 1, opacity: 0.8,
                        // 楼盘样式
                        curveness: curveness
                    }
                },
                data: [{
                    coords: coords
                }]
            });
            series.push({
                name: name + containerId,
                type: "effectScatter",
                zlevel: 1,
                coordinateSystem: 'bmap',
                showEffectOn: 'render',
                rippleEffect: {
                    brushType: 'stroke'
                },
                symbolSize: 2,
                hoverAnimation: true,
                itemStyle: {
                    normal: {
                        color: color,
                        shadowBlur: 10,
                        shadowColor: '#333'
                    }
                },
                data: [{
                    name: name,
                    value: point
                }]
            });
        }
        var projectSize = 15;
        series.push({
            type: "effectScatter",
            zlevel: 1,
            coordinateSystem: 'bmap',
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            symbolSize: projectSize,
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: '{b}',
                    position: 'right',
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    color: '#fe7984',  // 地图圆圈样式
                  /*  shadowBlur: 10,
                    shadowColor: '#333'*/
                }
            },
            data: [{
                name: result.ProjName,
                value: [result.ProjectLocationX, result.ProjectLocationY]
            }]
        });
        mapCharts.setOption(option = {
            bmap: {
                center: [result.ProjectLocationX, result.ProjectLocationY],
                zoom: 13,
                roam: true,
                mapStyle: {
              'styleJson': mapjsonstyle
            }
            },
            legend: [{
                show: false
            }],
            series: series
        });
        if (BMapArr.get(containerId)) {
            var navigationControl = new BMap.NavigationControl({
                // 靠左上角位置
                anchor: BMAP_ANCHOR_TOP_LEFT,
                // LARGE类型
                type: BMAP_NAVIGATION_CONTROL_PAN
            });
            BMapArr.get(containerId).setZoom(11);
            BMapArr.get(containerId).addControl(navigationControl);
            //BMapArr.get(containerId).setMapStyle({ style: "dark" });
        }
    } else {

    }
}
function initDataMonitorMap(containerId) {
    $("#" + containerId).css("height", (parseFloat($("#" + containerId).parent().css("height")) - parseFloat($("#" + containerId).parent().find(".title_fen").css("height"))) + "px");
    var isExists = false;
    var mapCharts;
    AllCharts.forEach(function (e, index) {
        if (e.ID == containerId) {
            isExists = true;
            mapCharts = e.Chart;
            mapCharts.resize();
        }
    });
    if (!isExists) {
        mapCharts = echarts.init($("#" + containerId)[0]);
        $("#" + containerId).closest(".dataBox").find(".legend").each(function () {
            var id = parseInt($(this).attr("data-id"));
            $(this).click(function () {
                mapCharts.dispatchAction({
                    type: "legendToggleSelect",
                    name: colors[id - 1].name + containerId
                })
            });
        });
        AllCharts.push({
            ID: containerId,
            Chart: mapCharts
        });
    }
    var colors = [
        { name: "浏览", value: "#fa8354" }, { name: "订阅收藏", value: "#4cafd0" }, { name: "参加活动", value: "#6cc788" },
        { name: "400电话", value: "#f53972" }, { name: "IM聊天", value: "#9c64b5" }];
    if (!cacheDatas.DataMonitorMap.IsExists) {
        $.ajax({
            url: urlstr + "DataMonitorMap" + hz,
            data: "type=0&newcode=" + GetSearchCondition(),
            success: function (result) {
                result = JSON.parse(result);
                if (result != null && result.IsSuccess == true) {
                    setMapData(containerId, mapCharts, result);
                    cacheDatas.DataMonitorMap.IsExists = true;
                    cacheDatas.DataMonitorMap.Data = result;
                }
            }
        });
    } else {
        setMapData(containerId, mapCharts, cacheDatas.DataMonitorMap.Data);
    }
}
// PartPF END
// 
// PartPG START
function initPartPG(){
    var containerWidth = $("#terminalChart").parent(".data_plus").width();
    var containerHeight = $("#terminalChart").parent(".data_plus").height()-53; 
    $("#terminalChart").width(containerWidth * 1 + "px");
    $("#terminalChart").height(containerHeight * 1 + "px"); 
    var myChart =echarts.init(document.getElementById('terminalChart'))
    option = {
    tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        show : false,
          orient: 'vertical',
          x: 'left',
          data:['WAP','APP','PC']
      },
      series: [
        {
            name: '终端分布',
            type: 'pie',
            clockWise: true,
            hoverAnimation: false,
            radius: ['36.96%', '39.6%'],
            label: {
                normal: {
                    position: 'center'
                }
            },
            data: [{
                value: 1,
                label: {
                    normal: {
                        formatter: '终端分布',
                        textStyle: {
                            color: '#333',
                            fontSize: 12
                        }
                    }
                },
                itemStyle: {
                  normal: {
                    color: '#fdd5d8'
                  },
                  emphasis:{
                     color: '#fdd5d8'
                  }
                },
                tooltip: {
                  show:false
                }
            }]
        },
          {
              name:'终端分布',
              type:'pie',
              radius: ['55.44%', '62.832%'],
              avoidLabelOverlap: true,
              itemStyle:{
                normal:{
                     borderWidth: 2,
                     borderColor:"#fdfdfd"
                }
              },
              label: {
                  normal: {
                    formatter : '{b}\n{d}%',
                      textStyle: {
                        align:'left',
                        fontSize: 12,
                        color: '#666'
                    }
                  },
                  emphasis: {
                      show: true
                  }
              },
              data:[
                  {value:8, name:'WAP'},
                  {value:12, name:'PC'},
                  {value:2, name:'APP'}
              ]
          }
      ],
      color : ['#b4a6cf','#53d6f3','#76dfcb']
  };
  myChart.setOption(option) 
}
function startmarquee(lh, speed, delay) {
    var t;
    var p = false;
    var o = document.getElementById("marqueebox");
    o.innerHTML += o.innerHTML;
    o.onmouseover = function() { p = true }
    o.onmouseout = function() { p = false }
    o.scrollTop = 0;

    function start() {
        t = setInterval(scrolling, speed);
        if (!p) { o.scrollTop += 1; }
    }

    function scrolling() {
        if (o.scrollTop % lh != 0) {
            o.scrollTop += 1;
            if (o.scrollTop >= o.scrollHeight / 2) o.scrollTop = 0;
        } else {
            clearInterval(t);
            setTimeout(start, delay);
        }
    }
    setTimeout(start, delay);
}
startmarquee(25,40,0); 

$(function(){
    setInterval(function(){
        $(".num-box li").each(function(index,el){
           //$(".num-box li").eq(index).animateNumber({ number: $(".num-box li").eq(index).text()})
           $(".num-box li").eq(index).animateNumber({ number: $(".num-box li").eq(index).text()})
        })
    },3000)
    
})