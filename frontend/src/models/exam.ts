import { Course } from './course';
import { Subject } from './subject';
import { User } from './user';

export type Exam = {
    id: number;
    courseId: number;
    name: string;
    examDate: string;
    examTime: number;
    startedAt: string | null;
    cancelledAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ExamInMonth = Exam & {
    course: Course & {
        subject: Subject;
    };
};

export type ExamDetail = Exam & {
    questionsCount: number;
    supervisors: (User & {
        pivot: {
            examId: number;
            userId: number;
            id: number;
            createdAt: string;
            updatedAt: string;
        };
    })[];
};

export type ExamWithQuestion = {
    examData: Exam & {
        questions: ExamQuestion[];
    };
    answersCache: number[] | null;
};

export type QueryExamType = {
    month?: string;
    year?: string;
};

export type ExamQuestion = {
    id: number;
    content: string;
    pivot: Pivot;
    questionOptions: QuestionOption[];
};

type Pivot = {
    examId: number;
    questionId: number;
    id: number;
    createdAt: string;
    updatedAt: string;
};

type QuestionOption = {
    id: number;
    questionId: number;
    content: string;
};
