import { request } from "umi";


export function searchAdmin(where: {}) {
    return request("/admin/search", {
        method: "post",
        data: { ...where }
    });
}

export function getDetail({ id }: any) {
    return request(`/site/detail`, {
        method: "post",
        data: {
            id
        }
    });
}
export function deleteMember({ id }: any) {
    return request(`/admin/delete`, {
        method: "post",
        data: {
            id
        }
    });
}

export function adminUpdate({ id, data }: any) {
    return request(`/admin/update`, {
        method: "post",
        data: {
            id,
            ...data
        }
    });
}
export function addAdmin(data: {}) {
    return request(`/admin/add`, {
        method: "post",
        ...data
    });
}


export function getRole(where: {}) {
    return request("/role/search", {
        method: "post",
        data: { ...where }
    });
}


export function deleteRole({ id }: any) {
    return request(`/role/delete`, {
        method: "post",
        data: {
            id
        }
    });
}

export function roleUpdate({ id, data }: any) {
    return request(`/role/update`, {
        method: "post",
        data: {
            id,
            ...data
        }
    });
}
export function addRole(data: {}) {
    return request(`/role/add`, {
        method: "post",
        ...data
    });
}
