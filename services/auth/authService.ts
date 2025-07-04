import { Axe } from "lucide-react"
import { apiRoutes } from "../apiRoutes"
import axios from "axios"

import axiosInstance from "../axiosInstance"
export const login = async (email: string, password: string) => {
    const { data } = await axiosInstance.post(apiRoutes.auth.login, { email, password })
    return data
}

export const signup = async (username: string, email: string, password: string, confirm_password: string) => {
    const { data } = await axiosInstance.post(apiRoutes.auth.register,
        {
            username,
            email,
            password,
            confirm_password
        }

    )

    console.log("data", data)
    return data
}
export const forgotPassword = async (email: string) => {
    const { data } = await axiosInstance.post(apiRoutes.auth.forgotPassword, {
        email
    })
    return data
}
export const resetPassword = async (password: string, token: string) => {
    const { data } = await axiosInstance.post(apiRoutes.auth.resetPassword, {
        password,
        token
    })
    return data
}

export const signupgoogle = async (id_token: string) => {
    const { data } = await axiosInstance.post(apiRoutes.auth.signUpgoogle, {
        id_token
    })
    return data
}

export const currentuser = async () => {
    const { data } = await axiosInstance.get(apiRoutes.auth.currentuser)
    console.log("user in api",data)
    return data
}
export const verifyEmail = async (otp: string, email: string) => {
    const { data } = await axiosInstance.post(apiRoutes.auth.verifyEmail, {
        otp,
        email
    })
    return data
}
