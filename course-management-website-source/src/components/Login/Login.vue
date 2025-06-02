<script setup>
    import { ref } from "vue";
    import { useRouter } from 'vue-router'
    
    const router = useRouter()

    const username = ref('');
    const password = ref('');
    
    function login() {
        console.log(username.value)
        console.log(password.value)
        router.push({name:"MainPage"})
    }
</script>

<template>
<form @submit.prevent="login()">
    <div class="formContent">
        <label for="usernameInput">Usuário:</label><br>
        <input type="text" v-model="username" name="username" id="usernameInput" required><br>
        <label for="usernameInput">Senha:</label><br>
        <input type="password" v-model="password" name="password" id="passwordInput" required><br>
        <button type="submit">Login</button>
    </div>
</form>
</template>

<style lang="css" scoped>
form {
    min-height: 100%;
    vertical-align: middle;
}
.formContent{
    justify-self: center;
}
</style>