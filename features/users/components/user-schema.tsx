import { z } from "zod";

// Validation schema with Zod
export const formSchema = z.object({
    // Name must be a non-empty string
    name: z.string().min(1, "Name can't be empty"),
    
    // Email must be a valid email format
    email: z.string().email("Invalid email format"),
    
    // Phone is optional and can be a string
    phone: z.string().optional(),
    
    // Password must be at least 8 characters long
    password: z.string().min(8, "Password must contain at least 8 character(s)"),
    
    // Password confirmation must not be empty
    passwordConfirm: z.string().min(1, "PasswordConfirm can't be empty"),
    
    // Optional boolean fields for LDAP and deletion status
    ldap: z.boolean().optional(),
    deleted: z.boolean().optional(),
    
    // Unit ID can be a nullable string or optional
    unitId: z.string().nullable().optional(),
    
    // Role ID must be an array of strings and is optional
    roleId: z.array(z.string()).optional(),
}).refine(data => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"], // Indicate where to show the error
});