"use client";

import { LoginForm } from "../_components/login-form";


export const SignInPage: React.FC = () => {

  return (
    <>
      <div className="text-center space-y-4 pt-16">
        <h1 className="font-bold text-3xl text-[#2E2A47] dark:text-lime-700">Welcome Back !</h1>
        <p className="text-base text-[#7E8CA0]">
          Log in or Create account to get back to your dashboard !
        </p>
      </div>
      <div className="flex items-center justify-center mt-8 md:w-[100%] lg:max-w-[400px]">
        <LoginForm />
      </div>
    </>
  );
};
