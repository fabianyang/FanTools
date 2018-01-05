var configdata = {};
var allurl = window.location.href;
var id = GetQueryString("id");
//if (!id) {
//    id = "1";
//    allurl += (allurl.indexOf("?") > -1 ? "&" : "?") + "id=" + id;
//}
configdata.id = id;
var newcode = GetQueryString("newcode");
if (!newcode) {
    newcode = '3411133842';
    allurl += (allurl.indexOf("?") > -1 ? "&" : "?") + "newcode=" + newcode;
}
if (allurl != window.location.href) {
    changeURL(allurl);
   
}
configdata.newcode = newcode;
var data = [

    {
        name: "天下云", id: 1, title: "天下云", data: [
            { name: "效果数据", cls: "no-sub open", sort: 1, url: "", item: null },
            { name: "客户管理", cls: "no-sub", sort: 2, url: "", item: null },
            { name: "置业顾问", cls: "no-sub", sort: 3, url: "", item: null }
        ]
    },
    {
        name: "电商", id: 2, title: "电商", data: [
            { name: "效果数据", cls: "no-sub open", sort: 1, url: "//www.fang.com", item: null },
            { name: "报备", cls: "no-sub", sort: 2, url: "", item: null },
            {
                name: "客户", cls: "", sort: 3, url: "", item: [
                     { name: "客户管理", sort: 1, url: "//www.baidu.com" },
                     { name: "成交确认", sort: 2, url: "" }
                ]
            },
            { name: "置业顾问", cls: "no-sub", sort: 4, url: "", item: null }
        ]
    },
    {
        name: "更多", id: 3, title: "更多", data: [
            {
                name: "楼盘信息维护", cls: "", sort: 1, url: "", item: [
                    { name: "基本信息", sort: 1, url: "" },
                    { name: "楼盘动态", sort: 2, url: "" },
                    { name: "推广软文", sort: 3, url: "" },
                    { name: "相册管理", sort: 4, url: "" },
                    { name: "楼栋信息", sort: 5, url: "" },
                    { name: "户型信息", sort: 6, url: "" },
                    { name: "房源信息", sort: 7, url: "" }
                ]
            },
            {
                name: "营销活动", cls: "", sort: 1, url: "", item: [
                     { name: "网上开盘", sort: 1, url: "" }
                ]
            }
        ]
    }
];
//动态加载资源文件
function dynamicLoad(src, fun, type) {
    type = type ? type : "script";
    var _doc = document.getElementsByTagName('head')[0];
    var script = document.createElement(type);
    if (type == "script") {
        script.setAttribute('type', 'text/javascript');
    }
    else if (type == "link") {
        script.setAttribute('rel', 'stylesheet');
    }
    script.setAttribute(type == "script" ? 'src' : "href", src);
    _doc.appendChild(script);
    script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
            if (fun && typeof (fun) == "function") {
                fun();
            }
        }
        script.onload = script.onreadystatechange = null;
    };
}
function loadStyleFile(url, succ, fail) {
    var cssObj = document.createElement('link');
    cssObj.type = 'text/css';
    cssObj.rel = 'stylesheet';
    cssObj.href = url;
    cssObj.onload = function () {
        succ && succ();
    };
    cssObj.onerror = function (ev) {
        fail && fail(ev);
    };
    document.getElementsByTagName('head')[0].appendChild(cssObj);
};
//加载样式文件
function loadstyle() {
    var name = 'sidebar.css';
    var link = document.querySelectorAll("link[href*='" + name + "']");
    if (link.length == 0) {
        loadStyleFile('//dev.brofen.cn/Fang/fang-sidebar/qietu/static/css/sidebar.css', null, null);
    }
    name = "innerbar.css";
    link = document.querySelectorAll("link[href*='" + name + "']");
    if (link.length == 0) {
        loadStyleFile('Resource/css/innerbar.css', loadhtml, null);
    }
    else
        loadhtml();

}
function changeURL(replaceurl) {
    window.history.pushState({}, 0, replaceurl);
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
//加载html
function loadhtml() {
    var divhtml = "<div id='content' class='p-con'></div>";
    if (document.querySelector("#content")) {
        document.querySelector("#content").remove();
    }
    $("body").append(divhtml);

    var html = "";
    
    var id = configdata.id;
    var currdata = data.filter(function (e) {
        return e.id == id;
    });
    if (currdata && currdata.length > 0) {
        html += '<div class="sub-menu">';
        var nowdata = currdata[0];
        html += '<h3>' + nowdata.title + '</h3>';

        if (nowdata.data && nowdata.data.length > 0) {
            html += '<ul>';
            nowdata.data.sort(function (a, b) {
                return a.sort - b.sort;
            });
            for (var i = 0; i < nowdata.data.length; i++) {
                var item = nowdata.data[i];
                html += ' <li class="sub-menu-a">';
                html += '<a class="openurl ' + item.cls + '" href="' + (item.url ? item.url : 'javascript:;') + '" >' + item.name + '</a>';
                if (item.item && item.item.length > 0) {
                    html += '<ul class="sub-menu-b" style="display: none;">';
                    item.item.sort(function (a, b) {
                        return a.sort - b.sort;
                    });
                    for (var j = 0; j < item.item.length; j++) {
                        var d = item.item[j];
                        html += ' <li><a class="openurl" href="' + (d.url ? d.url : 'javascript:;') + '">' + d.name + '</a></li>';
                    }
                    html += '</ul>';
                }

                html += '</li>';
            }
            html += '</ul>';
        }
        html += '</div>';
        html += '<div class="menu-switch" id="menu-switch"></div>';
    }
    html += '<div class="p-main" style="' + (currdata && currdata.length > 0 ? "" : "padding-left:0") + '"><iframe id="framecontent" src="' + (currdata && currdata.length > 0 ? "" : "Index1.html?newcode="+configdata.newcode) + '" frameborder="0" width="100%" height="100%"></iframe></div>';
    document.querySelector("#content").innerHTML = html;
    $(".openurl").click(function (e) {
        var data = $(this).attr("href");
        if (data) {
            document.querySelector("#framecontent").src = data;
        }
        return false;
    });
    //默认打开
    var open = document.querySelector(".sub-menu .open");
    if (open) {
        var url = open.href;
        document.querySelector("#framecontent").src = url;
    }
    config && config.loadend && config.loadend();
}
//初始化要求数据
function init(fun) {
    config.loadend = fun;
    loadstyle();
};

window.LoadInnerContent = function (fun) {
    if (typeof ($) == "function") {
        init(fun);
    } else
        dynamicLoad("http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js", function () { init(fun); }, "script");
};

window.onload = function () {
    //设置菜单高度
    function setMenuheight() {
        var windh = $(window).height();
        var bodyh = $("body").height();
        var barh = bodyh;
        if (bodyh < windh) barh = windh;
        $(".p-sidebar").css('height', barh + 'px');
        $(".sub-menu").css('height', (barh - 80) + 'px');
        $('#framecontent').css("height", barh - 85 + 'px');
    }
    function loadinit() {
        //滚动窗口触发菜单高度调整
        $(window).scroll(function () {
            setMenuheight();
        });
        $(window).resize(function () {
            setMenuheight();
        });

        $('.p-con').css("minHeight", $(window).height() - 80 + 'px');

        // 头部下拉
        $(".drop-item").hover(function () {
            $(this).addClass('drop-on');
        }, function () {
            $(this).removeClass('drop-on');
        });
        //二级导航展开隐藏
        $(".sub-menu ul > .sub-menu-a >a").on("click", function () {
            $(".sub-menu ul > li >a").removeClass("open");
            $(this).addClass("open");
            $(".sub-menu ul > li .sub-menu-b").hide();
            $(this).siblings(".sub-menu-b").show();
        })
        //收起展开左侧菜单
        $(".side-bar-coll").on("click", function () {
            $("body").toggleClass("p-sidebar-closed");
        })
        //收起展开二级 菜单
        $("#menu-switch").on("click", function () {

            $(".p-con").toggleClass("sub-menu-closed");
        });
        setMenuheight();
    }
    LoadInnerContent(loadinit);


}