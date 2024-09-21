import React from "react";
import axios from 'axios';
import Cookies from "js-cookie";
import { useQuery } from '@tanstack/react-query';
import { redirect } from "next/navigation";
import { NEXT_PUBLIC_SERVER_URI } from "@/secret";

interface ProtectedProps{
    children: React.ReactNode;
}

// Fonction pour obtenir le token
const getToken = () => {
    return Cookies.get('access_token'); // Remplacez par le nom de votre cookie
  };

  // Fonction pour récupérer les données utilisateur
const fetchUserData = async () => {
    const token = getToken();
    
    if (!token) {
      return null; // Gérer le cas où le token n'est pas défini
    }
  
    const response = await axios.get(`${NEXT_PUBLIC_SERVER_URI}/auth/me`, {
      headers: {
        'Authorization': `${token}`,
      },
    });
  
    return response.data;
  };
  

export default function UserProtected({children}: ProtectedProps){

    const token = getToken();
    let isAuthenticated =false;
    const { data, error, isLoading } = useQuery({
        enabled: !!token,   // Fetch only if we have the id
        queryKey: ["user", { token }],
        queryFn: async () => {

          try {
            const response =await axios.get(`${NEXT_PUBLIC_SERVER_URI}/auth/me`, {
                headers: {
                  'Authorization': `${token}`,
                },
              });
             if(response.data?.user) {
                isAuthenticated = true
             }
          } catch (error) {
            if (axios.isAxiosError(error)) {
              throw error;
            } else {
              throw new Error('Une erreur inconnue s\'est produite');
            }
          }
        },
      });

    return isAuthenticated ? children : redirect("/login");
}