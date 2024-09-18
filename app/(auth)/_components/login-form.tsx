"use client";
import * as z from "zod";
import React, { useEffect, useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LuLoader2 } from "react-icons/lu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/schemas";
import { FormError } from "./form-message-error";
import { FormSuccess } from "./form-message-success";
import { CardWrapper } from "./card-wrapper";

import { URI_REGISTER } from "@/config/route.config";
import { useLoginMutation } from "@/lib/redux/features/auth/authApi";
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation";


type Props = {};

export const LoginForm = (props: Props) => {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const [successMessage, setSuccessMessage] = useState<string | undefined>("");
  const router = useRouter();

  const [login, { isSuccess, error }] = useLoginMutation();
  useEffect(() => {
    if (isSuccess) {
      toast.success("Login Successfully!");
      router.push("/");
    }
    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData.data.message);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, error]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);

    startTransition(async () => {
      setErrorMessage("");
      setSuccessMessage("");
      // or you can use api route
      // axios.post('/api/login', values).then((response) => { setPost(response.data); });
      // fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.json()).then(json => console.log(json));
     
      // using server action
      // login(values)
      // .then(data => { 
      //   console.log(data);
      //   setErrorMessage(data.error);
      //   setSuccess(data.success);
      //  });

      await login(values);
    });
  };

  return (
    <CardWrapper
      headerLabel=""
      backButtonLabel="Don't have an account ?"
      backButtonHref={ URI_REGISTER }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method="POST" className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe@genius.com"
                      disabled={isPending}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="*********"
                      disabled={isPending}
                    />
                  </FormControl>
                  {/* <FormDescription>Enter your password.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={errorMessage} />
          <FormSuccess message={successMessage} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Login"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
