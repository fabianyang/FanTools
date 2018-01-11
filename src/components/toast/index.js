import ToastComponent from './toast.vue';

const Toast = {};

const isDOMElement = (obj) => {
    return !!(obj && typeof window !== 'undefined' && (obj === window || obj.nodeType));
};

// 注册Toast
Toast.install = function (Vue, {container}) {
    if (!isDOMElement(container)) {
        throw Error('Toast Dom Append Fail!');
    }

    // 生成一个Vue的子类
    // 同时这个子类也就是组件
    const ToastConstructor = Vue.extend(ToastComponent);
    // 生成一个该子类的实例
    const instance = new ToastConstructor();

    // 将这个实例挂载在我创建的div上
    // 并将此div加入全局挂载点内部
    instance.$mount(document.createElement('div'));
    // document.body.appendChild(instance.$el);
    container.appendChild(instance.$el);

    // 通过Vue的原型注册一个方法
    // 让所有实例共享这个方法
    let timer;
    Vue.prototype.$toast = (msg, duration = 2000) => {
        instance.message = msg;
        instance.show = true;

        clearTimeout(timer);
        timer = setTimeout(() => {
            instance.show = false;
            clearTimeout(timer);
        }, duration);
    };
};

export default Toast;