// import { IAxiosError } from "../axiosError";
// import { IAxiosError } from "axios";
import { IAxiosError } from "./axiosError";
import { useMutation, useQuery } from "@tanstack/react-query";
import { currentuser, forgotPassword, login, resetPassword, signup, signupgoogle, verifyEmail } from "./authService";
import { register } from "module";

type LoginPayload = {
    email: string;
    password: string;
};
type RegisterPayload = {
    email: string;
    username: string,
    password: string,
    confirm_password: string
}
type ForgotPassword = {
    email: string
}
type ResetPassword = {
    password: string,
    token: string
}
type GoogleSignUp={
    id_token:string
}
type VerifyEmail = {
    otp: string,
    email: string
}
export const useLogin = () => {
    return useMutation<any, IAxiosError, LoginPayload>({
        mutationFn: (payload) => login(payload.email, payload.password),
    });
};
export const useRegister = () => {
    return useMutation<any, IAxiosError, RegisterPayload>(
        {
            mutationFn: (payload) => signup(payload.username, payload.email, payload.password, payload.confirm_password
            )
        }
    )
}
export const useForgotPassword = () => {
    return useMutation<any, IAxiosError, ForgotPassword>(
        {
            mutationFn: (payload) => forgotPassword(payload.email)
        }
    )
}
export const useResetPassword = () => {
    return useMutation<any, IAxiosError, ResetPassword>(
        {
            mutationFn: (payload) => resetPassword(payload.password, payload.token)
        }
    )
}

export const useGoogleSignUp= () => {
    return useMutation<any, IAxiosError, GoogleSignUp>(
        {
            mutationFn: (payload) => signupgoogle(payload.id_token)
        }
    )
}

export const useCurrentUser=()=>{
    return useQuery({
        queryKey: ["current_user_data"],
        queryFn: currentuser,
        
    });
}
export const useVerifyEmail = () => {
    return useMutation<any, IAxiosError, VerifyEmail>(
        {
            mutationFn: (payload) => verifyEmail(payload.otp, payload.email)
        }
    )
}