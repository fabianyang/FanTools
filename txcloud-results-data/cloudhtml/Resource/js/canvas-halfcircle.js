var halfCircleCharts = [];
function DrawHalfCircle(opt) {
    if (!opt) {
        console.log("未设置Option！");
        return;
    }
    if (!opt.cid || !opt.bkid) {
        console.log("未设置cid或bkid");
        return;
    }
    var option = {
        cid: opt.cid,
        bkid: opt.bkid,
        timeline: opt.timeline,
        location :["50%","95%"],
        data: opt.data ? opt.data : { rank: "", name: "", value: "" },
        circlesize: opt.circlesize ? opt.circlesize : (opt.circlesize > 0 ? opt.circlesize : 1),
        bkcirclesize: opt.bkcirclesize ? (opt.bkcirclesize > 0 ? opt.bkcirclesize : 1) : 1 ,
        radiuspercent: opt.radiuspercent || 0.75
    //radius: opt.radius ? opt.radius : ($("#" + opt.cid).width() > $("#" + opt.cid).height() ? $("#" + opt.cid).height() : $("#" + opt.cid).width()) * 5 / 8
};
    var series = [];
    var seriesNull = [];
    var maxRadius = option.radius;
    var div = document.getElementById(option.cid);
    var max = div.clientHeight > div.clientWidth / 2 ? div.clientWidth / 2 : div.clientHeight;
    // 初始化背景虚线圆
    for (var i = 0; i < option.bkcirclesize; i++) {
        series.push({
            type: 'pie',
            radius: [(max * option.radiuspercent / option.bkcirclesize) * (i + 1), (max * option.radiuspercent / option.bkcirclesize) * (i + 1)],
            center: ["50%", "95%"],
            data: option.data,
            startAngle: 180,
            hoverAnimation: false,
            label: {
                normal: {
                    show: false
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    borderColor: '#8ce0f4', //圆环颜色
                    borderWidth: 1,
                    borderType: 'dashed',
                    opacity: 0.5
                }
            }
        });
    }
    if (opt.data) {
        series.push(
            {
                name: 'HalfCircle',
                type: 'pie',
                radius: max * option.radiuspercent,
                startAngle: 180,
                center: option.location,
                z: 3,
                data: option.data,
                roseType: 'area',
                label: {
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: function (params) {
                            //return colorsA[params.dataIndex];
                            return '#32cef1';//, '#FFF0F5' 扇形颜色
                        },
                        borderColor: 'white',
                        borderWidth: 0,
                        opacity: 0.36
                    }
                },
                animationEasing: 'elasticOut',
                animationDelay: 1000,
                animationDuration: 1000,
                animationEasingUpdate: "elasticOut",
                animationDurationUpdate: 1000
            }
        );
        seriesNull.push(
            {
                name: 'HalfCircle',
                type: 'pie',
                radius: max * option.radiuspercent,
                startAngle: 180,
                center: option.location,
                z: 3,
                data: [],
                roseType: 'area',
                label: {
                    normal: {
                        show: false
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: function (params) {
                            //return colorsA[params.dataIndex];
                            return '#C0C0C0';//, '#FFF0F5'
                        },
                        borderColor: 'white',
                        borderWidth: 0,
                        opacity: 0.3
                    }
                }
            }
        );
    }
    var chartsOption;
    if (!option.timeline) {

    } else {
        chartsOption = {
            baseOption: {
                timeline: {
                    show: false,
                    axisType: 'category',
                    orient: 'vertical',
                    autoPlay: true,
                    inverse: true,
                    playInterval: 1000,
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
                    data: [1, 2]
                }
            },
            options: [
                { series: series },
                { series: seriesNull }
            ]
        };
    }
    function drawBackGroudImg(id, data) {
        var dataname = data.map(function (node) { return node.name; });
        var elm = document.getElementById(id);
        elm.setAttribute('width', div.clientWidth);
        elm.setAttribute('height', div.clientHeight);
        var circleData = { x: div.clientWidth / 2, y: div.clientHeight * 0.95, r: max * 0.95 };
        if (elm.getContext) {
            var canvas = elm.getContext('2d');
            var len = dataname.length / 2;
            var dataAngle = Math.PI / len;
            var newradius = max * (option.radiuspercent + 0.05);
            var chartsradius = max * option.radiuspercent;
            canvas.translate(circleData.x, circleData.y);
            canvas.beginPath();
            canvas.strokeStyle = '#7fdcf2';
            canvas.lineWidth = 1;
            canvas.arc(0, 0, newradius, Math.PI, Math.PI * 2, false);
            canvas.stroke();
            //画底边点
                var pr = -chartsradius,
				mr = chartsradius / 40;
            while (pr <= chartsradius) {
                canvas.beginPath();
                canvas.fillStyle = '#7fdcf2';
                canvas.lineWidth = 3;
                canvas.moveTo(pr - mr, chartsradius * 0.05);
                canvas.lineTo(pr + mr, chartsradius * 0.05);
                canvas.stroke();
                pr += chartsradius / option.circlesize;
            }
            for (var j = 0; j < len + 1; j++) {
                canvas.rotate(j === 0 ? Math.PI : dataAngle);
                //画直线
                canvas.fillStyle = '#7fdcf2';
                canvas.lineWidth = 0.2;
                canvas.moveTo(0, 0);
                canvas.lineTo(newradius, 0);
                canvas.stroke();
                //画线头
                canvas.beginPath();
                canvas.lineWidth = 3;
                var remove = 4;
                canvas.strokeStyle = '#7fdcf2';
                canvas.lineCap = "round";
                canvas.moveTo(newradius, 0);
                canvas.lineTo(newradius + remove, 0);
                canvas.stroke();

                //画扇形横线

                //写编号
                //var pieWidth = circleData.r * 0.85 * Math.sin(dataAngle);
                //for (var m = 1; m < 4; m++) {
                //    canvas.save();
                //    canvas.rotate(dataAngle / 4 * m);
                //    canvas.beginPath();
                //    if (m === 2) {
                //        canvas.save();
                //        canvas.fillStyle = '#606C82';
                //        canvas.font = '8px 微软雅黑';
                //        canvas.textAlign = 'center';
                //        canvas.textBaseline = 'middle';
                //        canvas.translate(newradius + 5, 0);
                //        canvas.rotate(Math.PI / 2);
                //        canvas.fillText("0" + (j + 1), 0, 0);
                //        canvas.restore();
                //    } else {
                //        canvas.lineWidth = 1;
                //        canvas.strokeStyle = '#606C82';
                //        canvas.lineCap = "round";
                //        canvas.moveTo(newradius + 5, -pieWidth * 0.1);
                //        canvas.lineTo(newradius + 5, pieWidth * 0.1);
                //        canvas.stroke();
                //    }

                //    canvas.restore();
                //}

                //写字
                var word = dataname[j];
                if (!word) {
                    continue;
                }
                var lens = word.length;
                var fontsize = max / 16;
                fontsize = fontsize < 12 ? 12 : fontsize;
                var fontx = newradius + (max - newradius) / 2;
                var pieWidth = fontx * Math.tan(dataAngle / 2) * 2;
                var showmax = Math.floor(pieWidth / fontsize) - 1;
                var letterAngle = dataAngle / (lens + 1);
                if (showmax < lens) {
                    letterAngle = dataAngle / (showmax + 1);
                }
                for (var i = 0; i < lens; i++) {
                        canvas.save();
                        var letter = word[i];
                        var startAngle = (i + 1) * letterAngle;
                        canvas.fillStyle = '#333';
                        canvas.font = fontsize + 'px 微软雅黑';
                        canvas.textAlign = 'center';
                        canvas.textBaseline = 'middle';
                        if (i >= showmax) {
                            canvas.restore();
                            continue;
                            //canvas.rotate((i +1- showmax) * letterAngle);
                            //canvas.translate(fontx - fontsize, 0);
                        } else {
                            canvas.rotate(startAngle);
                            canvas.translate(fontx, 0);
                        }
                        canvas.rotate(Math.PI / 2);
                        canvas.fillText(letter, 0, 0);
                        canvas.restore();
                    }
                }

        }
    }
    drawBackGroudImg(option.bkid, option.data);
    var chat;
    var isExists = false;
    halfCircleCharts.forEach(function (e) {
        if (e.ID && e.ID == option.cid) {
            isExists = true;
        }
    })
    if (isExists) {
        chat = echarts.getInstanceByDom($("#" + option.cid)[0]);
        chat.setOption(chartsOption);
        chat.resize();
    } else {
        chat = echarts.init($("#" + option.cid)[0]);
        chat.setOption(chartsOption);
        halfCircleCharts.push({
            ID: option.cid
        });
        $("#" + option.cid).mouseenter(function (e) {
            chat.dispatchAction({
                type: "timelinePlayChange",
                playState: false
            });
            $(this).mouseleave(function (e) {
                chat.dispatchAction({
                    type: "timelinePlayChange",
                    playState: true
                });
            });
        });
    }
}