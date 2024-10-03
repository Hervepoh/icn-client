"use client";

import { RegisterForm } from "../_components/register-form";


export const SignUpPage: React.FC = () => {

  return (
    <>
      <div className="text-center space-y-4 pt-16">
        <h1 className="font-bold text-3xl text-[#2E2A47] dark:text-lime-700">Welcome Back !</h1>
        <p className="text-base text-[#7E8CA0]">
          Create account to get back to your dashboard !
        </p>
      </div>
      <div className="flex items-center justify-center mt-8 md:w-[100%] lg:max-w-[400px]">
      <RegisterForm setRoute={function (route: string): void {
          throw new Error("Function not implemented.");
        } } />

      </div>
    </>
  );
};
