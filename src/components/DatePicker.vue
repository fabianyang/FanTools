<template>
    <div class="date-picker">
        <div v-if="range" class="date-select-wrapper" @click="togglePanel">
            <span class="date-select-btn" :class="buttonClass" :style="{ 'border-color': panelState ? '#b5bcc9' : '#d6dae1' }">{{ value[0] + ' ~ ' + value[1] }}</span>
        </div>
        <div v-else class="date-select-wrapper">
            <span class="date-select-btn" @click="togglePanel" :style="{ 'border-color': panelState ? '#b5bcc9' : '#d6dae1' }">{{ value }}</span>
        </div>

        <transition name="toggle">
        <div class="date-panel" v-show="panelState" :style="coordinates">
            <div class="panel-header" v-show="panelType !== 'year'">
                <div class="arrow-left" @click="prevMonthPreview()">&lt;</div>
                <div class="year-month-box">
                    <div class="year-box" @click="changeType('year')" v-text="tempSelect.year"></div>
                    <div class="month-box" @click="changeType('month')">{{tempSelect.month + 1 | month(language)}}</div>
                </div>
                <div class="arrow-right" @click="nextMonthPreview()">&gt;</div>
            </div>
            <div class="panel-header" v-show="panelType === 'year'">
                <div class="arrow-left" @click="changeYearList(0)">&lt;</div>
                <div class="year-range">
                    <span v-text="paneList.year[0]"></span> -
                    <span v-text="paneList.year[paneList.year.length - 1]"></span>
                </div>
                <div class="arrow-right" @click="changeYearList(1)">&gt;</div>
            </div>
            <div class="type-year" v-show="panelType === 'year'">
                <ul class="year-list">
                    <li v-for="(item, index) in paneList.year" :key="index" v-text="item" :class="{selected: isSelected('year', item), invalid: yearValidate(item)}" @click="selectYear(item)">
                    </li>
                </ul>
            </div>
            <div class="type-month" v-show="panelType === 'month'">
                <ul class="month-list">
                    <li v-for="(item, index) in paneList.month" :key="index" :class="{selected: isSelected('month', index), invalid: monthValidate(index), temp: tempSelect.month === index && !isSelected('month', index)}" @click="selectMonth(index)">
                        {{item | month(language)}}
                    </li>
                </ul>
            </div>
            <div class="type-date" v-show="panelType === 'date'">
                <ul class="weeks">
                    <li v-for="(item, index) in paneList.week" :key="index">{{item | week(language)}}</li>
                </ul>
                <ul class="date-list">
                    <li v-for="(item, index) in datePaneList" :key="index" :class="{prevMonth: item.prevMonth, nextMonth: item.nextMonth,
                                    invalid: dateValidate(item), firstItem: (index % 7) === 0}" @click="selectDate(item)">
                        <div class="message" :class="{selected: isSelected('date', item)}">
                            <div class="bg"></div>
                            <span v-text="item.value"></span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="panel-footer">
                <a class="btn" @click="reset">重置</a>
                <a class="btn" @click="back2view(value)">返回</a>
                <a class="btn" @click="btnClose">关闭</a>
                <a class="btn" @click="evEmit">确定</a>
            </div>
        </div>
        </transition>
    </div>
</template>
<script>
import util from '@/util/util';
//计算天数差的函数，通用; 为了添加最多能向前或向后选择几天功能。selectMaxCount
function DateDiff(sDate1, sDate2) {    //sDate1和sDate2是2006-12-18格式
    var aDate, oDate1, oDate2, iDays
    aDate = sDate1.split('-')
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])    //转换为12-18-2006格式
    aDate = sDate2.split('-')
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)    //把相差的毫秒数转换为天数
    return iDays
}

function gGetWeekRange({ year, month, date, weekStart }) {
    const dateStart = new Date(year, month, date);
    const day = dateStart.getDay();
    // 所选日期前推一周
    if (weekStart === 101) {

        // 所选日期后推一周
    } else if (weekStart === 102) {

        // 按照周日期
    } else {
        if (weekStart > 6) {
            weekStart = 0
        }

        // 上周日的日期
        let sunday = date - day;
        // this.weekStart = 0 时，为过去一周
        // 上一周今天日期
        let dateLast = sunday - (7 - weekStart);
        if (day >= weekStart) {
            // 本周日
            sunday = date + (7 - day);
            // 本周一
            // now.getDate() - (day-1)
            dateLast = sunday - (7 - weekStart);
        }
        const dateStartNew = new Date(year, month, dateLast);

        // this.tmpStartYear = nd.getFullYear();
        // this.tmpStartMonth = nd.getMonth();
        // this.tmpStartDate = nd.getDate();

        const dateEnd = new Date(year, month, 6 + dateLast);

        // this.tmpEndYear = ed.getFullYear();
        // this.tmpEndMonth = ed.getMonth();
        // this.tmpEndDate = ed.getDate();

        return [util.format(dateStartNew, 'yyyy-MM-dd'), util.format(dateEnd, 'yyyy-MM-dd')]
    }
}

