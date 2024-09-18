"use client";
import * as z from "zod";
import React, { useEffect, useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { RegisterSchema } from "@/schemas";
import { FormError } from "./form-message-error";
import { FormSuccess } from "./form-message-success";
import { CardWrapper } from "./card-wrapper";
import { LuLoader2 } from "react-icons/lu";
import { URI_LOGIN } from "@/config/route.config";

type Props = {
  setRoute: (route: string) => void;
};

export const RegisterForm = ({ setRoute }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  // const [register,{data,isError,isSuccess}] = useRegisterMutation(); 

  // useEffect(() => {
  //   if(isSuccess){
  //      const message = data?.message || "Registration successful";
  //      // toast.success(message);
  //      setSuccess(message);
  //      setRoute("verification");
  //   }
  //   if(isError){
  //   //  if("data" in error){
  //   //    const errorData = error as any;
  //   //    toast.error(errorData.data.message);
  //   //  }
  //   setError("Something went wrong");
  //   }
  //  // eslint-disable-next-line react-hooks/exhaustive-deps
  //  }, [isSuccess,isError]);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);

    startTransition(() => {
      setError("");
      setSuccess("");
      // or you can use api route
      // axios.post('/api/login', values).then((response) => { setPost(response.data); });
      // fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => response.json()).then(json => console.log(json));

      // using server action
      // register(values).then((response) => {
      //   setError(response.error);
      //   setSuccess(response.success);
      // });
      // register(values);

    });
  };

  return (
    <CardWrapper
      headerLabel="You need to do a RFA (Request for access)"
      backButtonLabel="Already have an account ? Please login"
      backButtonHref={ URI_LOGIN }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                  {/* <FormDescription>This is your public display name.</FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Notify adminstrator for RFA"
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
