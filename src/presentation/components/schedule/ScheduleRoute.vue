<template>
    <router-view/>
    <schedule-list/>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import  ScheduleList  from "./ScheduleList.vue"

export default defineComponent({
    name: "ScheduleRoute",
    components: { 
        ScheduleList
    }
});
</script>