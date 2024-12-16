import { z } from "zod"
// Validation schema with Zod
export const formSchema = z.object({
    name: z.string().min(1, "Name can't be empty"),
    email: z.string().email(),
    password: z.string().min(6,"Password must contain at least 6 character(s)"),
    passwordConfirm: z.string().min(1,"PasswordConfirm can't be empty"),
    ldap: z.boolean().optional(),
    deleted: z.boolean().optional(),
    unitId: z.string().nullable().optional(),
    roleId: z.array(z.string()).optional(),
}).refine(data => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"], // Indicate where to show the error
});
