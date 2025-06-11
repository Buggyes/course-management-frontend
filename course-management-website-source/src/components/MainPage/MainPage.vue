<script setup>
    import { ref } from "vue";
    import get_areas from "../API/AreaAPI"

    const areas = ref(await get_areas())
    console.log(areas)
</script>

<template>
<header><span>oi</span></header>

</template>

<style lang="css" scoped>
header {
    background-color: black;
}
header span {
    color: white;
}
</style>