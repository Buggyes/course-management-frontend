import { baseURL } from "./BaseAPI";

export async function get_instructors() {
    let url = baseURL + 'instructors/'
    try {
        const response = await fetch(url,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            })
        return response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function post_instructor(instrFormData) {
    let url = baseURL + 'instructor/'
    try {
        const response = await fetch(url,
            {
                method: "POST",
                body: instrFormData
            })
        return response.json()
    } catch (error) {
        console.log(error)
    }
}