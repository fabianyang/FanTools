function fangSidebar(userConfig) {
    var cfg = {
        sidebarID: '#side',
        topbarID: '#top',
        sideItems: [
            {
                icon: '&#xe609;',
                name: '首页',
                link: '/Index.html'
            },
            {
                icon: '&#xe609;',
                name: '天下云',
                link: '//baidu.com'
            },
            {
                icon: '&#xe60a;',
                name: '广告',
                link: '//baidu.com'
            },
            {
                icon: '&#xe604;',
                name: '搜房帮',
                link: '//baidu.com'
            },
            {
                icon: '&#xe603;',
                name: '周边顾问',
                link: '//baidu.com'
            },
            {
                icon: '&#xe606;',
                name: '二手房版',
                link: '//baidu.com'
            },
            {
                icon: '&#xe605;',
                name: '购房帮',
                link: '//baidu.com'
            },
            {
                icon: '&#xe607;',
                name: '管理系统',
                link: '//baidu.com'
            },
            {
                icon: '&#xe602;',
                name: '卖新房',
                link: '//baidu.com'
            }
        ],
        topItems: [
            {
                name: '费用',
                icon: 'money',
                subMenu: [
                    {
                        link: './charge.html',
                        name: '充值'
                    },
                    {
                        link: './orderlist.html',
                        name: '订单'
                    },
                    {
                        link: './balance.html',
                        name: '余额'
                    },
                    {
                        link: './expense.html',
                        name: '进入财产中心'
                    }
                ]
            },
            {
                name: '全部产品',
                icon: ''
            }
        ],
        user: {
            pic: '//brofen.cn/images/icon.png',
            name: '王朝阳王朝阳王朝阳[wangchaoyang] ',
            subMenu: [
                {
                    link: './myinfo.html',
                    name: '个人资料'
                },
                {
                    link: './myenterprise.html',
                    name: '我的企业'
                },
                {
                    link: './logout.html',
                    name: '登出'
                }
            ]
        },
        created: function () {
            console.log('初始化完成');
        }
    };

    cfg = extend({}, cfg, userConfig);

    /**
     * 模拟$.extend()
     */
    function extend(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            if (!arguments[i])
                continue;

            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key))
                    out[key] = arguments[i][key];
            }
        }

        return out;
    }
    
    /**
     * 插入HTML
     */
    function appendHTML(el, html) {
        var divTemp = document.createElement('div'),
            nodes = null,
            fragment = document.createDocumentFragment();
        divTemp.innerHTML = html;
        nodes = divTemp.childNodes;
        for (var i = 0, length = nodes.length; i < length; i++) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        el.appendChild(fragment);
        nodes = null;
        fragment = null;
    }
    
    /**
     * 添加class
     */
    function addClass(el, className) {
        if (el.classList){
            el.classList.add(className);
        } else {
            el.className += ' ' + className;
        }
    }

    /**
     * 移除class
     */
    function removeClass(el, className) {
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    /**
     * 是否有class
     */
    function hasClass(el, className) {
        if (el.classList){
            return el.classList.contains(className);
        }
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }


    /**
     * [loadStyleFile 加载CSS]
     * @param  {[type]} url  [css文件地址]
     * @param  {[type]} succ [成功回调]
     * @param  {[type]} fail [失败回调]
     */
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

    /**
     * 绑定事件
     * @param {any} obj 对象
     * @param {any} sEv 事件名称
     * @param {any} fn 回调函数
     */
    function addEvent(obj, sEv, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(sEv, fn, false);
        } else {
            obj.attachEvent('on' + sEv, fn);
        }
    }
    
    /**
     * 初始化侧边栏HTML
     */
    function initSideHTML() {
        document.querySelector(cfg.sidebarID).innerHTML = '<div class="p-sidebar"><div class="logo"><a href="javascript:;"></a></div><div class="side-bar-coll"><span></span></div><ul class="p-sidebar-menu clearfix" id="p-sidebar-menu"></ul></div>';
    }

    /**
     * 初始化侧边栏列表
     * @param {Array} 侧边栏列表配置项
     */
    function initSideItem(items) {
        var listHTML = '';
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            var url = item.link || 'javascript:;';
            var className = item.name === cfg.sidebarActive ? 'open' : '';
            listHTML += '<li class="' + className + '"><a href="' + url + '"><span class="box-ico"><i class="ico">' + item.icon + '</i></span><span class="title">' + item.name + '</span></a></li>';
        }
        document.querySelector('#p-sidebar-menu').innerHTML = listHTML;
    }
    
    /**
     * 初始化顶栏HTML
     */
    function initTopHTML() {
        document.querySelector(cfg.topbarID).innerHTML = '<div class="p-head"><div class="header clearfix"><div class="headerr" id="headerr"></div></div></div>';
    }
    
    /**
     * 初始化顶栏用户
     * @param {Object} 用户配置项
     */
    function initTopUser(info) {
        var url = info.link || 'javascript:;';
        var listHTML = '<div class="user-select drop-item"><p>' + info.name + '</p>' + getHeadDropList(info) + '</div><div class="userpic"><a href="' + url + '"><img src="' + info.pic +'" /></a></div>';
        appendHTML(document.querySelector('#headerr'), listHTML);
    }
    
    /**
     * 初始化顶栏列表
     * @param {Array} 顶栏列表配置项
     */
    function initTopItem(items) {
        var listHTML = '';
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            listHTML += '<div class="header-item drop-item"><span class="' + item.icon + '">' + item.name + '</span>' + getHeadDropList(item) + '</div>';
        }
        var ul = document.createElement('ul');
        ul.innerHTML = listHTML;
        appendHTML(document.querySelector('#headerr'), listHTML);
    }

    /**
     * 初始化顶栏下拉菜单
     * @param {Array} 下拉菜单配置项
     */
    function getHeadDropList(info) {
        var subMenu = info.subMenu;
        if (!subMenu) {
            return '';
        }
        var listHTML = '<div class="head-drop-list"><ul>';
        for (var i = 0; i < subMenu.length; i++) {
            var element = subMenu[i];
            listHTML += '<li><a href="' + element.link + '">' + element.name + '</a></li>';
        }
        return listHTML += '</ul></div>';
    }

    /**
     * 缩放侧边栏事件
     */
    function bindToggleSidebar() {
        var coll = document.querySelector('.side-bar-coll');
        addEvent(coll, 'click', function () {
            var body = document.body;
            if (hasClass(body, 'p-sidebar-closed')) {
                removeClass(body, 'p-sidebar-closed');
            } else {
                addClass(body, 'p-sidebar-closed');
            }
        });
    }

    /**
     * 初始化完成
     */
    function onCreated() {
        cfg.created && cfg.created();
    }

    (function init() {
        loadStyleFile('//dev.brofen.cn/Fang/fang-sidebar/qietu/static/css/sidebar.css', function () {
            initSideHTML();
            initSideItem(cfg.sideItems);
            bindToggleSidebar();
    
            initTopHTML();
            initTopUser(cfg.user);
            initTopItem(cfg.topItems);
    
            onCreated();
        }, function () {
            console.error('样式加载失败');
        });
    })();
}