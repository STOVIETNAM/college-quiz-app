const keys = [
    'USER_EXPORTABLE_FIELDS',
    'PAGE_DASHBOARD',
    'PAGE_PROFILE',
    'PAGE_USERS',
    'PAGE_PERMISSIONS',
    'PAGE_ROLE_PERMISSIONS',
    'USER_DETAIL',
    'AUTO_COMPLETE_USER',
    'PAGE_QUESTIONS',
    'QUESTION_DETAIL',
    'ALL_EMPLOYEE',
    'ALL_MANAGER',
    'CHAPTERS_DETAILS',
    'PAGE_EXAMS',
    'EXAM',
    'EXAM_QUESTIONS',
    'LOGIN_SESSIONS',
    'CALLABLE_COMMANDS',
    'ALL_SETTINGS',
    'EXAM_RESULTS',
    'EXAM_RESULT',
] as const;

type QueryKey = (typeof keys)[number];

const QUERY_KEYS: Record<QueryKey, QueryKey> = Object.freeze(
    keys.reduce((acc, key) => {
        acc[key] = key;
        return acc;
    }, {} as Record<QueryKey, QueryKey>)
);

export default QUERY_KEYS;
