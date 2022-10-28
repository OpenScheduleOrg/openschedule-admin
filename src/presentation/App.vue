<template>
  <router-view v-slot="{Component}">
    <transition name="route" mode="out-in"> 
      <component :is="Component"> </component>
    </transition>
  </router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DEFAULT_TITLE } from "@/common/constants";

export default defineComponent({
  name: "App",
  watch: {
    $route: {
      handler(to) {
        document.title = to.meta.title || DEFAULT_TITLE;
      },
    },
  },
});
</script>

<style scoped>


.route-enter-from{
  opacity: 0;
}

.route-enter-active{
  transition: all 0.6s ease-in;
}

.route-enter-to{
  opacity: 1;
}
.route-leave-from{
  opacity: 1;
}

.route-leave-active{
  transition: all 0.6s ease-in;
}
.route-leave-to{
  opacity: 0;
}



</style>
