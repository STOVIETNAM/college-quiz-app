import axios, { AxiosError, AxiosResponse } from 'axios'
import toast from './toast'
import { getLanguage } from './languages'
const env = import.meta.env

const host = env.DEV === true ? `${window.location.origin.replace(env.VITE_DEV_PORT, env.VITE_DEV_SERVER_PORT)}/`
    : `${window.location.origin}/`

const baseURL = host + 'api/'

const ignoreLoaders = [
    '/user/info',
    '/comment',
    '/product/suggest',
    '/product/auto-complete'
]
const studentExcelTemplate = host + 'data/Import_Student_Template.xlsx'
const teacherExcelTemplate = host + 'data/Import_Teacher_Template.xlsx'

function getToken() {
    const token = localStorage.getItem('token') || '' as string
    return token
}
function getTokenHeader() {
    return `Bearer ${getToken()}`
}
const request = axios.create({
    baseURL: baseURL
})
request.interceptors.request.use(config => {
    config.headers['Accept-Language'] = getLanguage()
    if (config.method === 'get' && !ignoreLoaders.includes(config.url || '')) {
        config.onDownloadProgress = (progressEvent) => {
            const loaderElement = document.querySelector<HTMLDivElement>('#loader')
            if (progressEvent.progress && loaderElement) {
                const percent = 100 * progressEvent.progress
                if (percent !== 100) requestAnimationFrame(() => { loaderElement.style.width = `${percent}%` })
                else requestAnimationFrame(() => { loaderElement.style.width = '0%' })
            }
        }
    }
    if (getToken()) {
        config.headers.Authorization = getTokenHeader()
    }
    config.headers['Content-Type'] = 'multipart/form-data'
    return config
})

request.interceptors.response.use(
    function (response) {
        if (response.data && response.headers['content-type'] === 'application/json')
            if (response.data.message && response.data.status === 'success') toast.success(response.data.message)
        return response
    },
    function (error: AxiosError) {
        if (error.message === 'Network Error') {
            toast.error(error.message)
            return Promise.reject(error)
        }
        const response = error.response as AxiosResponse
        if (response.data && response.headers['content-type'] === 'application/json') {
            if (response.data.message) toast.error(response.data.message)
        }
        return Promise.reject(error)
    }
)

export {
    studentExcelTemplate,
    teacherExcelTemplate,
    getToken,
    getTokenHeader,
}
export default request
