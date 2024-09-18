<template>
    <div id="popper1">
      <button ref="buttonRef" @click="togglePopper">
        Toggle Popper
      </button>
      <div ref="popperRef" v-show="isPopperVisible" class="popper">
        Popper content here
      </div>
    </div>
</template>
  
<script>
import { ref, onMounted } from 'vue';
import { createPopper } from '@popperjs/core';

export default {
setup() {
    const buttonRef = ref(null);
    const popperRef = ref(null);
    const isPopperVisible = ref(false);
    let popperInstance = null;

    const togglePopper = () => {
    isPopperVisible.value = !isPopperVisible.value;
    };

    onMounted(() => {
    if (buttonRef.value && popperRef.value) {
        popperInstance = createPopper(buttonRef.value, popperRef.value, {
        placement: 'top'
        });
    }
    });

    return {
    buttonRef,
    popperRef,
    isPopperVisible,
    togglePopper,
    };
},
};
</script>
  
<style scoped>
.popper {
background-color: #eee;
padding: 10px;
border: 1px solid #ddd;
}

#popper1{
    display: flex;
    justify-content: center;
    margin: 5px;
}
</style>