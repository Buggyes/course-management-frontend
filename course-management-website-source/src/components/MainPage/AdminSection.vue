<script setup>
import { defineProps, ref, watch } from 'vue';
import get_courses from '../API/CourseAPI';
import { get_instructors, post_instructor } from '../API/InstructorAPI';
import Modal from '../UI/Modal.vue';
import get_areas from '../API/AreaAPI'
const props = defineProps({ administering: Boolean })

const courses = ref([])
const instructors = ref([])
const areas = ref([])
const creatingCourse = ref(false)
const creatingInstr = ref(false)
const instrReg = ref({
    name: '',
    biography: '',
    pfp: '',
    banner: '',
    areas_id: [],
    pfpFile: null,
    bannerFile: null
})
const selectedArea = ref('')
const selectedAreaList = ref([])

watch(() => props.administering, async (newAdministering, oldAdministering) => {
    if (newAdministering) {
        try {
            const fetchedCourses = await get_courses();
            courses.value = fetchedCourses;
            const fetchedInstructors = await get_instructors();
            instructors.value = fetchedInstructors;
            const fetchedAreas = await get_areas();
            areas.value = fetchedAreas;
        } catch (err) {
            console.log("failed to fetch from database")
        }
    }
}, { immediate: true })

function addInstrSelectedArea() {
    const area = areas.value.find(o => o.id === Number(selectedArea.value))
    if (area && !selectedAreaList.value.some(item => item.id === area.id)) {
        selectedAreaList.value.push(area)
    }
    selectedArea.value = ''
    instrReg.value.areas_id = selectedAreaList.value.map(area => area.id)
}

function removeInstrSelectedArea(id) {
    selectedAreaList.value = selectedAreaList.value.filter(item => item.id !== id)
    instrReg.value.areas_id = selectedAreaList.value.map(area => area.id)
}

function registerInstructor() {
    const formData = new FormData();
    formData.append("name", instrReg.value.name);
    formData.append("biography", instrReg.value.biography);
    if (instrReg.value.pfpFile) {
        formData.append("pfp", instrReg.value.pfpFile);
    }
    if (instrReg.value.bannerFile) {
        formData.append("banner", instrReg.value.bannerFile);
    }
    instrReg.value.areas_id.forEach(id => {
        formData.append("areas_id", id);
    });
    post_instructor(formData)
    resetInstructorForm()
    creatingInstr.value = false
}

function onInstrPfpChange(event) {
    const file = event.target.files[0];
    if (file) {
        if (!instrReg.value) instrReg.value = {};
        instrReg.value.pfpFile = file;
    }
}

function onInstrBannerChange(event) {
    const file = event.target.files[0];
    if (file) {
        if (!instrReg.value) instrReg.value = {};
        instrReg.value.bannerFile = file;
    }
}

function resetInstructorForm() {
    instrReg.value = {
        name: '',
        biography: '',
        pfp: '',
        banner: '',
        areas_id: [],
        pfpFile: null,
        bannerFile: null
    };
    selectedArea.value = '';
    selectedAreaList.value = [];

    const pfpInput = document.getElementById("instrPfp");
    const bannerInput = document.getElementById("instrBanner");
    if (pfpInput) pfpInput.value = "";
    if (bannerInput) bannerInput.value = "";
}

</script>

<template>
    <div v-if="administering">
        <div style="margin-top: 20px;">
            <button class="create-button" @click="creatingCourse = true">Cadastrar Curso</button>
            <button class="create-button" @click="creatingInstr = true">Cadastrar Instrutor</button>
        </div>
        <Modal v-if="creatingCourse" @close="creatingCourse = false">
            <h1>OIE</h1>
        </Modal>
        <Modal v-if="creatingInstr" @close="creatingInstr = false">
            <form @submit.prevent="registerInstructor">
                <h2>Cadastrar Instrutor</h2>
                <label for="instrName">Nome:</label><br>
                <input type="text" v-model="instrReg.name" id="instrName" required><br>
                <label for="instrBio">Biografia:</label><br>
                <textarea v-model="instrReg.biography" id="instrBio" required/><br>
                <label for="instrPfp">Foto de perfil:</label><br>
                <input type="file" id="instrPfp" @change="onInstrPfpChange" accept=".png" required><br>
                <label for="instrBanner">Banner:</label><br>
                <input type="file" id="instrBanner" @change="onInstrBannerChange" accept=".png" required><br>
                <h3>Area(s) de atuação:</h3>
                <select v-model="selectedArea" @change="addInstrSelectedArea">
                    <option disabled value="">Selecione uma área de atuação</option>
                    <option v-for="opt in areas" :key="opt.id" :value="opt.id">
                        {{ opt.name }}
                    </option>
                </select>
                <ul>
                    <li v-for="area in selectedAreaList" :key="area.id">
                        {{ area.name }}
                        <button @click="removeInstrSelectedArea(area.id)">X</button>
                    </li>
                </ul>
                <button type="submit">Confirmar</button>
            </form>
        </Modal>
        <div style="display: flex; margin-top: 10px;">
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
                        <th>Banner</th>
                        <th>Nome</th>
                        <th>Biografia</th>
                        <th>Areas de Atuação</th>
                    </tr>
                    <tr v-for="i in instructors" :key="i.id">
                        <td><img class="table-pfp" :src="i.pfp" alt="foto de perfil"></td>
                        <td><img class="table-banner" :src="i.banner" alt="banner"></td>
                        <td>{{ i.name }}</td>
                        <td>{{ i.biography }}</td>
                        <td><span v-for="area in i.areas" :key="area.id">{{ area.name }}</span></td>
                    </tr>
                </table>
            </div>
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

.table-pfp {
    height: 50px;
    width: 50px;
}

.table-banner {
    height: 50px;
    width: 100px;
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