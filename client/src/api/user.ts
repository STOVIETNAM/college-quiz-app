import request, { getToken } from './config'
import { QueryUserType, RoleName, User, UserDetail, UserPagination } from '../models/user'
import { ApiResponseWithData } from '../models/response'

export async function apiGetUser() {
    if (!getToken()) throw new Error('no token')
    try {
        const res = await request.get('/user')
        const { data } = res.data as ApiResponseWithData<User>
        return data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        if (error.response.status === 401) localStorage.removeItem('token')
        const message = error.response.data.message
        throw new Error(message)
    }
}
export async function apiCreateUser(form: FormData) {
    if (!getToken()) throw new Error('no token')
    try {
        await request.post('/user', form)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        if (error.response.data.errors) return Promise.reject(error.response.data.errors)
        throw new Error(message)
    }
}
export async function apiUpdateUser(form: FormData, id: string | number) {
    if (!getToken()) throw new Error('no token')
    try {
        await request.put('/user/' + id, form)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        if (error.response.data.errors) return Promise.reject(error.response.data.errors)
        throw new Error(message)
    }
}
export async function apiImportUsers(file: File, role: RoleName) {
    if (!getToken()) throw new Error('no token')
    const data = new FormData()
    data.append('role', role)
    data.append('file', file)
    try {
        await request.post('/user/import', data)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (!error.response) throw new Error(error.message)
        const message = error.response.data.message
        if (error.response.data.errors) return Promise.reject(error.response.data.errors)
        throw new Error(message)
    }
}
export async function apiGetUsersByType(query?: QueryUserType) {
    try {
        const res = await request.get('/user/query', {
            params: {
                role: query?.role,
                page: query?.page || 1,
                per_page: query?.perPage || 10,
                search: query?.search
            }
        })
        const { data } = res.data as ApiResponseWithData<UserPagination>
        return data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message)
    }
}
export async function apiGetUsersById(id: string | number) {
    try {
        const res = await request.get('/user/' + id)
        const { data } = res.data as ApiResponseWithData<UserDetail>
        return data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message)
    }
}
export async function apiDeleteUserByIds(ids: (string | number)[]) {
    try {
        await request.delete('/user/', {
            params: {
                ids: ids,
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        throw new Error(error.message)
    }
}