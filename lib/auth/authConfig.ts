// import NextAuth from "next-auth";
// import GitHub from "next-auth/providers/github"
// import Google from "next-auth/providers/google";
// import Nodemailer from "next-auth/providers/nodemailer";
// import Credentials from "next-auth/providers/credentials"
// import { pool } from "@/lib/postgres";
// import PostgresAdapter from "@auth/pg-adapter";
// import { setName } from "@/lib/auth/setNameServerAction";
// import { clearStaleTokens } from "./clearStaleTokensServerAction";
// import { URI_LOGIN } from "@/config/route.config";

// TODO : 
export const auth = () => "";
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   trustHost: true,
//   adapter: PostgresAdapter(pool),
//   secret: process.env.AUTH_SECRET, // Used to sign the session cookie so AuthJS can verify the session
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days in seconds (this value is also the default)
//   },
//   pages: {
//     signIn: URI_LOGIN,
//     verifyRequest: "/auth/auth-success",
//     error: "/auth/auth-error",
//   },
//   providers: [
//     Google({
//       clientId: process.env.AUTH_GOOGLE_ID,
//       clientSecret: process.env.AUTH_GOOGLE_SECRET,
//       allowDangerousEmailAccountLinking: true, // Allow automatic linking of users table to accounts table in database - not dangerous when used with OAuth providers that already perform email verification (like Google)
//     }),
   
//     Nodemailer({
//       server: {
//         host: process.env.EMAIL_SERVER_HOST,
//         port: parseInt(process.env.EMAIL_SERVER_PORT!, 10),
//         auth: {
//           user: process.env.EMAIL_SERVER_USER,
//           pass: process.env.EMAIL_SERVER_PASSWORD,
//         },
//       },
//       from: process.env.EMAIL_FROM,
//     }),
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       credentials: {
//         email: {},
//         password: {},
//       },
//       authorize: async (credentials) => {
//         let user = null
 
//         // // logic to salt and hash password
//         // const pwHash = saltAndHashPassword(credentials.password)
 
//         // // logic to verify if the user exists
//         // user = await getUserFromDb(credentials.email, pwHash)
 
//         if (!user) {
//           // No user found, so this is their first attempt to login
//           // meaning this is also the place you could do registration
//           throw new Error("User not found.")
//         }
 
//         // return user object with their profile data
//         return user
//       },
//     }),
    
//   ],
//   callbacks: {
//     async jwt({ token, user, session, trigger }) {
//       if (trigger === "update" && session?.name !== token.name) {
//         token.name = session.name;

//         try {
//           // await setName(token.name);
//         } catch (error) {
//           console.error("Failed to set user name:", error);
//         }
//       }

//       if (user) {
//         await clearStaleTokens(); // Clear up any stale verification tokens from the database after a successful sign in
//         return {
//           ...token,
//           id: user.id,
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       console.log("session callback", { session, token });
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: token.id as string,
//         },
//       };
//     },
//   },
// });
