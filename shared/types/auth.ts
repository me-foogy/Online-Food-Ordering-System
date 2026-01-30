export type JWTPayload = {
    id: number
    name: string
    email: string
    role: 'admin'|'user'
}

//api default response

export type defaultApiType<T> = {
    success: true,
    message: T
} | {
    success: false,
    message: string
}

//response from login api

export type loginReturnMessageType = {
    name: string, 
    email: string, 
    address: string, 
    phoneNo: string, 
    role: 'admin' | 'user'
}

export type loginReturnType = {
    success: boolean
    message: loginReturnMessageType | string
}