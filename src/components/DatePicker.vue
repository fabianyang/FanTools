<template>
    <div class="date-picker">
        <div v-if="range" class="date-select-wrapper" @click="togglePanel">
            <span class="date-select-btn" :class="buttonClass">{{ value[0] }}</span>
            <i>-</i>
            <span class="date-select-btn" :class="buttonClass">{{ value[1] }}</span>
        </div>
        <div v-else class="date-select-wrapper" @mouseenter="showCancel = true" @mouseleave="showCancel = false">
            <span class="date-select-btn" @click="togglePanel" v-text="value" :style="{ 'border-color': panelState ? '#b5bcc9' : '#d6dae1' }"></span>
            <!-- <transition name="fade">
                <img class="cancel-btn" src="./cancel.png" v-show="showCancel" @click="clear">
            </transition> -->
        </div>


        <transition name="toggle">
            <div class="date-panel" v-show="panelState" :style="coordinates">
                <div class="panel-header" v-show="panelType !== 'year'">
                    <div class="arrow-left" @click="prevMonthPreview()">&lt;</div>
                    <div class="year-month-box">
                        <div class="year-box" @click="changeType('year')" v-text="tmpYear"></div>
                        <div class="month-box" @click="changeType('month')">{{tmpMonth + 1 | month(language)}}</div>
                    </div>
                    <div class="arrow-right" @click="nextMonthPreview()">&gt;</div>
                </div>
                <div class="panel-header" v-show="panelType === 'year'">
                    <div class="arrow-left" @click="changeYearList(0)">&lt;</div>
                    <div class="year-range">
                        <span v-text="yearList[0]"></span> -
                        <span v-text="yearList[yearList.length - 1]"></span>
                    </div>
                    <div class="arrow-right" @click="changeYearList(1)">&gt;</div>
                </div>
                <div class="type-year" v-show="panelType === 'year'">
                    <ul class="year-list">
                        <li v-for="item in yearList" v-text="item" :class="{selected: isSelected('year', item), invalid: yearValidate(item)}" @click="selectYear(item)">
                        </li>
                    </ul>
                </div>
                <div class="type-month" v-show="panelType === 'month'">
                    <ul class="month-list">
                        <li v-for="(item, index) in monthList" :class="{selected: isSelected('month', index), invalid: monthValidate(index)}" @click="selectMonth(index)">
                            {{item | month(language)}}
                        </li>
                    </ul>
                </div>
                <div class="type-date" v-show="panelType === 'date'">
                    <ul class="weeks">
                        <li v-for="item in weekList">{{item | week(language)}}</li>
                    </ul>
                    <ul class="date-list">
                        <li v-for="(item, index) in dateList" :class="{prevMonth: item.prevMonth, nextMonth: item.nextMonth,
                                            invalid: dateValidate(item), firstItem: (index % 7) === 0}" @click="selectDate(item)">
                            <div class="message" :class="{selected: isSelected('date', item)}">
                                <div class="bg"></div>
                                <span v-text="item.value"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
//计算天数差的函数，通用
function DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split('-')
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2006格式
    aDate = sDate2.split('-')
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
    return iDays
}

let hasRendered = false;

