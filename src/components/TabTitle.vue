<template>
    <div class="chart-box-title clearfix">
        <h3>{{ title || '标题' }}</h3>
        <span class="tip" v-if="tip">
            <img :src="helpIconSrc" @mouseenter="tipShow = true" @mouseleave="tipShow = false">
            <div class="ico-layer" v-show="tipShow">
                <p>{{ tip }}</p>
            </div>
        </span>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'TabTitle',
    props: ['title', 'tip'],
    // methods: {
    //     close(e) {
    //         if (!this.$el.contains(e.target)) {
    //             this.tipShow = false;
    //         }
    //     }
    // },
    data() {
        return {
            helpIconSrc: require('@/assets/help_icon.png'),
            tipShow: false
        }
    },
    // created() {
    //     window.addEventListener('click', this.close)
    // },
    // beforeDestroy() {
    //     window.removeEventListener('click', this.close);
    // }
}
</script>
<style scoped>
.chart-box-title {
    border-bottom: 1px solid #ececec;
    height: 52px;
}

.chart-box-title h3 {
    /* display: inline-block; */
    float: left;
    font-size: 16px;
    line-height: 54px;
    text-indent: 20px;
    font-weight: normal
}

.tip {
    color: #666;
    cursor: pointer;
    display: inline-block;
    left: 12px;
    top: 20px;
    margin: 0;
    position: relative;
}

.ico-layer {
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 3px;
    box-shadow: 3px 3px 6px #e0e0e0;
    padding: 10px;
    position: absolute;
    top: 23px;
    width: 184px;
    z-index: 10;
    line-height: 22px;
}
</style>