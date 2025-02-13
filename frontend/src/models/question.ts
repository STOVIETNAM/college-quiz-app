type QuestionLevel = 'easy' | 'medium' | 'hard' | 'expert';

export type Question = {
    id: number;
    createdByUserId: number | null;
    lastUpdatedByUserId: number | null;
    level: QuestionLevel;
    content: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
};

export type QueryQuestionType = {
    search?: string;
};

export type QuestionOption = {
    id: number;
    questionId: number;
    content: string;
    isCorrect: boolean;
};

export type QuestionDetail = Question & {
    questionOptions: QuestionOption[];
};
