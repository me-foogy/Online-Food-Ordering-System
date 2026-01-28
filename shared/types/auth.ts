export type JWTPayload = {
    id: number
    name: string
    email: string
    role: 'admin'|'user'
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