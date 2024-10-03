"use client"


export const WelcomeMsg = () => {
    // const { user , isLoaded } = useUser();
    return (
        <div className="space-y-0 mt-2">
            <h2 className="text-2xl text-center md:text-4xl md:text-left text-white font-medium ">
                Welcome Back  
                {/* { isLoaded ? ', ': " " }{ user?.firstName } 👋 */}
            </h2>
            <p className="text-sm lg:text-base dark:text-[#0a0e13] text-blue-300 ">
                This is your Financial Overview Report
            </p>
        </div>
    );
}