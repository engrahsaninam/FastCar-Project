import { AxiosError, AxiosResponse } from "axios"

interface Response {
    message: string
    status: number
    success: boolean
}
export interface IAxiosError extends AxiosError {
    response?: AxiosResponse<Response>
}