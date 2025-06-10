import { baseURL } from "./BaseAPI";

export default async function login_user(name, password) {
    let url = baseURL + 'users/login/'
    let content = {
        "login":name,
        "password":password
    }
    try {
        const response = await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(content)
            })
        return response.json()
    } catch (error) {
        console.log(error)
    }
}