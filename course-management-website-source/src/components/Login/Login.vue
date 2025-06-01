<template>
<form>
    <div class="formContent">
        <label for="usernameInput">Usuário:</label><br>
        <input type="text" name="username" id="usernameInput"><br>
        <label for="usernameInput">Senha:</label><br>
        <input type="password" name="password" id="passwordInput"><br>
        <button type="button" onclick="login()">Login</button>
    </div>
</form>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';

export default class Login extends Vue {

}
</script>

<style lang="css" scoped>
form {
    min-height: 100%;
    vertical-align: middle;
}
.formContent{
    justify-self: center;
}
</style>