export default {
    name: 'DatePicker',
    props: {
        language: { default: 'ch' },
        min: { default: '2010-01-01' },
        max: { default: '2020-01-01' },
        value: {
            type: [String, Array],
            default: ''
        },
        range: {
            type: String,
            default: ''
        },
        weekStart: {
            type: Number,
            default: 0
        },
        buttonClass: {
            type: String,
            default: 'common'
        },
        selectMaxCount: {
            type: Number,
            default: 0
        }
    },
    watch: {
        min(v) {
            let minArr = v.split('-');
            this.minYear = parseInt(minArr[0]);
            this.minMonth = parseInt(minArr[1]);
            this.minDate = parseInt(minArr[2]);
        },
        max(v) {
            let maxArr = v.split('-');
            this.maxYear = parseInt(maxArr[0]);
            this.maxMonth = parseInt(maxArr[1]);
            this.maxDate = parseInt(maxArr[2]);
        },
        range(newVal, oldVal) {
            if (newVal === oldVal) return;
            if (newVal && Object.prototype.toString.call(this.value).slice(8, -1) === 'String') {
                this.$emit('input', ['', ''])
            }
            if (!newVal && Object.prototype.toString.call(this.value).slice(8, -1) === 'Array') {
                this.$emit('input', '')
            }
        }
    },
    computed: {
        dateList() {
            let currentMonthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate()
            let dateList = Array.from({ length: currentMonthLength }, (val, index) => {
                return {
                    currentMonth: true,
                    value: index + 1
                }
            })
            let startDay = new Date(this.tmpYear, this.tmpMonth, 1).getDay()
            let previousMongthLength = new Date(this.tmpYear, this.tmpMonth, 0).getDate()
            for (let i = 0, len = startDay; i < len; i++) {
                dateList = [{ prevMonth: true, value: previousMongthLength - i }].concat(dateList)
            }
            for (let i = dateList.length, item = 1; i < 42; i++ , item++) {
                dateList[dateList.length] = { nextMonth: true, value: item }
            }
            return dateList
        }
    },
    filters: {
        week: (item, lang) => {
            switch (lang) {
                case 'en':
                    return { 0: 'Su', 1: 'Mo', 2: 'Tu', 3: 'We', 4: 'Th', 5: 'Fr', 6: 'Sa' }[item]
                case 'ch':
                    return { 0: '日', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六' }[item]
                default:
                    return item
            }
        },
        month: (item, lang) => {
            switch (lang) {
                case 'en':
                    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][item - 1];
                case 'ch':
                    return ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][item - 1]
                default:
                    return item
            }
        }
    },
    methods: {
        togglePanel() {
            this.panelState = !this.panelState;
            this.rangeStart = false;
        },
        isSelected(type, item) {
            switch (type) {
                case 'year':
                    if (this.range) {
                        return (
                            new Date(item, 0).getTime() >= new Date(this.tmpStartYear, 0).getTime()
                            && new Date(item, 0).getTime() <= new Date(this.tmpEndYear, 0).getTime()
                        )
                    } else {
                        return (item === this.tmpYear)
                    }

                case 'month':
                    if (this.range) {
                        return (
                            new Date(this.tmpYear, item).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth).getTime()
                            && new Date(this.tmpYear, item).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth).getTime()
                        )
                    } else {
                        return (item === this.tmpMonth && this.year === this.tmpYear)
                    }
                case 'date':
                    if (this.range) {
                        let month = this.tmpMonth;
                        item.prevMonth && month--;
                        item.nextMonth && month++;
                        return (
                            new Date(this.tmpYear, month, item.value).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime()
                            && new Date(this.tmpYear, month, item.value).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime()
                        )
                    } else {
                        const date = +this.value.substr(-2) || this.date;
                        return (date === item.value && this.month === this.tmpMonth && item.currentMonth)
                    }
            }
            return flag;
        },
        changeType(type) {
            this.panelType = type
        },
        changeYearList(next) {
            if (next) {
                this.yearList = this.yearList.map((i) => i + 12)
            } else {
                this.yearList = this.yearList.map((i) => i - 12)
            }
        },
        prevMonthPreview() {
            this.tmpMonth = this.tmpMonth === 0 ? 0 : this.tmpMonth - 1
        },
        nextMonthPreview() {
            this.tmpMonth = this.tmpMonth === 11 ? 11 : this.tmpMonth + 1
        },
        selectYear(year) {
            if (this.yearValidate(year)) return;
            this.tmpYear = year
            this.panelType = 'month'
        },
        selectMonth(month) {
            if (this.monthValidate(month)) return;
            this.tmpMonth = month
            this.panelType = 'date'
        },
        selectDate(date) {
            setTimeout(() => {
                if (this.dateValidate(date)) return;

                if (date.prevMonth) {
                    if (this.tmpMonth === 0) {
                        this.year -= 1
                        this.tmpYear -= 1
                        this.month = this.tmpMonth = 11
                    } else {
                        this.month = this.tmpMonth - 1
                        this.tmpMonth -= 1
                    }
                } else if (date.nextMonth) {
                    if (this.tmpMonth === 11) {
                        this.year += 1
                        this.tmpYear += 1
                        this.month = this.tmpMonth = 0
                    } else {
                        this.month = this.tmpMonth + 1
                        this.tmpMonth += 1
                    }
                }

                if (this.range === 'common') {
                    if (!this.rangeStart) {
                        this.tmpEndYear = this.tmpStartYear = this.tmpYear
                        this.tmpEndMonth = this.tmpStartMonth = this.tmpMonth
                        this.tmpEndDate = this.tmpStartDate = date.value
                        this.rangeStart = true
                    } else {
                        this.tmpEndYear = this.tmpYear
                        this.tmpEndMonth = this.tmpMonth
                        this.tmpEndDate = date.value
                        let d1 = new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime(),
                            d2 = new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime()
                        if (d1 > d2) {
                            let tmpY, tmpM, tmpD
                            tmpY = this.tmpEndYear
                            tmpM = this.tmpEndMonth
                            tmpD = this.tmpEndDate
                            this.tmpEndYear = this.tmpStartYear
                            this.tmpEndMonth = this.tmpStartMonth
                            this.tmpEndDate = this.tmpStartDate
                            this.tmpStartYear = tmpY
                            this.tmpStartMonth = tmpM
                            this.tmpStartDate = tmpD
                        }
                        let RangeStart = `${this.tmpStartYear}-${('0' + (this.tmpStartMonth + 1)).slice(-2)}-${('0' + this.tmpStartDate).slice(-2)}`
                        let RangeEnd = `${this.tmpEndYear}-${('0' + (this.tmpEndMonth + 1)).slice(-2)}-${('0' + this.tmpEndDate).slice(-2)}`
                        let value = [RangeStart, RangeEnd]
                        this.$emit('input', value)
                        this.rangeStart = false
                        this.panelState = false
                    }
                } else if (this.range === 'week') {
                    this.getWeekRangeStart('select', {
                        year: this.tmpYear,
                        month: this.tmpMonth,
                        date: date.value
                    });
                    this.getWeekRangeEnd();
                    let RangeStart = `${this.tmpStartYear}-${('0' + (this.tmpStartMonth + 1)).slice(-2)}-${('0' + this.tmpStartDate).slice(-2)}`
                    let RangeEnd = `${this.tmpEndYear}-${('0' + (this.tmpEndMonth + 1)).slice(-2)}-${('0' + this.tmpEndDate).slice(-2)}`
                    let value = [RangeStart, RangeEnd];
                    this.$emit('input', value)
                    this.rangeStart = false
                    this.panelState = false
                } else {
                    this.year = this.tmpYear
                    this.month = this.tmpMonth
                    this.date = date.value
                    let value = `${this.tmpYear}-${('0' + (this.month + 1)).slice(-2)}-${('0' + this.date).slice(-2)}`
                    this.$emit('input', value)
                    this.panelState = false
                }
            }, 0)
        },
        yearValidate(year) {
            return (year > this.maxYear || year < this.minYear) ? true : false
        },
        monthValidate(month) {
            if (new Date(this.tmpYear, month).getTime() >= new Date(this.minYear, this.minMonth - 1).getTime()
                && new Date(this.tmpYear, month).getTime() <= new Date(this.maxYear, this.maxMonth - 1).getTime()) {
                return false
            }
            return true
        },
        dateValidate(date) {
            let mon = this.tmpMonth
            if (date.prevMonth) {
                mon -= 1
            } else if (date.nextMonth) {
                mon += 1
            }
            if (new Date(this.tmpYear, mon, date.value).getTime() >= new Date(this.minYear, this.minMonth - 1, this.minDate).getTime()
                && new Date(this.tmpYear, mon, date.value).getTime() <= new Date(this.maxYear, this.maxMonth - 1, this.maxDate).getTime()
            ) {
                return false
            }

            // if (this.tmpStartDate) {
            //     let start = [this.tmpStartYear,this.tmpStartMonth,this.tmpStartDate].join('-'),
            //     current = [this.tmpYear,mon,date.value].join('-');
            //     console.log(DateDiff(start, current))
            // }
            return true
        },
        close(e) {
            if (!this.$el.contains(e.target)) {
                this.panelState = false;
                this.rangeStart = false;
                this.panelType = 'date';
            }
        },
        clear() {
            this.$emit('input', this.range ? ['', ''] : '')
        },
        getWeekRangeStart(key, obj) {
            if (key === 'init') {
                let sd = this.value[0].split('-');
                this.tmpStartYear = Number(sd[0]);
                this.tmpStartMonth = Number(sd[1]) - 1;
                this.tmpStartDate = Number(sd[2]);
            }
            if (key === 'select') {
                this.tmpStartYear = obj.year;
                this.tmpStartMonth = obj.month;
                this.tmpStartDate = obj.date;
            }

            let sd = new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate);
            let day = sd.getDay();
            // 所选日期前推一周
            if (this.weekStart === 101) {

                // 所选日期后推一周
            } else if (this.weekStart === 102) {

                // 按照周日期
            } else {
                if (this.weekStart > 6) {
                    this.weekStart = 0
                }

                // 上周日
                let sunday = this.tmpStartDate - day;
                // this.weekStart = 0 时，为过去一周
                let lastWeek = sunday - (7 - this.weekStart);
                if (day >= this.weekStart) {
                    // 本周日
                    sunday = this.tmpStartDate + (7 - day);
                    // 本周一
                    // now.getDate() - (day-1)
                    lastWeek = sunday - (7 - this.weekStart);
                }
                let nd = new Date(this.tmpStartYear, this.tmpStartMonth, lastWeek);

                this.tmpStartYear = nd.getFullYear();
                this.tmpStartMonth = nd.getMonth();
                this.tmpStartDate = nd.getDate();
            }

        },
        getWeekRangeEnd() {
            let ed = new Date(this.tmpStartYear, this.tmpStartMonth, 6 + this.tmpStartDate);
            this.tmpEndYear = ed.getFullYear();
            this.tmpEndMonth = ed.getMonth();
            this.tmpEndDate = ed.getDate();
        }
    },
    data() {
        let now = new Date()
        return {
            showCancel: false,
            panelState: false,
            panelType: 'date',
            coordinates: {},
            year: now.getFullYear(),
            month: now.getMonth(),
            date: now.getDate(),
            tmpYear: now.getFullYear(),
            tmpMonth: now.getMonth(),
            tmpStartYear: now.getFullYear(),
            tmpStartMonth: now.getMonth(),
            tmpStartDate: now.getDate(),
            tmpEndYear: now.getFullYear(),
            tmpEndMonth: now.getMonth(),
            tmpEndDate: now.getDate(),
            minYear: Number,
            minMonth: Number,
            minDate: Number,
            maxYear: Number,
            maxMonth: Number,
            maxDate: Number,
            yearList: Array.from({ length: 12 }, (value, index) => new Date().getFullYear() + index),
            monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            weekList: [0, 1, 2, 3, 4, 5, 6],
            rangeStart: false
        }
    },
    mounted() {
        this.$nextTick(() => {
            // if (this.$el.parentNode.offsetWidth + this.$el.parentNode.offsetLeft - this.$el.offsetLeft <= 300) {
            //     this.coordinates = { right: '0', top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px` }
            // } else {
            //     this.coordinates = { left: '0', top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px` }
            // }

            let getLeftWidth = (dom) => {
                if (dom.parentNode.offsetLeft) {
                    return {
                        left: dom.parentNode.offsetLeft,
                        width: dom.parentNode.offsetWidth
                    }
                } else {
                    return getLeftWidth(dom.parentNode);
                }
            }
            let lw = getLeftWidth(this.$el);
            if (lw.left + lw.width * 2 > document.body.clientWidth) {
                this.coordinates = { right: '0' }
            } else {
                this.coordinates = { left: '0' }
            }


            let minArr = this.min.split('-')
            this.minYear = Number(minArr[0])
            this.minMonth = Number(minArr[1])
            this.minDate = Number(minArr[2])
            let maxArr = this.max.split('-')
            this.maxYear = Number(maxArr[0])
            this.maxMonth = Number(maxArr[1])
            this.maxDate = Number(maxArr[2])
            if (this.range === 'common') {
                if (Object.prototype.toString.call(this.value).slice(8, -1) !== 'Array') {
                    throw new Error('Binding value must be an array in range mode.')
                }
                if (this.value.length) {
                    let rangeStart = this.value[0].split('-')
                    let rangeEnd = this.value[1].split('-')
                    this.tmpStartYear = Number(rangeStart[0])
                    this.tmpStartMonth = Number(rangeStart[1]) - 1
                    this.tmpStartDate = Number(rangeStart[2])
                    this.tmpEndYear = Number(rangeEnd[0])
                    this.tmpEndMonth = Number(rangeEnd[1]) - 1
                    this.tmpEndDate = Number(rangeEnd[2])
                } else {
                    this.$emit('input', ['', ''])
                }
            } else if (this.range === 'week') {
                if (Object.prototype.toString.call(this.value).slice(8, -1) !== 'Array') {
                    throw new Error('Binding value must be an array in range mode.')
                }

                if (this.value.length) {
                    this.getWeekRangeStart('init');
                    this.getWeekRangeEnd();
                    let RangeStart = `${this.tmpStartYear}-${('0' + (this.tmpStartMonth + 1)).slice(-2)}-${('0' + this.tmpStartDate).slice(-2)}`
                    let RangeEnd = `${this.tmpEndYear}-${('0' + (this.tmpEndMonth + 1)).slice(-2)}-${('0' + this.tmpEndDate).slice(-2)}`
                    let value = [RangeStart, RangeEnd];
                    this.$emit('input', value)
                } else {
                    this.$emit('input', ['', '']);
                }
            }
            if (!this.value) {
                this.$emit('input', '')
            }
            window.addEventListener('click', this.close)
        })
    },
    beforeDestroy() {
        window.removeEventListener('click', this.close)
    }
}
</script>
<style lang="scss" scoped>
// .date-picker {
//     position: relative;
//     display: inline-block; // height: 32px;
// }

