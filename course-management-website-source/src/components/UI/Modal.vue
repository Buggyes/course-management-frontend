<script setup>
import { defineEmits } from 'vue';
const emit = defineEmits(['close'])

function close() {
    emit('close')
}

</script>

<template>
    <div class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <button class="close-button" @click="close">X</button>
            <slot></slot>
        </div>
    </div>
</template>


<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background-color: white;
    padding: 1rem;
    border-radius: 8px;
    min-width: 400px;
}

.close-button {
    margin-left: 90%;
    background-color: rgb(255, 133, 133);
}

.submit-button {
    margin-left: 80%;
    background-color: rgb(139, 186, 255);
}
</style>