<template>
    <div id="app">
        <div class="chart-box clearfix">
            <tab-title title="单项选择" tip="非搜索模式">
            </tab-title>
            <div class="chart-box-con">
                <drop-selector :data="data" text-key-name="city" @change="singleChange"></drop-selector>
            </div>
        </div>

        <div class="chart-box clearfix">
            <tab-title title="单项选择" tip="搜索模式 filter-keys 为过滤字段，默认为 'text'">
            </tab-title>
            <div class="chart-box-con">
                <drop-selector :data="dataSearch" text-key-name="city" @change="singleChange" can-search filter-keys="suoxie,pinyin"></drop-selector>
            </div>
        </div>

        <div class="chart-box clearfix">
            <tab-title title="多项选择" tip="default-select-all 默认全选">
            </tab-title>
            <div class="chart-box-con">
                <drop-selector :data="dataMulti" text-key-name="city" @change="multiChange" multi default-select-all></drop-selector>
            </div>
        </div>

        <div class="chart-box clearfix">
            <tab-title title="多项选择" tip="搜索模式 同样可以设置 filter-keys 枚举模式">
            </tab-title>
            <div class="chart-box-con">
                <drop-selector :data="dataMultiSearch" text-key-name="city" @change="multiChange" multi can-search enum-select></drop-selector>
            </div>
        </div>

    </div>
</template>

<script>
import data from '@/data/api'
import TabTitle from '@/components/TabTitle';
import DropSelector from '@/components/DropSelector';

export default {
    name: 'app',
    components: {
        TabTitle,
        DropSelector
    },
    data() {
        return {
            data: JSON.parse(JSON.stringify(data.data)),
            dataSearch: JSON.parse(JSON.stringify(data.data)),
            dataMulti: JSON.parse(JSON.stringify(data.data)).splice(-10),
            dataMultiSearch: JSON.parse(JSON.stringify(data.data)).splice(0, 10)
        }
    },
    methods: {
        singleChange(data) {
            console.log(data);
        },
        multiChange(data) {
            console.log(data);
        }
    },
    created() {
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
