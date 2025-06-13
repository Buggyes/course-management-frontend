import { baseURL } from "./BaseAPI";

export default async function get_instructors() {
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