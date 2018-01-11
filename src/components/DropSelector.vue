<template>
    <div class="select" :style="styl" :class="klass">
        <div class="select-t" @click="toggle">
            <p>{{ place }}</p>
            <span class="multiSelector-checkCount">{{ checkedCount }}
            </span>
            <i></i>
        </div>
        <div class="select-c" v-show="show" style="width:200%;">
            <ul class="clearfix">
                <li style="border-bottom: 1px solid #ccc">
                    <input type="text" placeholder="输入关键字搜索" v-model="keyword" />
                </li>
                <li>
                    <label for="component_multiSelector_all" style="width:100%;display:block;cursor:pointer;"><input type="checkbox" id="component_multiSelector_all" data-name='all' v-model="allChecked" /> 全选</label>
                </li>
            </ul>
            <ul style="max-height:200px;overflow-x:hidden;">
                <li v-for="(item, index) in list" :key="index" v-show="!keyword || itemFilter(item)">
                    <label :for="'component_multiSelector_item_' + index" style="width:100%;display:block;cursor:pointer;"><input type="checkbox" :id="'component_multiSelector_item_' + index" v-model="item.checked" /> {{ item.text }}</label>
                </li>
            </ul>
            <ul class="clearfix">
                <li class="multiSelect-button-box">
                    <a class="btn multiSelect-button" @click="okClick">确定</a>
                    <a class="btn multiSelect-button" @click="show=false">取消</a>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    name: 'DropSelector',
    props: ['datas', 'option', 'tragger'],
    watch: {
        datas() {
        },
        tragger(nv) {
        }
    },
    data() {
        return {

        }
    }
}

</script>

<style lang="scss" scoped>
// .select.sty2 {
//     margin-right: 15px;
//     margin-left: 0
// }

// .select.sty1 {
//     margin-left: 0
// }

.select {
    font-size: 12px;
    position: relative;
    color: #666;
}

.select-t {
    padding: 3px 20px 3px 6px;
    text-align: left;
    cursor: pointer;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 3px;
    background-color: #fff;
}

span {
    font-size: 14px;
    position: relative;
    float: left;
    padding: 10px 12px;
    cursor: pointer;
    text-align: center;
    color: #333;
}

.multiSelector-checkCount {
    font-size: 12px;
    line-height: 24px;
    position: absolute;
    top: 1px;
    right: 20px;
    display: block;
    height: 24px;
    margin: 0;
    padding: 0;
}

.select-t i {
    display: inline-block;
    width: 10px;
    height: 6px;
    // background: url(../images/sprite.png) -76px -1px;
}

.select-t i {
    position: absolute;
    top: 50%;
    right: 6px;
    margin: 0;
    margin-top: -3px;
}

.select-c {
    width: 200%;
    display: none;
}

.select-c {
    position: absolute;
    z-index: 6;
    left: 0;
    right: 0;
    border: 1px solid #ddd;
    background: #fff;
}

.select-c li {
    // border-bottom: 1px solid rgb(204, 204, 204);
    line-height: 32px;
    height: 32px;
    padding-left: 6px;
    cursor: pointer;
    background: #fff;
}

.select-c li label {
    width: 100%;
    display: block;
    cursor: pointer;
}

input[type=checkbox], input[type=radio] {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
}

input, select, textarea {
    border: none;
    outline: 0;
    background: 0 0;
}

input {
    line-height: normal;
}

button, input, optgroup, select, textarea {
    font: inherit;
    margin: 0;
    color: inherit;
}

.select-c .multiSelect-button-box {
    line-height: 24px;
    height: 24px;
    padding: 3px;
    border-top: 1px solid #ccc;
}

.dt-left .multiSelect-button {
    line-height: 24px;
    display: block;
    float: right;
    margin-left: 10px;
    padding: 0 5px;
}

.btn {
    display: inline-block;
    margin-left: 20px;
    padding: 3px 10px;
    cursor: pointer;
    border: 1px solid #dcdcdc;
    border-radius: 3px;
    background-color: #fff;
}

</style>

