<script setup>
import { ref, onMounted } from 'vue';
import get_areas from '../API/AreaAPI';

const areas = ref([]);
const administering = ref(false);
const currentArea = ref(null);

function switchArea(areaName) {
    administering.value = false;
    currentArea.value = areaName;
}

onMounted(async () => {
    try {
        const result = await get_areas();
        areas.value = result;
        if (result.length > 0) {
            currentArea.value = result[0].name; // default on startup
        }
    } catch (err) {
        console.error("Failed to fetch areas:", err);
    }
});
</script>

<template>
    <header>
        <div class="menu-container">
            <button class="administer-option" @click="administering = true">Administrar</button>
            <button v-for="area in areas" :key="area.id" class="aa-option" type="button" @click="switchArea(area.name)">
                {{ area.name }}
            </button>
        </div>
    </header>
    <div class="title-container" v-if="!administering">
        <span>Você está na área de...</span>
        <h1>{{ currentArea }}</h1>
    </div>
</template>

<style scoped>
header {
    background-color: black;
}

.title-container {
    margin-left: 20%;
    display: flex;
    font-size: 150%;
}

.aa-option {
    flex: 1;
    margin: 3px;
    padding: 10px;
    color: white;
    background-color: rgb(0, 13, 54);
    outline-style: solid;
    outline-color: rgb(16, 0, 104);
    outline-width: 2px;
}

.administer-option {
    flex: 1;
    margin: 3px;
    padding: 10px;
    color: white;
    background-color: rgb(16, 0, 104);
    outline-style: solid;
    outline-color: rgb(0, 13, 54);
    outline-width: 2px;
}

.menu-container {
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
}
</style>