// .input-wrapper {
//     border: 1px solid #ccc;
//     border-radius: 2px;
//     vertical-align: middle;
//     display: flex;
//     justify-content: space-between;
//     flex-flow: row nowrap;
//     align-items: center;
//     padding: 6px 10px 6px 4px;
//     height: 32px;
//     box-sizing: border-box;
// }

// .input {
//     height: 100%;
//     width: 100%;
//     padding-left: 4px;
//     box-sizing: border-box;
//     outline: none;
// }

// .cancel-btn {
//     height: 14px;
//     width: 14px;
// }

// .date-select-wrapper {
//     position: relative;
//     display: inline-block;
//     user-select: none;
// }

// .date-select-btn {
//     display: inline-block;
//     width: 70px;
//     height: 28px;
//     padding: 0 12px;
//     line-height: 28px;
//     border: 1px solid #d6dae1;
//     border-radius: 2px;
//     cursor: pointer;
//     color: #666;
//     text-align: center;
// }

// // .date-select-wrapper .sty1 {
// //     padding: 3px 20px;
// // }
// // .date-select-wrapper .sty2 {
// //     padding: 3px 10px;
// // }
// // .date-select-wrapper .sty2:after {
// //     position: relative;
// //     top: -2px;
// //     display: inline-block;
// //     width: 10px;
// //     height: 6px;
// //     margin-left: 10px;
// //     background: url(../images/sprite.png) -76px -1px;
// //     content: ' ';
// // }
// .date-panel {
//     position: absolute;
//     z-index: 5000;
//     border: 1px solid #b5bcc9;
//     box-sizing: content-box;
//     width: 240px;
//     // padding: 5px 10px 10px;
//     transform: translateY(4px);
//     background-color: #fff;
// }

