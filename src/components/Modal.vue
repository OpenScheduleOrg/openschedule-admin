<template>
  <transition name="modal">
    <div ref="modal_mask" @click="closeModal($event)" class="modal-mask">
      <div  class="modal-container">
        <span id="close-modal" @click="$emit('close_modal')"
          ><font-awesome-icon
            :icon="['fa', 'times']"
          ></font-awesome-icon
        ></span>
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  methods: {
    closeModal(e: Event) {
      if(e.target == this.$refs.modal_mask) this.$emit("close_modal")
    },
  },
});
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  transition: opacity 0.5s ease;
  align-items: center;
  justify-content: center;
}

.modal-container {
  position: relative;
  min-width: 35%;
  min-height: 20%;
  background-color: var(--bg-light);
  border-radius: 4px;
  padding: 0.1rem;
}

#close-modal {
  display: none;
  position: absolute;
  cursor: pointer;
  right: 1px;
  top: -5px;
  color: rgba(31, 31, 31, 0.35);
  font-size: 1.3rem;
}

#close-modal:hover {
  transition: color 0.3s;
  color: rgba(31, 31, 31, 0.55);
}
</style>
