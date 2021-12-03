<template>
  <div id="scrolled" class="scrolled">
    <div class="containe"></div>
    <div class="containe"></div>
    <div class="containe"></div>
    <div class="containe"></div>
    <div class="containe"></div>
    <div class="containe"></div>
    <div class="containe"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Week",
});
</script>

<style scoped>
.containe {
  background-color: rgb(207, 192, 192);
  width: 100%;
  height: 20vh;
}
.containe:nth-child(2n) {
  background-color: rgb(134, 134, 134);
}

#scrolled {
  flex: 1;
  display: flex;
  flex-direction: column;
}
#scrolled > div{
  min-height: 20vh;
}
</style>
