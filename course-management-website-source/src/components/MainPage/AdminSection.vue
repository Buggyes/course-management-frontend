<script setup>
import { defineProps, ref, watch } from 'vue';
import get_courses from '../API/CourseAPI';
import get_instructors from '../API/InstructorAPI';
const props = defineProps({ administering: Boolean })

const courses = ref([])
const instructors = ref([])

watch(() => props.administering, async (newAdministering, oldAdministering) => {
    if(newAdministering) {
        const fetchedCourses = await get_courses();
        courses.value = fetchedCourses;
        const fetchedInstructors = await get_instructors();
        instructors.value = fetchedInstructors;
    }
}, {immediate: true})

</script>

<template>
    <div style="margin-top: 20px;" v-if="administering">
        <button class="create-button">Cadastrar Curso</button>
        <button class="create-button">Cadastrar Instrutor</button>
    </div>
    <div style="display: flex; margin-top: 10px;" v-if="administering">
        <div class="table-container">
            <span>Cursos</span>
            <table>
                <tr>
                    <th>Nome</th>
                    <th>Instrutor</th>
                    <th>Descrição</th>
                    <th>Banner</th>
                </tr>
                <tr>

                </tr>
            </table>
        </div>
        <div class="table-container">
            <span>Instrutores</span>
            <table>
                <tr>
                    <th></th> <!-- foto -->
                    <th>Nome</th>
                    <th>Biografia</th>
                    <th>Banner</th>
                </tr>
                <tr>

                </tr>
            </table>
        </div>
    </div>
</template>

<style scoped>
.table-container {
    margin-right: 2%;
}

.table-container table tr th {
    outline-style: solid;
    outline-width: 1px;
}

.table-container table tr td {
    outline-style: solid;
    outline-width: 1px;
}

.create-button {
    flex: 1;
    margin: 3px;
    padding: 4px;
    color: white;
    background-color: rgb(16, 0, 104);
    outline-style: solid;
    outline-color: rgb(0, 13, 54);
    outline-width: 2px;
}
</style>