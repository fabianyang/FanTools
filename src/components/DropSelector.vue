<template>
    <div :class="klaz" :style="styl">
        <div class="drop-selector-button" v-if="multi && enumSelect && listChecked.length" v-show="listChecked.length" :style="coordinates"  @click="panelState = !panelState">
            <div class="drop-selector-checked" @click.stop>
                <span v-for="(item, index) in listChecked" :key="index">{{ item[textKeyName] }}<i @click.stop="item.dsChecked = !item.dsChecked"></i></span>
            </div>
            <i></i>
        </div>
        <div class="drop-selector-button" v-else @click="panelState = !panelState">
            <p>{{ text }}<em v-show="listChecked.length" >+{{ listChecked.length }}</em></p>
            <i></i>
        </div>
        <div class="drop-selector-container" v-if="multi" v-show="panelState" :style="coordinates">
            <div class="drop-selector-search" v-if="canSearch">
                <input type="text" :placeholder="keywordHolder" v-model="inputKeyword"/>
            </div>
            <ul>
                <li v-if="canSelectAll">
                    <input type="checkbox" :id="'ds_all_' + vmUid" v-model="allChecked"/><label :for="'ds_all_' + vmUid" >全选</label>
                </li>
                <li v-for="(item, index) in list" :key="index" v-show="!inputKeyword || itemFilter(item)">
                    <input type="checkbox" :id="'ds_item_' + vmUid + '_' + index" v-model="item.dsChecked" /><label :for="'ds_item_' + vmUid + '_' + index">{{ item[textKeyName] }}</label>
                </li>
            </ul>
            <div class="drop-selector-footer">
                <a class="btn" @click="okClick">确定</a>
                <a class="btn" @click="panelState=false">取消</a>
            </div>
        </div>
        <div class="drop-selector-container" v-if="!multi" v-show="panelState" :style="coordinates">
            <div class="drop-selector-search" v-if="canSearch">
                <input type="text" :placeholder="keywordHolder" v-model="inputKeyword"/>
            </div>
            <ul>
                <li v-for="(item, index) in list" :key="index" @click="selected(item, index)" v-show="!inputKeyword || itemFilter(item)">{{ item[textKeyName] }}</li>
            </ul>
        </div>
    </div>
</template>

<script>
// http://ourjs.com/detail/532bc9f36922aa7e1d000001


const gTypeString = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1);
    // return {}.toString.call(obj) == "[object " + type + "]" @seajs
};

