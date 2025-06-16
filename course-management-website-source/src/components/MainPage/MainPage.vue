<script setup>
import { ref, onMounted, watch } from 'vue';
import get_areas from '../API/AreaAPI';
import { get_courses_by_area } from '../API/CourseAPI'
import { get_instructors } from '../API/InstructorAPI';
import AdminSection from './AdminSection.vue';

const areas = ref([])
const administering = ref(false)
const currentArea = ref(null)
const courses = ref([])
const instructors = ref([])

watch(() => administering.value, async (newAdministering, oldAdministering) => {
    if (!newAdministering) {
        try {
            instructors.value = await get_instructors();
        } catch (err) {
            console.log("failed to fetch from database")
        }
    }
}, { immediate: true })

async function switchArea(areaName, areaId) {
    administering.value = false
    currentArea.value = areaName
    courses.value = await get_courses_by_area(areaId)
}

onMounted(async () => {
    try {
        const result = await get_areas()
        areas.value = result
        if (result.length > 0) {
            try {
                await switchArea(result[0].name, result[0].id)
            }
            catch (err) {
                console.log("Failed to fetch courses:", err)
            }
        }
    } catch (err) {
        console.error("Failed to fetch areas:", err)
    }
});
</script>

<template>
    <header>
        <div class="menu-container">
            <button class="administer-option" @click="administering = true">Administrar</button>
            <button v-for="area in areas" :key="area.id" class="aa-option" type="button"
                @click="switchArea(area.name, area.id)">
                {{ area.name }}
            </button>
        </div>
    </header>
    <div v-if="!administering">
        <div class="title-container" v-if="!administering">
            <span>Você está na área de...</span>
            <h1>{{ currentArea }}</h1>
        </div>
        <div class="course-container">
            <div v-for="course in courses" :key="course.id">
                <div class="course-card">
                    <table>
                        <tr>
                            <td><img class="course-banner" :src="course.banner" alt="banner"></td>
                        </tr>
                        <tr>
                            <td><span>{{ course.name }}</span></td>
                        </tr>
                        <tr>
                            <td><span>{{ course.description }}</span></td>
                        </tr>
                        <tr>
                            <td><img class="instructor-pfp" :src="instructors.at(course.instructor_id)?.pfp"><span>{{
                                instructors.at(course.instructor_id)?.name }}</span></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <AdminSection :administering="administering.valueOf()" />
</template>

<style scoped>
header {
    background-color: black;
}

table {
    padding: 0px !important;
}

td {
    padding: 0px !important;
}

.title-container {
    margin-top: 20px;
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

.course-container {
    justify-content: left;
    display: flex;
    flex-wrap: wrap;
}

.course-card {
    margin: 10px;
    background-color: rgba(134, 172, 255, 0.425);
    padding-bottom: 10px;
}

.course-banner {
    width: 250px;
    height: 100px;
}

.instructor-pfp {
    border-radius: 100%;
    height: 20px;
    width: 20px;
    margin-right: 5px;
}
</style>
