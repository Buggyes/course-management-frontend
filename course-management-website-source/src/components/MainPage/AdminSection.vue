<script setup>
import { defineProps, ref, watch } from 'vue';
import { get_courses, post_course, delete_course } from '../API/CourseAPI';
import { get_instructors, post_instructor, delete_instructor } from '../API/InstructorAPI';
import default_pfp from '../../assets/default_pfp.png'
import default_banner from '../../assets/default_banner.png'
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
const courseReg = ref({
    name: '',
    description: '',
    banner: '',
    instructor_id: null,
    area_id: null,
    bannerFile: null
})
const selectedArea = ref('')
const selectedAreaList = ref([])

watch(() => props.administering, async (newAdministering, oldAdministering) => {
    if (newAdministering) {
        try {
            courses.value = await get_courses();
            instructors.value = await get_instructors();
            areas.value = await get_areas();
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

function onCourseBannerChange(event) {
    const file = event.target.files[0];
    if (file) {
        if (!courseReg.value) courseReg.value = {};
        courseReg.value.bannerFile = file;
    }
}

async function registerInstructor() {
    if (instrReg.value.areas_id.length > 0) {
        const formData = new FormData();
        formData.append("name", instrReg.value.name);
        formData.append("biography", instrReg.value.biography);
        if (instrReg.value.pfpFile) {
            formData.append("pfp", instrReg.value.pfpFile);
        } else {
            const response = await fetch(default_pfp);
            const blob = await response.blob();
            const file = new File([blob], 'default-pfp.png', { type: blob.type });
            formData.append("pfp", file);
        }
        if (instrReg.value.bannerFile) {
            formData.append("banner", instrReg.value.bannerFile);
        } else {
            const response = await fetch(default_banner);
            const blob = await response.blob();
            const file = new File([blob], 'default_banner.png', { type: blob.type });
            formData.append("banner", file);
        }
        instrReg.value.areas_id.forEach(id => {
            formData.append("areas_id", id);
        });
        post_instructor(formData).then(async () => {
            instructors.value = await get_instructors();
            closeInstrForm()
        })
    }
}

async function registerCourse() {
    const formData = new FormData();
    formData.append("name", courseReg.value.name);
    formData.append("description", courseReg.value.description);
    formData.append("instructor_id", courseReg.value.instructor_id)
    formData.append("area_id", courseReg.value.area_id)
    if (courseReg.value.bannerFile) {
        formData.append("banner", courseReg.value.bannerFile);
    }
    else {
        const response = await fetch(default_banner);
        const blob = await response.blob();
        const file = new File([blob], 'default_banner.png', { type: blob.type });
        formData.append("banner", file);
    }
    post_course(formData).then(async () => {
        courses.value = await get_courses();
        closeCourseForm()
    })
}

async function deleteInstructor(id) {
    await delete_instructor(id).then(async () => {
        instructors.value = await get_instructors();
    })
}

async function deleteCourse(id) {
    await delete_course(id).then(async () => {
        courses.value = await get_courses();
    })
}

function resetCourseForm() {
    instrReg.value = {
        name: '',
        description: '',
        banner: '',
        instructor_id: null,
        area_id: null,
        bannerFile: null
    };
    const bannerInput = document.getElementById("courseBanner");
    if (bannerInput) bannerInput.value = "";
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

function closeCourseForm() {
    creatingCourse.value = false
    resetCourseForm()
}

function closeInstrForm() {
    creatingInstr.value = false
    resetInstructorForm()
}

</script>

<template>
    <div v-if="administering">
        <div style="margin-top: 20px;">
            <button class="create-button" @click="creatingCourse = true">Cadastrar Curso</button>
            <button class="create-button" @click="creatingInstr = true">Cadastrar Instrutor</button>
        </div>
        <Modal v-if="creatingCourse" @close="closeCourseForm">
            <form @submit.prevent="registerCourse">
                <h2>Cadastrar Course</h2>
                <label for="courseName">Nome:</label><br>
                <input type="text" v-model="courseReg.name" id="courseName" required><br>
                <label for="courseDescr">Descrição:</label><br>
                <textarea v-model="courseReg.description" id="courseDescr"/><br>
                <label for="courseBanner">Banner:</label><br>
                <input type="file" id="courseBanner" @change="onCourseBannerChange" accept=".png"><br>
                <h3>Area de atuação do curso:</h3>
                <select v-model="courseReg.area_id" required>
                    <option disabled value="">Selecione uma área de atuação</option>
                    <option v-for="opt in areas" :key="opt.id" :value="opt.id">
                        {{ opt.name }}
                    </option>
                </select>
                <h3>Instrutor do curso:</h3>
                <select v-model="courseReg.instructor_id" required>
                    <option disabled value="">Selecione um instrutor</option>
                    <option v-for="opt in instructors" :key="opt.id" :value="opt.id">
                        {{ opt.name }}
                    </option>
                </select><br><br>
                <button type="submit">Confirmar</button>
            </form>
        </Modal>
        <Modal v-if="creatingInstr" @close="closeInstrForm">
            <form @submit.prevent="registerInstructor">
                <h2>Cadastrar Instrutor</h2>
                <label for="instrName">Nome:</label><br>
                <input type="text" v-model="instrReg.name" id="instrName" required><br>
                <label for="instrBio">Biografia:</label><br>
                <textarea v-model="instrReg.biography" id="instrBio" /><br>
                <label for="instrPfp">Foto de perfil:</label><br>
                <input type="file" id="instrPfp" @change="onInstrPfpChange" accept=".png"><br>
                <label for="instrBanner">Banner:</label><br>
                <input type="file" id="instrBanner" @change="onInstrBannerChange" accept=".png"><br>
                <h3>Area(s) de atuação:</h3>
                <select v-model="selectedArea" @change="addInstrSelectedArea">
                    <option disabled value="">Selecione uma área de atuação</option>
                    <option v-for="opt in areas" :key="opt.id" :value="opt.id">
                        {{ opt.name }}
                    </option>
                </select>
                <ul>
                    <li v-for="area in selectedAreaList" :key="area.id" aria-required="true"
                        :aria-invalid="selectedAreaList.length === 0">
                        {{ area.name }}
                        <button @click="removeInstrSelectedArea(area.id)">X</button>
                    </li>
                </ul>
                <button type="submit">Confirmar</button>
            </form>
        </Modal>
        <div style="display: flex; margin-top: 10px;">
            <div class="table-container">
                <h2>Cursos</h2>
                <table>
                    <tr>
                        <th>Banner</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Instrutor</th>
                        <th>Area</th>
                        <th>Ações</th>
                    </tr>
                    <tr v-for="i in courses" :key="i.id">
                        <td><img class="table-banner" :src="i.banner" alt="banner"></td>
                        <td>{{ i.name }}</td>
                        <td>{{ i.description }}</td>
                        <td>{{ instructors.find(instr => instr.id === i.instructor)?.name }}</td>
                        <td>{{ areas.find(area => area.id === i.area)?.name }}</td>
                        <td><button @click="deleteCourse(i.id)">Excluir</button></td>
                    </tr>
                </table>
            </div>
            <div class="table-container">
                <h2>Instrutores</h2>
                <table>
                    <tr>
                        <th></th> <!-- foto -->
                        <th>Banner</th>
                        <th>Nome</th>
                        <th>Biografia</th>
                        <th>Areas de Atuação</th>
                        <th>Ações</th>
                    </tr>
                    <tr v-for="i in instructors" :key="i.id">
                        <td><img class="table-pfp" :src="i.pfp" alt="foto de perfil"></td>
                        <td><img class="table-banner" :src="i.banner" alt="banner"></td>
                        <td>{{ i.name }}</td>
                        <td>{{ i.biography }}</td>
                        <td>
                            <div v-for="area in i.areas" :key="area.id"><span>{{ area.name }}</span></div>
                        </td>
                        <td><button @click="deleteInstructor(i.id)">Excluir</button></td>
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
    padding: 10px;
}

.table-container table tr td {
    outline-style: solid;
    outline-width: 1px;
    padding: 10px;
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