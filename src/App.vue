<template>
    <div id="app">
        <div class="chart-box clearfix">
            <tab-title title="单日期选择器" tip="只传入 v-model">
            </tab-title>
            <div class="chart-box-con">
                <date-picker v-model="dateSingle" @input="dateSingleChange"></date-picker>
            </div>
        </div>
        <div class="chart-box clearfix">
            <tab-title title="区间选择器" tip="range 参数为 common">
            </tab-title>
            <div class="chart-box-con">
                <date-picker range="common" v-model="dateCommon" @input="dateCommonChange"></date-picker>
            </div>
        </div>
        <div class="chart-box clearfix">
            <tab-title title="周选择器" tip="range 参数为 week 默认 weekStart 参数为 0">
            </tab-title>
            <div class="chart-box-con">
                <date-picker range="week" v-model="dateWeek" @input="dateWeekChange"></date-picker>
            </div>
        </div>
        <div class="chart-box clearfix">
            <tab-title title="周选择器" tip="range 参数为 week 设置 weekStart 参数为 5 从周五算作周起始">
            </tab-title>
            <div class="chart-box-con">
                <date-picker range="week" :week-start="5" v-model="dateWeek" @input="dateWeekChange"></date-picker>
            </div>
        </div>
        <div class="chart-box clearfix">
            <tab-title title="单选择器" tip="格式化日期格式">
            </tab-title>
            <div class="chart-box-con">
                <date-picker v-model="dateSingle" @input="dateSingleChange" format="yyyy/MM/dd"></date-picker>
            </div>
        </div>
        <div class="chart-box clearfix">
            <tab-title title="区间选择器" tip="使用工具栏触发">
            </tab-title>
            <div class="chart-box-con">
                <date-picker range="week" v-model="dateCommon" @input="dateCommonChange" useTools></date-picker>
            </div>
        </div>
        <a href="https://github.com/yangfan86/VuTooz.git">
            <img style="position: absolute; top: 0; right: 0; border: 0;" src="./assets/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f7265645f6161303030302e706e67.png" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png">
        </a>
    </div>
</template>

<script>
// 滚动条跳动 https://www.cnblogs.com/good10000/p/4797973.html
// forkme 彩带 https://www.cnblogs.com/bluetata/articles/8127064.html
import TabTitle from '@/components/TabTitle';
import DatePicker from '@/components/DatePicker';

// 格式化日期，返回2017-04-07格式
const formatDate = (date) => {
    let ny = date.getFullYear(),
        nm = (date.getMonth() + 101).toString().substr(1),
        nd = (date.getDate() + 100).toString().substr(1);
    return ny + '-' + nm + '-' + nd;
}

// 获取当前月的第一天
const getCurrentMonthFirst = () => {
    var date = new Date();
    date.setDate(1);
    return date;
}

// 获取当前月的最后一天
const getCurrentMonthLast = () => {
    var date = new Date();
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    return new Date(nextMonthFirstDay - oneDay);
}

export default {
    name: 'app',
    components: {
        TabTitle,
        DatePicker
    },
    data() {
        return {
            dateSingle: formatDate(new Date()),
            dateCommon: [formatDate(getCurrentMonthFirst()), formatDate(getCurrentMonthLast())],
            dateWeek: [formatDate(getCurrentMonthFirst())]
        }
    },
    methods: {
        dateSingleChange(date) {
            console.log(date);
        },
        dateCommonChange(date) {
            console.log(date);
        },
        dateWeekChange(date) {
            console.log(date);
        }
    },
    created() {
        // 初始化日期
        this.timeStart = formatDate(getCurrentMonthFirst());
        this.timeEnd = formatDate(getCurrentMonthLast());
    }
}
</script>

<style>
/*basc*/
body, div, h1, h2, h3, h4, h5, h6, p, ul, li {margin: 0;padding: 0}
img {border: 0}
ul,li{list-style: none}
h1, h2, h3, h4, h5, h6 {font-size: 100% }
input::-ms-clear {display: none }
/*scrollbar*/
::-webkit-scrollbar-track-piece {background-color: #fff;-webkit-border-radius: 3px}
::-webkit-scrollbar {width: 12px;height: 10px}
::-webkit-scrollbar-thumb {height: 30px;background-color: #999;-webkit-border-radius: 7px;outline: 2px solid #fff;outline-offset: -2px;border: 2px solid #fff}
::-webkit-scrollbar-thumb:hover {height: 30px;background-color: #9f9f9f;-webkit-border-radius: 8px}

.clearfix:after{content:"";height:0;line-height:0;display:block;visibility:hidden;clear:both}
.clearfix{zoom:1;}
body{background: #f3f3f3;}
body{font: 12px/1.5 "arial","Microsoft YaHei"; color:#333 }
a {color: #333; text-decoration: none; outline: 0 }
a:hover{color: #333; text-decoration: underline }
:-moz-placeholder {color: #999; opacity:1; }
::-moz-placeholder {color: #999;opacity:1;}
input:-ms-input-placeholder{color: #999;opacity:1;}
input::-webkit-input-placeholder{color: #999;opacity:1;}
input:focus{border-color: #b5bcc9; outline: none; box-shadow: 0;}
button:focus{border-color: none; outline: none;}

body {
    padding-left: calc(100vw - 100%);
}

@media screen and (max-width: 1150px) {
   body {
       margin-left: calc(100% - 100vw);
   }
}

</style>

<style lang="scss">
#app {
    width: 750px;
    margin: 0 auto;
    border: 1px solid #ccc;
    min-height: 768px;
    box-sizing: border-box;
    position: relative;
}

.chart-box {
    background: #fdfdfd;
    border: 1px solid #ececec;
    margin-top: 10px;
}

.chart-box-con {
    padding: 20px;
    position: relative;
    min-height: 38px;
}
</style>