let gResetValue;

export default {
    name: 'DatePicker',
    props: {
        language: { default: 'ch' },
        format: {
            type: String,
            default: 'yyyy-MM-dd'
        },
        // 设置最小日期
        min: {
            type: String,
            default: '2010-01-01',
            validator: (value) => {
                return util.check(value);
            }
        },
        // 设置最大日期
        max: {
            type: String,
            default: '2030-01-01',
            validator: (value) => {
                return util.check(value);
            }
        },
        range: {
            type: String,
            default: ''
        },
        value: {
            type: [String, Array],
            default: () => {
                const date = util.format(new Date(), 'yyyy-MM-dd');
                // 这里可以获得 this.range
                if (!this.range) {
                    return date
                } else {
                    return [date, date]
                }
            },
            validator: (value) => {
                // 这里无法获得 this.range，所以只能验证合法性
                if (Array.isArray(value)) {
                    const date0 = util.format(new Date(value[0]), 'yyyy-MM-dd');
                    if (value.length === 2) {
                        const date1 = util.format(new Date(value[1]), 'yyyy-MM-dd');
                        return util.check(date0) && util.check(date1);
                    } else {
                        return util.check(date0);
                    }
                } else {
                    const date = util.format(new Date(value), 'yyyy-MM-dd');
                    return util.check(date);
                }
            }
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
        },
        useTools: {
            type: Boolean,
            default: true
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
        datePaneList() {
            const currentYear = this.tempSelect.year,
                currentMonth = this.tempSelect.month;
            let currentMonthLength = new Date(currentYear, currentMonth + 1, 0).getDate()
            let dateList = Array.from({ length: currentMonthLength }, (val, index) => {
                return {
                    currentMonth: true,
                    value: index + 1
                }
            })
            let startDay = new Date(currentYear, currentMonth, 1).getDay()
            let previousMonthLength = new Date(currentYear, currentMonth, 0).getDate()
            for (let i = 0, len = startDay; i < len; i++) {
                dateList = [{ prevMonth: true, value: previousMonthLength - i }].concat(dateList)
            }
            for (let i = dateList.length, item = 1; i < 42; i++ , item++) {
                dateList[dateList.length] = { nextMonth: true, value: item }
            }
            return dateList;
        },
        // 允许选择的最小、最大日期
        minCanSelect() {
            const min = new Date(this.min);
            return {
                year: min.getFullYear(),
                month: min.getMonth() + 1,
                date: min.getDate()
            }
        },
        maxCanSelect() {
            const max = new Date(this.max);
            return {
                year: max.getFullYear(),
                month: max.getMonth() + 1,
                date: max.getDate()
            }
        },
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
            this.hasSelectRangeStart = false;
        },
        isSelected(type, item) {
            switch (type) {
                case 'year':
                    if (this.range) {
                        return (
                            new Date(item, 0).getTime() >= new Date(this.selectRangeStart.year, 0).getTime()
                            && new Date(item, 0).getTime() <= new Date(this.selectRangeEnd.year, 0).getTime()
                        )
                    } else {
                        return (item === this.tempSelect.year)
                    }

                case 'month':
                    if (this.range) {
                        return (
                            new Date(this.tempSelect.year, item).getTime() >= new Date(this.selectRangeStart.year, this.selectRangeStart.month).getTime()
                            && new Date(this.tempSelect.year, item).getTime() <= new Date(this.selectRangeEnd.year, this.selectRangeEnd.month).getTime()
                        )
                    } else {
                        return (item === this.tempSelect.month && this.year === this.tempSelect.year)
                    }
                case 'date':
                    if (this.range) {
                        let month = this.tempSelect.month;
                        item.prevMonth && month--;
                        item.nextMonth && month++;
                        return (
                            new Date(this.tempSelect.year, month, item.value).getTime() >= new Date(this.selectRangeStart.year, this.selectRangeStart.month, this.selectRangeStart.date).getTime()
                            && new Date(this.tempSelect.year, month, item.value).getTime() <= new Date(this.selectRangeEnd.year, this.selectRangeEnd.month, this.selectRangeEnd.date).getTime()
                        )
                    } else {
                        const date = this.date;
                        // const date = new Date(this.value).getDate() || this.date;
                        // console.log(item, date);
                        return (date === item.value && this.month === this.tempSelect.month && item.currentMonth)
                    }
            }
            return flag;
        },
        changeType(type) {
            this.panelType = type
        },
        changeYearList(next) {
            if (next) {
                this.paneList.year = this.paneList.year.map((i) => i + 12)
            } else {
                this.paneList.year = this.paneList.year.map((i) => i - 12)
            }
        },
        prevMonthPreview() {
            if (this.tempSelect.month === 0) {
                this.tempSelect.month = 11;
                this.tempSelect.year--;
            } else {
                this.tempSelect.month--;
            }
            // this.tempSelect.month = this.tempSelect.month === 0 ? 0 : this.tempSelect.month - 1
        },
        nextMonthPreview() {
            if (this.tempSelect.month === 11) {
                this.tempSelect.month = 0;
                this.tempSelect.year++;
            } else {
                this.tempSelect.month++;
            }
            // this.tempSelect.month = this.tempSelect.month === 11 ? 11 : this.tempSelect.month + 1
        },
        selectYear(year) {
            if (this.yearValidate(year)) return;
            this.tempSelect.year = year;
            this.panelType = 'month';
        },
        selectMonth(month) {
            if (this.monthValidate(month)) return;
            this.tempSelect.month = month;
            this.panelType = 'date';
        },
        selectDate(date) {
            if (this.dateValidate(date)) return;
            // 先判断是否是月底或月初，重置属性
            let tempSelectYear = this.tempSelect.year,
                tempSelectMonth = this.tempSelect.month;
            if (date.prevMonth) {
                if (tempSelectMonth === 0) {
                    this.year -= 1;
                    this.tempSelect.year -= 1;
                    this.month = this.tempSelect.month = 11;
                } else {
                    this.month = tempSelectMonth - 1;
                    this.tempSelect.month -= 1;
                }
            } else if (date.nextMonth) {
                if (tempSelectMonth === 11) {
                    this.year += 1;
                    this.tempSelect.year += 1;
                    this.month = this.tempSelect.month = 0;
                } else {
                    this.month = tempSelectMonth + 1;
                    this.tempSelect.month += 1;
                }
            }

            tempSelectYear = this.tempSelect.year;
            tempSelectMonth = this.tempSelect.month;
            if (!this.range) {
                this.year = tempSelectYear;
                this.month = tempSelectMonth;
                this.date = date.value;
                // let value = util.format(new Date(this.year, this.month, this.date), this.format);
                // this.$emit('input', value);
                // this.panelState = false
            } else if (this.range === 'common') {
                if (!this.hasSelectRangeStart) {
                    this.hasSelectRangeStart = true;
                    this.selectRangeEnd.year = this.selectRangeStart.year = tempSelectYear;
                    this.selectRangeEnd.yonth = this.selectRangeStart.month = tempSelectMonth;
                    this.selectRangeEnd.date = this.selectRangeStart.date = date.value;
                } else {
                    this.selectRangeEnd.year = tempSelectYear;
                    this.selectRangeEnd.month = tempSelectMonth;
                    this.selectRangeEnd.date = date.value
                    let d1 = new Date(this.selectRangeStart.year, this.selectRangeStart.month, this.selectRangeStart.date).getTime(),
                        d2 = new Date(this.selectRangeEnd.year, this.selectRangeEnd.month, this.selectRangeEnd.date).getTime()
                    // 交换起始、结束时间
                    if (d1 > d2) {
                        [this.selectRangeStart.year, this.selectRangeEnd.year] = [this.selectRangeEnd.year, this.selectRangeStart.year];
                        [this.selectRangeStart.month, this.selectRangeEnd.month] = [this.selectRangeEnd.month, this.selectRangeStart.month];
                        [this.selectRangeStart.date, this.selectRangeEnd.date] = [this.selectRangeEnd.date, this.selectRangeStart.date];
                    }
                    // const rs = util.format(new Date(this.selectRangeStart.year, this.selectRangeStart.month, this.selectRangeStart.date), this.format);
                    // const re = util.format(new Date(this.selectRangeEnd.year, this.selectRangeEnd.month, this.selectRangeEnd.date), this.format);
                    // this.$emit('input', [rs, re]);
                    // this.hasSelectRangeStart = false;
                    // this.panelState = false;
                }
            } else if (this.range === 'week') {
                const weekRange = gGetWeekRange({
                    year: tempSelectYear,
                    month: tempSelectMonth,
                    date: date.value,
                    weekStart: this.weekStart
                });

                const dateStart = weekRange[0].split('-');
                const dateEnd = weekRange[1].split('-');

                this.selectRangeStart = {
                    year: Number(dateStart[0]),
                    month: Number(dateStart[1]) - 1,
                    date: Number(dateStart[2])
                }

                this.selectRangeEnd = {
                    year: Number(dateEnd[0]),
                    month: Number(dateEnd[1]) - 1,
                    date: Number(dateEnd[2])
                }
                // const rs = util.format(new Date(weekRange[0]), this.format);
                // const re = util.format(new Date(weekRange[1]), this.format);
                // this.$emit('input', [rs, re]);
                // this.hasSelectRangeStart = false;
                // this.panelState = false;
            }

            if (!this.useTools) {
                this.evEmit();
                this.btnClose();
            }
        },
        yearValidate(year) {
            return (year > this.maxCanSelect.year || year < this.minCanSelect.year) ? true : false
        },
        monthValidate(month) {
            if (new Date(this.tempSelect.year, month).getTime() >= new Date(this.minCanSelect.year, this.minCanSelect.month - 1).getTime()
                && new Date(this.tempSelect.year, month).getTime() <= new Date(this.maxCanSelect.year, this.maxCanSelect.month - 1).getTime()) {
                return false
            }
            return true
        },
        dateValidate(date) {
            let month = this.tempSelect.month;
            if (date.prevMonth) {
                month -= 1
            } else if (date.nextMonth) {
                month += 1
            }
            if (new Date(this.tempSelect.year, month, date.value).getTime() >= new Date(this.minCanSelect.year, this.minCanSelect.month - 1, this.minCanSelect.date).getTime()
                && new Date(this.tempSelect.year, month, date.value).getTime() <= new Date(this.maxCanSelect.year, this.maxCanSelect.month - 1, this.maxCanSelect.date).getTime()
            ) {
                return false
            }
            return true
        },
        close(e) {
            if (!this.$el.contains(e.target)) {
                this.panelState = false;
                this.hasSelectRangeStart = false;
                this.panelType = 'date';
            }
        },
        reset() {
            // 重置以初始传入值为基准，返回以选定值为基准。
            // 所以 range === 'week' 时，value [2018-01-01] 点击两个按钮会出现两种不同 panel type
            const value = this.range ? gResetValue.concat() : gResetValue;
            this.back2view(value);
            this.evEmit();
        },
        back2view(value) {
            // 验证数据合法性
            if (this.range) {
                let dateStart = util.format(new Date(value[0]), 'yyyy-MM-dd').split('-');
                let dateEnd = util.format(new Date(value[1]), 'yyyy-MM-dd').split('-');

                this.tempSelect = {
                    year: Number(dateStart[0]),
                    month: Number(dateStart[1]) - 1
                };

                if (this.range === 'common') {
                    this.selectRangeStart = {
                        year: Number(dateStart[0]),
                        month: Number(dateStart[1]) - 1,
                        date: Number(dateStart[2])
                    }
                    this.selectRangeEnd = {
                        year: Number(dateEnd[0]),
                        month: Number(dateEnd[1]) - 1,
                        date: Number(dateEnd[2])
                    }
                } else if (this.range === 'week') {
                    const weekRange = gGetWeekRange({
                        year: Number(dateStart[0]),
                        month: Number(dateStart[1]) - 1,
                        date: Number(dateStart[2]),
                        weekStart: this.weekStart
                    });

                    dateStart = weekRange[0].split('-');
                    dateEnd = weekRange[1].split('-');

                    this.selectRangeStart = {
                        year: Number(dateStart[0]),
                        month: Number(dateStart[1]) - 1,
                        date: Number(dateStart[2])
                    }

                    this.selectRangeEnd = {
                        year: Number(dateEnd[0]),
                        month: Number(dateEnd[1]) - 1,
                        date: Number(dateEnd[2])
                    }
                }

            } else {
                this.tempSelect = {
                    year: this.year,
                    month: this.month
                };
                const date = new Date(this.value);

                this.year = date.getFullYear();
                this.month = date.getMonth();
                this.date = date.getDate();
            }
        },
        btnClose() {
            this.panelState = false;
            this.hasSelectRangeStart = false;
            this.panelType = 'date';
        },
        evEmit() {
            if (this.range) {
                const rs = util.format(new Date(this.selectRangeStart.year, this.selectRangeStart.month, this.selectRangeStart.date), this.format);
                const re = util.format(new Date(this.selectRangeEnd.year, this.selectRangeEnd.month, this.selectRangeEnd.date), this.format);
                this.$emit('input', [rs, re]);
            } else {
                this.$emit('input', util.format(new Date(this.year, this.month, this.date), this.format));
            }
            this.btnClose();
        }
    },
    data() {
        console.log(this.range, this.value);
        console.log('data');

        let now = new Date(),
            year = now.getFullYear(),
            month = now.getMonth(),
            date = now.getDate();

        return {
            // 面板状态，显示、隐藏。
            panelState: false,
            // 面板状态，年、月、日 面板。
            panelType: 'date',
            // 面板位置。
            coordinates: {},

            year,
            month,
            date,

            // 年、月，面板选择
            tempSelect: {
                year,
                month,
            },

            // 范围选择时，开始时间、结束时间,
            hasSelectRangeStart: false,
            selectRangeStart: {
                year,
                month,
                date
            },
            selectRangeEnd: {
                year,
                month,
                date
            },

            paneList: {
                year: Array.from({ length: 12 }, (value, index) => new Date().getFullYear() + index),
                month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                week: [0, 1, 2, 3, 4, 5, 6]
            }
        }
    },
    mounted() {
        console.log('mounted');
        // top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`
        this.$nextTick(() => {
            const el = this.$el,
                clientWidth = document.documentElement.clientWidth || document.body.clientWidth;

            // 判断面板靠左或靠右对齐
            if (this.$el.offsetLeft + 241 > clientWidth) {
                this.coordinates = { right: '0' }
            } else {
                this.coordinates = { left: '0' }
            }

            const value = this.value,
                range = this.range;

            // 验证数据合法性
            if (range) {
                if (util.getTypeString(this.value) !== 'Array') {
                    throw new Error('Binding value must be an array in range mode.');
                } else if (range === 'common'){
                    gResetValue = [value[0], value[1]];
                } else if (range === 'week') {
                    gResetValue = [value[0]];
                }
            } else {
                gResetValue = value;
            }

            this.back2view(value);

            // 默认选择周时，由于是系统给指定区间，所以必须触发 input 一次。
            if (range === 'week') {
                const rs = util.format(new Date(this.selectRangeStart.year, this.selectRangeStart.month, this.selectRangeStart.date), this.format);
                const re = util.format(new Date(this.selectRangeEnd.year, this.selectRangeEnd.month, this.selectRangeEnd.date), this.format);
                this.$emit('input', [rs, re]);
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

.date-picker {
  position: relative;
  display: inline-block; // height: 32px;
  font: 12px/1.5 "arial", "Microsoft YaHei";
  color: #333;
}

.input-wrapper {
  border: 1px solid #ccc;
  border-radius: 2px;
  vertical-align: middle;
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  align-items: center;
  padding: 6px 10px 6px 4px;
  height: 32px;
  box-sizing: border-box;
}

.input {
  height: 100%;
  width: 100%;
  padding-left: 4px;
  box-sizing: border-box;
  outline: none;
}

.cancel-btn {
  height: 14px;
  width: 14px;
}

.date-select-wrapper {
  position: relative;
  display: inline-block;
  user-select: none;
}

.date-select-btn {
  font: 12px/1.5 "arial", "Microsoft YaHei";
  color: #333;
}

.date-select-btn {
  display: inline-block;
//   width: 70px;
  height: 28px;
  padding: 0 12px;
  line-height: 28px;
  border: 1px solid #d6dae1;
  border-radius: 2px;
  cursor: pointer;
  color: #666;
  text-align: center;
}

// .date-select-wrapper .sty1 {
//     padding: 3px 20px;
// }
// .date-select-wrapper .sty2 {
//     padding: 3px 10px;
// }
// .date-select-wrapper .sty2:after {
//     position: relative;
//     top: -2px;
//     display: inline-block;
//     width: 10px;
//     height: 6px;
//     margin-left: 10px;
//     background: url(../images/sprite.png) -76px -1px;
//     content: ' ';
// }

.date-panel {
  position: absolute;
  z-index: 5000;
  border: 1px solid #b5bcc9;
  box-sizing: content-box;
  width: 240px;
  // padding: 5px 10px 10px;
  transform: translateY(4px);
  background-color: #fff;
}

.panel-header, .panel-footer {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  user-select: none;
  line-height: 34px;
  height: 34px;
  color: #333;
  font-size: 14px;
  background-color: #f9f9f9;
}

.arrow-left,
.arrow-right {
  flex: 1;
  text-align: center;
  cursor: pointer;
}

.year-range {
  flex: 3;
  display: flex;
  justify-content: center;
}

.year-month-box {
  flex: 3;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
}

// .type-year,
// .type-month,
// .date-list {
//     background-color: #fff;
// }

.year-box,
.month-box {
  transition: all ease 0.1s;
  font-family: Roboto, sans-serif;
  flex: 1;
  text-align: center;
  cursor: pointer;
}

.year-list,
.month-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 10px 10px 5px 5px;
  li {
    font-family: Roboto, sans-serif;
    transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    cursor: pointer;
    text-align: center;
    width: 50px;
    height: 22px;
    line-height: 22px;
    margin-bottom: 10px;
    margin-left: 5px;
    &:hover {
      background-color: #ff8e99;
      color: #fff;
    }
    &.selected {
      background-color: #ff5b69;
      color: #fff;
    }
    &.invalid {
      cursor: not-allowed;
      color: #ccc;
    }
    &.temp {
      background-color: #ff8e99;
      color: #fff;
    }
  }
}

.date-list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  .valid:hover {
    background-color: #eee;
  }
  li {
    transition: all ease 0.1s;
    cursor: pointer;
    box-sizing: content-box;
    // border-bottom: 1px solid #fff;
    position: relative;
    // margin: 2px;
    // &:not(.firstItem) {
    //     margin-left: 10px;
    // }
    .message {
      font-family: Roboto, sans-serif;
      font-weight: 300;
      font-size: 12px;
      // height: 30px;
      &.selected {
        .bg {
          // background-color: rgb(0, 151, 167);
          background-color: #ff5b69;
        }
        span {
          color: #fff;
        }
      }
      &:not(.selected) {
        .bg {
          transform: scale(0);
          opacity: 0;
        }
        &:hover {
          .bg {
            // background-color: rgb(0, 151, 167);
            background-color: #ff8e99;
            transform: scale(1);
            opacity: 0.6;
          }
          span {
            color: #fff;
          }
        }
      }
      .bg {
        height: 22px;
        width: 22px;
        transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        border-radius: 50%;
        position: absolute;
        z-index: 20;
        top: 50%;
        left: 50%;
        margin-left: -11px;
        margin-top: -11px;
      }
      span {
        position: relative;
        z-index: 20;
        // left: 50%;
        // top: 50%;
        // transform: translate3d(-50%, -50%, 0);
      }
    }
    &.invalid {
      cursor: not-allowed;
      color: #ccc;
    }
  }
}

.weeks {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  cursor: default;
  padding: 10px;

  li {
    font-size: 12px;
    width: 12px;
    height: 12px;
    text-align: center;
    line-height: 12px;
    font-weight: 600;
    padding: 9px;
  }
}

// .weeks,
.date-list {
  text-align: center;
  .prevMonth,
  .nextMonth {
    color: #999;
  }
  padding: 10px;
  margin-top: -20px;
  li {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
  }
}

.panel-footer {
    line-height: 24px;
    height: 24px;
    padding: 5px 0;
    justify-content: flex-end;
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


.toggle-enter,
.toggle-leave-active {
  opacity: 0;
  transform: translateY(-10px);
}

.toggle-enter-active,
.toggle-leave-active {
  transition: all ease 0.2s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
  transform: scale3d(0, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
  transition: all ease 0.1s;
}

.date-select-wrapper .common {
//   width: 70px;
  height: 30px;
  padding: 0 12px;
  max-width: 474px;
  line-height: 30px;
  border: 1px solid #d6dae1;
  border-radius: 2px;
}
</style>