// .panel-header {
//     display: flex;
//     flex-flow: row nowrap;
//     width: 100%;

//     line-height: 34px;
//     height: 34px;
//     color: #333;
//     font-size: 14px;
//     background-color: #f9f9f9;
// }

// .arrow-left,
// .arrow-right {
//     flex: 1;
//     text-align: center;
//     cursor: pointer;
// }

// .year-range {
//     flex: 3;
//     display: flex;
//     justify-content: center;
// }

// .year-month-box {
//     flex: 3;
//     display: flex;
//     flex-flow: row nowrap;
//     justify-content: space-around;
// }

// // .type-year,
// // .type-month,
// // .date-list {
// //     background-color: #fff;
// // }

// .year-box,
// .month-box {
//     transition: all ease .1s;
//     font-family: Roboto, sans-serif;
//     flex: 1;
//     text-align: center;
//     cursor: pointer;
// }

// .year-list,
// .month-list {
//     display: flex;
//     flex-flow: row wrap;
//     justify-content: space-between;
//     padding: 10px 10px 5px 5px;
//     li {
//         font-family: Roboto, sans-serif;
//         transition: all .45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
//         cursor: pointer;
//         text-align: center;
//         width: 50px;
//         height: 22px;
//         line-height: 22px;
//         margin-bottom: 10px;
//         margin-left: 5px;
//         &:hover {
//             background-color: #ff8e99;
//             color: #fff;
//         }
//         &.selected {
//             background-color: #ff5b69;
//             color: #fff;
//         }
//         &.invalid {
//             cursor: not-allowed;
//             color: #ccc;
//         }
//     }
// }

