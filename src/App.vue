<template>
    <div class="chart-box clearfix">
        时间段：
        <!-- <date-picker v-model="timeStart"></date-picker> -->
        <span> - </span>
        <date-picker  @input="dateChange"></date-picker>
    </div>
</template>

<script>
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
            timeStart: formatDate(new Date()),
            timeEnd: formatDate(new Date())
        }
    },
    methods: {
        dateChange(date) {
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

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.chart-box {
    background: #fdfdfd;
    border: 1px solid #ececec;
    margin-top: 10px;
}
</style>
