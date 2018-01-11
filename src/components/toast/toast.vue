<template>
    <transition name="fade">
        <div class="toast" v-show="show">
            {{message}}
        </div>
    </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.toast {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 10px;
  font-size: 1rem;
  color: #fff;
  text-align: center;
  background-color: rgba(51,51,51,.7);
  border-radius: 10px;
  transform: translate(-50%, -50%);
}

.fade-enter-active,
.fade-leave-active {
  transition: 0.3s ease-out;
}
.fade-enter {
  opacity: 0;
  // transform: scale(1.2);
}
.fade-leave-to {
  opacity: 0;
  // transform: scale(0.8);
}
</style>