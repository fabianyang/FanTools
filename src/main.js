import Vue from 'vue';
import App from './app.vue';
import Toast from './components/toast';

// https://segmentfault.com/a/1190000008188461
// https://segmentfault.com/a/1190000010708735

// import hljs from 'highlight.js';
// import 'highlight.js/styles/googlecode.css';

// Vue.directive('highlight', function (el) {
//     let blocks = el.querySelectorAll('pre code');
//     blocks.forEach((block) => {
//         hljs.highlightBlock(block);
//     });
// });

const vm = new Vue({
    el: '#app',
    render: (h) => h(App)
});

Vue.use(Toast, {container: vm.$el});