/* eslint-disable @typescript-eslint/no-explicit-any */
import apiUtils from '~utils/apiUtils';
import request from '../config/api';
import { Course, CourseDetail, QueryCourseType } from '../models/course';
import { ApiResponseWithData } from '../models/response';
import encodeFormData from '../utils/encodeFormData';
import pathUtils from '../utils/pathUtils';

const prefix = 'courses';

export async function apiGetCourses(query: QueryCourseType) {
    try {
        const res = await request.get(pathUtils.join(prefix), {
            params: {
                search: query.search,
                semester_id: query.semesterId
            }
        });
        const { data } = res.data as ApiResponseWithData<Course[]>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiGetCourseById(id: string | number) {
    try {
        const res = await request.get(pathUtils.join(prefix, id));
        const { data } = res.data as ApiResponseWithData<CourseDetail>;
        return data;
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiCreateCourse(formData: FormData) {
    try {
        await request.post(pathUtils.join(prefix), formData);
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateCourse(formData: FormData, id: string | number) {
    try {
        const encodedData = encodeFormData(formData);
        await request.put(pathUtils.join(prefix, id), encodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiDeleteCourse(id: string | number) {
    try {
        await request.delete(pathUtils.join(prefix, id));
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}

export async function apiUpdateCourseStudents(studentIds: (string | number)[], id: string | number) {
    try {
        const encodedData = new URLSearchParams();
        studentIds.forEach(item => {
            encodedData.append('student_ids[]', String(item));
        });
        await request.put(pathUtils.join(prefix, id, 'students'), encodedData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    } catch (error: any) {
        return apiUtils.handleError(error);
    }
}
