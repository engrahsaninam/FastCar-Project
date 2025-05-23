import { register } from "module";

export const apiRoutes = {
    auth: {
        login: "/auth/login",
        register: "/auth/register",
        resetPassword:"/auth/reset-password",
        forgotPassword:"/auth/forgot-password",
        signUpgoogle:"/auth/google-signup",
        currentuser:'/users/me'
    },
}