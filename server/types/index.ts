/**
 * Interface for token registration requests
 */
export interface TokenRegisterRequest {
    token: string;
    userId: string;
    appBundle: string;
}

export interface TokenDeleteRequest {
    token: string;
}
