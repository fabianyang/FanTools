<template>
    <div :class="klaz" :style="styl">
        <div class="drop-selector-button" @click="panelState = !panelState">
            <p>{{ text }}</p>
            <span v-show="false" class="multidrop-selectoror-checkCount">{{ checkedCount }}
            </span>
            <i></i>
        </div>
        <div class="drop-selector-container" v-if="multi" v-show="panelState">
            <ul class="clearfix" v-if="canSearch">
                <li style="border-bottom: 1px solid #ccc">
                    <input type="text" placeholder="keywordHolder" v-model="inputKeyword"/>
                </li>
            </ul>
            <ul class="clearfix" v-if="canSelectAll">
                <li>
                    <label for="component_multidrop-selectoror_all" style="width:100%;display:block;cursor:pointer;"><input type="checkbox" id="component_multidrop-selectoror_all" data-name='all' v-model="allChecked" /> 全选</label>
                </li>
            </ul>
            <ul>
                <li v-for="(item, index) in list" :key="index" v-show="!inputKeyword || itemFilter(item)">
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
        <div class="drop-selector-container" v-else v-show="panelState">
            <ul class="clearfix" v-if="canSearch">
                <li style="border-bottom: 1px solid #ccc">
                    <input type="text" placeholder="keywordHolder" v-model="inputKeyword"/>
                </li>
            </ul>
            <ul>
                <li v-for="(item, index) in list" :key="index" @click="selected(item, index)" v-show="!inputKeyword || itemFilter(item)">{{ item[textKeyName] }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
// http://ourjs.com/detail/532bc9f36922aa7e1d000001
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
        klaz: {
            type: String,
            default: 'drop-selector'
        },
        styl: {
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
            list: this.data,
            itemSelected: {}
        }
    },
    computed: {
        text() {
            if (!this.multi) {
                return this.itemSelected[this.textKeyName] || this.textHolder;
            }
        },
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
        selected(item, index) {
            // 这里改了 Item, list 初始化时，最好就附上 index
            item.index = index;
            this.itemSelected = item;
            this.$emit('change', Object.assign({}, item));
            this.panelState = false;
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
            let exp = new RegExp(this.inputKeyword.toLowerCase(), 'gi');
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
  box-sizing: border-box;
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

.drop-selector-button {
    width: 240px;
    position: relative;
    padding: 3px 20px 3px 6px;
    text-align: left;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 3px;
    background-color: #fff;
    cursor: pointer;
    user-select: none;

    & > i {
        position: absolute;
        top: 50%;
        right: 6px;
        margin-top: -3px;
        font-size: 0;
    }

    & > i:after {
        border: 6px solid transparent;
        border-top: 6px solid #ccc;
        content: ' ';
        display: inline-block;
    }
}


.drop-selector-container {
    margin-top: 4px;
    position: absolute;
    min-width: 240px;
    max-width: 480px;
    border: 1px solid #ddd;
    background: #fff;
    overflow: hidden;
    white-space: nowrap;

    & > ul {
        max-height: 220px;
        overflow: auto;
    }

    & li {
        line-height: 32px;
        height: 32px;
        padding-left: 6px;
        padding-right: 20px;
        cursor: pointer;
    }

    & li:hover {
        background-color: #f0f0f0;
    }
}


.drop-selector-container li label {
    width: 100%;
    display: block;
    cursor: pointer;
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

.drop-selector-container .multidrop-selector-button-box {
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

