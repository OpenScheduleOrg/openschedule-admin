<template>
    <router-view/>
    <professional-list/>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import  ProfessionalList  from "./ProfessionalList.vue"

export default defineComponent({
    name: "ProfessionalRoute",
    components: { 
        ProfessionalList
    }
});
</script>