// .date-list {
//     display: flex;
//     flex-flow: row wrap;
//     justify-content: space-between;
//     .valid:hover {
//         background-color: #eee;
//     }
//     li {
//         transition: all ease .1s;
//         cursor: pointer;
//         box-sizing: content-box;
//         // border-bottom: 1px solid #fff;
//         position: relative;
//         // margin: 2px;
//         // &:not(.firstItem) {
//         //     margin-left: 10px;
//         // }
//         .message {
//             font-family: Roboto, sans-serif;
//             font-weight: 300;
//             font-size: 12px;
//             // height: 30px;
//             &.selected {
//                 .bg {
//                     // background-color: rgb(0, 151, 167);
//                     background-color: #ff5b69;
//                 }
//                 span {
//                     color: #fff;
//                 }
//             }
//             &:not(.selected) {
//                 .bg {
//                     transform: scale(0);
//                     opacity: 0;
//                 }
//                 &:hover {
//                     .bg {
//                         // background-color: rgb(0, 151, 167);
//                         background-color: #ff8e99;
//                         transform: scale(1);
//                         opacity: .6;
//                     }
//                     span {
//                         color: #fff;
//                     }
//                 }
//             }
//             .bg {
//                 height: 22px;
//                 width: 22px;
//                 transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
//                 border-radius: 50%;
//                 position: absolute;
//                 z-index: 20;
//                 top: 50%;
//                 left: 50%;
//                 margin-left: -11px;
//                 margin-top: -11px;
//             }
//             span {
//                 position: relative;
//                 z-index: 20;
//                 // left: 50%;
//                 // top: 50%;
//                 // transform: translate3d(-50%, -50%, 0);
//             }
//         }
//         &.invalid {
//             cursor: not-allowed;
//             color: #ccc;
//         }
//     }
// }

