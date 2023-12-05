<template>
    <router-view/>
    <user-list/>
</template>


<script lang="ts">
import { defineComponent } from "vue";
import  UserList  from "./UserList.vue"

export default defineComponent({
    name: "UserRoute",
    components: { 
        UserList
    }
});
</script>