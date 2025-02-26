export const API_ENDPOINTS = {
    CHALLENGES: {
        LIST: '/admin/challenges',
        CREATE: '/admin/challenges',
        GET: (id: string) => `/admin/challenges/${id}`,
        UPDATE: (id: string) => `/admin/challenges/${id}`,
        DELETE: (id: string) => `/admin/challenges/${id}`,
    },
    COMMUNITIES: {
        LIST: '/admin/communities',
    },
    ACTION: {
        LIST: '/admin/actions',
        CREATE: '/admin/actions',
        GET: (id: string) => `/admin/actions/${id}`,
        UPDATE: (id: string) => `/admin/actions/${id}`,
    },
    REWARDS: {
        LIST: '/admin/rewards',
        CREATE: '/admin/rewards',
        GET: (id: string) => `/admin/rewards/${id}`,
        UPDATE: (id: string) => `/admin/rewards/${id}`,
        ASSIGN: (id: string) => `/admin/challenges/${id}/distribution`,
        DISTRIBUTION: (id: string) => `/admin/challenges/${id}/distribution`,
    }
};