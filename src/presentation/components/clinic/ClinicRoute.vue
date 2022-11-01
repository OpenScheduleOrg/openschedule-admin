<template>
    <router-view/>
    <clinic-list/>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import  ClinicList  from "./ClinicList.vue"

export default defineComponent({
    name: "ClinicRoute",
    components: { 
        ClinicList
    }
});
</script>