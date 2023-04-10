export function apiMethod (method) {
    return async (event, data) => {
        try {
            return await method(event, data);
        } catch (error) {
            return {
                error,
                message: error.message
            }
        }
    }
}

export default {
    apiMethod
}