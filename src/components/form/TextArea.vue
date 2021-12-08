<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Form",
});
</script>

<style scoped>
form {
  display: flex;
  background-color: rgba(134, 134, 134, 0.315);
  width: 100%;
  height: 100%;
  flex-direction: column;
}
</style>
