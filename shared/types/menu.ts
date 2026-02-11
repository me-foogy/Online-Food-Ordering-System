export interface menuType {
    id: number
    name: string,
    category: string,
    price: number,
    description: string
    image: string
    inStock: boolean
}

export interface menuResponse{
    success: boolean
    message: Required<menuType>[] | string
}

export interface Category {
    id: number
    name: string
}

export interface CategoriesResponse {
    success: boolean
    message: Category[] | string
}