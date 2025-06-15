import { baseURL } from "./BaseAPI";

export async function get_courses() {
    let url = baseURL + 'courses/'
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

export async function get_courses_by_area(areaId) {
    let url = baseURL + 'courses/'+areaId
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

export async function post_course(courseFormData) {
    let url = baseURL + 'course/'
    try {
        const response = await fetch(url,
            {
                method: "POST",
                body: courseFormData
            })
        return response.json()
    } catch (error) {
        console.log(error)
    }
}

export async function delete_course(id) {
    let url = baseURL + 'course/'+id
    try {
        const response = await fetch(url,
            {
                method: "DELETE",
            })
        return response.json()
    } catch (error) {
        console.log(error)
    }
}