//create a test API that return OK

import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
    return {
        success: true,
        message: 'OK',
    };
});