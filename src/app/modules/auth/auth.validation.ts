import { z } from "zod"

const LogInValidationSchema = z.object({
    body: z.object({
        id: z.string({required_error:"Id is required"}),
        password:z.string({required_error:"Password is required"})
    })
})
const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword:z.string({required_error:"Old Password is required"}),
        newPassword:z.string({required_error:"Password is required"})
    })
})

export const AuthValidation = {
    LogInValidationSchema,
    changePasswordValidationSchema
}