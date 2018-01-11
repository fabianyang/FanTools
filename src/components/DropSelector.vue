<template>
    <div :class="klass" :style="styl">
        <div class="drop-selector-t" @click="this.panelState = !this.panelState">
            <p>{{ textHolder }}</p>
            <span class="multidrop-selectoror-checkCount">{{ checkedCount }}
            </span>
            <i></i>
        </div>
        <div class="drop-selector-c" v-if="multi" v-show="panelState">
            <ul class="clearfix" v-if="canSearch">
                <li style="border-bottom: 1px solid #ccc">
                    <input type="text" placeholder="keywordHolder" v-model="keyword"/>
                </li>
            </ul>
            <ul class="clearfix" v-if="canSelectAll">
                <li>
                    <label for="component_multidrop-selectoror_all" style="width:100%;display:block;cursor:pointer;"><input type="checkbox" id="component_multidrop-selectoror_all" data-name='all' v-model="allChecked" /> 全选</label>
                </li>
            </ul>
            <ul style="max-height:200px;overflow-x:hidden;">
                <li v-for="(item, index) in list" :key="index" v-show="!keyword || itemFilter(item)">
                    <label :for="'component_multidrop-selectoror_item_' + index" style="width:100%;display:block;cursor:pointer;"><input type="checkbox" :id="'component_multidrop-selectoror_item_' + index" v-model="item.checked" /> {{ item.text }}</label>
                </li>
            </ul>
            <ul class="clearfix">
                <li class="multidrop-selector-button-box">
                    <a class="btn multidrop-selector-button" @click="okClick">确定</a>
                    <a class="btn multidrop-selector-button" @click="panelState=false">取消</a>
                </li>
            </ul>
        </div>
        <div class="drop-selector-c" v-else v-show="panelState">
            <ul class="clearfix" v-if="canSearch">
                <li style="border-bottom: 1px solid #ccc">
                    <input type="text" placeholder="keywordHolder" v-model="keyword"/>
                </li>
            </ul>
            <ul v-if="canSelectAll">
                <li v-if="showAll" @click="selected(all, 0)">{{ '全部' }}</li>
            </ul>
            <ul style="max-height:200px;overflow-x:hidden;">
                <li v-for="(item, index) in list" :key="index" @click="selected(item, showAll ? index + 1 : index)" v-text="item.text" v-show="!keyword || itemFilter(item)"></li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Dropdrop-selectoror',
    props: {
        data: {
            type: Array,
            default: []
        },
        textKeyName: {
            type: String,
            default: 'text'
        },
        klass: {
            type: String,
            default: 'drop-selector'
        },
        style: {
            type: Object
        },
        textHolder: {
            type: String,
            default: '请选择'
        },
        itemIsText: {
            type: Boolean,
            default: true
        },
        multi: {
            type: Boolean,
            default: false
        },
        canSearch: {
            type: Boolean,
            default: false
        },
        canSelectAll: {
            type: Boolean,
            default: false
        },
        filterKeys: {
            type: String,
            default: 'text'
        },
        keywordHolder: {
            type: String,
            default: '输入关键字搜索'
        },
        maxSelectCount: {
            type: Number,
            default: 0
        },
        minSelectCount: {
            type: Number,
            default: 0
        }
    },
    watch: {
        datas() {
        },
        tragger(nv) {
        },
    },
    data() {
        // 判断是否都为字符串，判断是否有 checked 进行替换。
        // 判断是否第一个默认选择为显示文字
        // 判断是否默认全选，或部分选中

        return {
            // 面板状态，显示、隐藏。
            panelState: false,
            // 面板位置。
            coordinates: {},
            inputKeyword: '',
            list: data
        }
    },
    computed: {
        allChecked: {
            get() {
                return this.checkedCount === this.list.length;
            },
            set(value) {
                this.list = this.list.map((item) => {
                    item.checked = value;
                    return item;
                });
            }
        },
        checkedCount: {
            get() {
                let count = this.list.filter((item) => {
                    return item.checked || false;
                }).length;

                if (count === this.list.length) {
                    this.place = '全选';
                } else if (count === 0) {
                    this.place = '请选择';
                } else {
                    this.place = '部分选择';
                }
                return count;
            }
        }
    },
    methods: {
        close(e) {
            if (!this.$el.contains(e.target)) {
                this.panelState = false;
            }
        },
        toggle() {
            this.panelState = !this.panelState;
        },
        itemCheckClick(item) {
            this.list = this.list.map((v) => {
                if (item.key === v.key) {
                    v.checked = item.checked;
                }
                return v;
            });
        },
        itemFilter(item) {
            let exp = new RegExp(this.keyword.toLowerCase(), 'gi');
            let str = [item.text.toLowerCase()];
            if (this.filterkeys) {
                this.filterkeys.split(',').forEach((v) => {
                    str.push(item[v].toLowerCase());
                });
            }
            return exp.test(str.join(','));
        },
        okClick() {
            let result = [];
            this.list.forEach((item, index) => {
                if (item.checked) {
                    result.push(Object.assign({}, item, {
                        key: item.key,
                        text: item.text,
                        index
                    }));
                }
            });

            if (this.eventName) {
                this.$emit(this.eventName, result);
            }

            this.panelState = false;
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('click', this.close);
        });
    },
    beforeDestroy() {
        window.removeEventListener('click', this.close);
    }
}

</script>

<style lang="scss" scoped>
div, ul, li{
  margin: 0;
  padding: 0;
}
ul,
li {
  list-style: none;
}
a {color: #333; text-decoration: none; outline: 0 }
a:hover{color: #333; text-decoration: none;
    cursor: pointer;
}

.drop-selector {
    font-size: 12px;
    position: relative;
    color: #666;
}

.drop-selector-t {
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

.multidrop-selectoror-checkCount {
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

.drop-selector-t i {
    display: inline-block;
    width: 10px;
    height: 6px;
    // background: url(../images/sprite.png) -76px -1px;
}

.drop-selector-t i {
    position: absolute;
    top: 50%;
    right: 6px;
    margin: 0;
    margin-top: -3px;
}

.drop-selector-c {
    width: 200%;
    display: none;
}

.drop-selector-c {
    position: absolute;
    z-index: 6;
    left: 0;
    right: 0;
    border: 1px solid #ddd;
    background: #fff;
}

.drop-selector-c li {
    // border-bottom: 1px solid rgb(204, 204, 204);
    line-height: 32px;
    height: 32px;
    padding-left: 6px;
    cursor: pointer;
    background: #fff;
}

.drop-selector-c li label {
    width: 100%;
    display: block;
    cursor: pointer;
}

input[type=checkbox], input[type=radio] {
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 0;
}

input, drop-selector, textarea {
    border: none;
    outline: 0;
    background: 0 0;
}

input {
    line-height: normal;
}

button, input, optgroup, drop-selector, textarea {
    font: inherit;
    margin: 0;
    color: inherit;
}

.drop-selector-c .multidrop-selector-button-box {
    line-height: 24px;
    height: 24px;
    padding: 3px;
    border-top: 1px solid #ccc;
}

.dt-left .multidrop-selector-button {
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