// .weeks {
//     display: flex;
//     flex-flow: row wrap;
//     justify-content: space-between;
//     cursor: default;
//     padding: 10px;

//     li {
//         font-size: 12px;
//         width: 12px;
//         height: 12px;
//         text-align: center;
//         line-height: 12px;
//         font-weight: 600;
//         padding: 9px;
//     }
// }

// // .weeks,
// .date-list {
//     text-align: center;
//     .prevMonth,
//     .nextMonth {
//         color: #999;
//     }
//     padding: 10px;
//     margin-top: -20px;
//     li {
//         width: 30px;
//         height: 30px;
//         text-align: center;
//         line-height: 30px;
//     }
// }

// .toggle-enter,
// .toggle-leave-active {
//     opacity: 0;
//     transform: translateY(-10px);
// }

// .toggle-enter-active,
// .toggle-leave-active {
//     transition: all ease .2s;
// }

// .fade-enter,
// .fade-leave-active {
//     opacity: 0;
//     transform: scale3d(0, 0, 0);
// }

// .fade-enter-active,
// .fade-leave-active {
//     transition: all ease .1s;
// }

// .date-select-wrapper .common {
//     width: 70px;
//     height: 30px;
//     padding: 0 12px;
//     max-width: 474px;
//     line-height: 30px;
//     border: 1px solid #d6dae1;
//     border-radius: 2px;
// }
</style>
