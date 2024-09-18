import { PiPassword } from "react-icons/pi";
import * as z from "zod";

export const LoginMagicSchema = z.object({
  email: z
    .string() //{ invalid_type_error: "Must be a string"}
    .min(1, { message: "Email is required" }) // Makes sure the email field isn't empty
    .email({ message: "Email is invalid" }), // Checks if it's a valid email
});


export const LoginSchema = z.object({
  email: z
    .string() //{ invalid_type_error: "Must be a string"}
    .min(1, { message: "Email is required" }) // Makes sure the email field isn't empty
    .email({ message: "Email is invalid" }), // Checks if it's a valid email
  password: z.string().min(1, { message: "Password is required" }),
});


export const RegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string() //{ invalid_type_error: "Must be a string"}
    .min(1, { message: "Email is required" }) // Makes sure the email field isn't empty
    .email({ message: "Email is invalid" }), // Checks if it's a valid email
  password: z.string().min(6, {
    message: "Minimun 6 characters required",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword,{message:"Confirm Password does not match",path:["confirmPassword"]});


export const RejectSchema = z.object({
  reason_for_refusal: z.string().min(1, { message: "Reason is required" }),
});