export default {
    name: 'drop-selectoror',
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
        canSearch: {
            type: Boolean,
            default: false
        },
        keywordHolder: {
            type: String,
            default: '输入关键字搜索'
        },
        filterKeys: {
            type: String,
            default: 'text'
        },
        multi: {
            type: Boolean,
            default: false
        },
        canSelectAll: {
            type: Boolean,
            default: true
        },
        defaultSelectAll: {
            type: Boolean,
            default: false
        },
        enumSelect: {
            type: Boolean,
            default: false
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
    },
    data() {
        // 判断是否都为字符串，判断是否有 checked 进行替换。
        // 判断是否默认全选，或部分选中
        // tip：this.data 里面是对象，即使 this.data.concat() 也不是复制数组。可以用 this.$set() 但是会更改源数据。
        let list = this.data.map((v, i) => {
            const ts = gTypeString(v);

            let o = {};
            switch(ts) {
                case 'Object':
                    o = Object.assign({}, v);
                    o.dsChecked = this.defaultSelectAll || !!v.checked;
                    break;
                case 'String':
                    o[this.textKeyName] = v;
                    o.dsChecked = this.defaultSelectAll;
                    break;
            }
            return o;
        });

        return {
            vmUid: this._uid,
            // 面板状态，显示、隐藏。
            panelState: false,
            // 面板位置。
            coordinates: {},
            inputKeyword: '',
            // 单选使用
            itemSelected: {},
            list
        }
    },
    computed: {
        text() {
            if (!this.multi) {
                return this.itemSelected[this.textKeyName] || this.textHolder;
            } else {
                let text = this.textHolder;

                if (this.allChecked) {
                    text = '全选';
                } else if (this.listChecked.length) {
                    text = '已选择';
                }

                return text;
            }
        },
        allChecked: {
            get() {
                return this.listChecked.length === this.list.length;
            },
            set(value) {
                this.list.forEach((item) => {
                    this.$set(item, 'dsChecked', value);
                });
            }
        },
        listChecked() {
            return this.list.filter((item) => {
                return item.dsChecked || false;
            })
        }
    },
    methods: {
        close(e) {
            if (!this.$el.contains(e.target)) {
                this.panelState = false;
            }
        },
        selected(item, index) {
            this.itemSelected = item;
            this.$emit('change', Object.assign({}, this.data[index], {vmIndex: index}));
            this.panelState = false;
        },
        itemFilter(item) {
            const exp = new RegExp(this.inputKeyword.toLowerCase(), 'gi');
            const filterKeys = this.textKeyName + ',' + this.filterKeys;
            // 显示文本
            let str = [];
            // filterKeys 字符串
            filterKeys.split(',').forEach((v) => {
                if (v && item[v]) {
                    str.push(item[v].toLowerCase());
                }
            });
            return exp.test(str.join(','));
        },
        okClick() {
            let result = [];
            this.list.forEach((item, index) => {
                if (item.dsChecked) {
                    result.push(Object.assign({}, this.data[index], {
                        vmIndex: index
                    }));
                }
            });
            this.$emit('change', result);
            this.panelState = false;
        }
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            const el = this.$el,
                clientWidth = document.documentElement.clientWidth || document.body.clientWidth;

            // 判断面板靠左或靠右对齐
            if (this.$el.offsetLeft + 241 > clientWidth) {
                this.coordinates = { right: '0' }
            } else {
                this.coordinates = { left: '0' }
            }

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
input {margin: 0; padding:0; *font-size: 100%;}
input {
    border: none;
    outline: 0;
    background: 0 0;
}
input::-ms-clear {display: none }
input:focus{border-color: #b5bcc9; outline: none; box-shadow: 0;}
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
    box-sizing: border-box;

    & > p {
        line-height: 2;
        padding: 3px 0;
    }

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

    & em {
        font-style: normal;
        position: absolute;
        background-color: #eee;
        border-radius: 4px;
        padding: 0 6px;
        box-sizing: border-box;
        margin-left: 5px;
    }
}


.drop-selector-checked {
    max-height: 60px;
    overflow-y: auto;

    & span {
        position: relative;
        display: inline-block;
        text-align: center;
        padding: 4px 22px 4px 8px;
        background: #eee;
        color: #333;
        margin: 2px;
        border-radius: 3px;
        white-space: nowrap;
    }

    & i {
        position: absolute;
        background-color: #ccc;
        width: 12px;
        height: 12px;
        color: #fff;
        margin-left: 5px;
        transition: color .25s;
        transform: rotateZ(45deg);
        border-radius: 50%;
        margin-top: 3px;
        cursor: pointer;
    }

    & i:hover {
        background-color: #999;
        color: #eee;
    }

    & i:before {
        content: "";
        width: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-top: 2px solid;
    }

    & i:after {
        content: "";
        height: 8px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-left: 2px solid;
    }
}

.drop-selector-container {
    margin-top: 4px;
    position: absolute;
    min-width: 240px;
    max-width: 480px;
    border: 1px solid #ddd;
    background: #fff;
    border-radius: 3px;
    white-space: nowrap;
    z-index: 5000;

    &:after, &:before {
        border: 4px solid transparent;
        border-bottom: 4px solid #fff;
        width: 0;
        height: 0;
        position: absolute;
        top: -8px;
        left: 8px;
        content: ' '
    }

    &:before {
        border-bottom-color: #666;
    }

    & > ul {
        max-height: 220px;
        overflow: auto;
        box-sizing: border-box;
    }

    & li {
        line-height: 32px;
        height: 32px;
        padding-left: 6px;
        cursor: pointer;
    }

    & li:hover {
        background-color: #f0f0f0;
    }

    & li label {
        width: 100%;
        display: inline-block;
        box-sizing: border-box;
        margin-left: -18px;
        margin-right: -20px;
        text-indent: 22px;
        cursor: pointer;
    }
}

.drop-selector-search {
    line-height: 32px;
    height: 32px;
    border-bottom: 1px solid #ddd;

    & > input {
        padding: 0 5px;
        width: 100%;
        box-sizing: border-box;
    }
}

.drop-selector-all {
    line-height: 32px;
    height: 32px;
    padding-left: 6px;
    cursor: pointer;

    & > label {
        width: 100%;
        display: inline-block;
        box-sizing: border-box;
        margin-left: -18px;
        margin-right: -20px;
        text-indent: 22px;
        cursor: pointer;
    }
}


.drop-selector-footer {
    line-height: 24px;
    height: 24px;
    padding: 5px 0;
    text-align: right;
    border-top: 1px solid #ddd;
    .btn {
        font-size: 12px;
        border-radius: 2px;
        text-align: center;
        height: 24px;
        line-height: 24px;
        box-shadow: 0;
        border: none;
        display: inline-block;
        background-color: #5A95F7;
        color: #fff;
        width: 36px;
        margin-right: 6px;
    }
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


// input[type=checkbox], input[type=radio] {
//     -moz-box-sizing: border-box;
//     box-sizing: border-box;
//     padding: 0;
// }

input, drop-selector, textarea {
    border: none;
    outline: 0;
    background: 0 0;
}

// input {
//     line-height: normal;
// }

// button, input, optgroup, drop-selector, textarea {
//     font: inherit;
//     margin: 0;
//     color: inherit;
// }

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

// .btn {
//     display: inline-block;
//     margin-left: 20px;
//     padding: 3px 10px;
//     cursor: pointer;
//     border: 1px solid #dcdcdc;
//     border-radius: 3px;
//     background-color: #fff;
// }

</style>

