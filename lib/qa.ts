import axios from 'axios';
import Cookies from 'js-cookie';

export const qa = async (id: string , type: string = 'full') => {
  try {
    // Récupérer le token d'accès
    const accessToken = Cookies.get('access_token');

    // Vérifier si le token d'accès est présent
    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    // Fetch data from the API
    const { data } = await axios.post('/api/requests/quality-assurance', { id, type , accessToken });
 
    // Vérification des données
    return data || {};
  } catch (error) {
    console.error('[QA]', error);
    throw error; // Optionnel : relancer l'erreur pour la gérer en amont
  }
};



export const unicity = async (input:any) => {
  try {
    // Récupérer le token d'accès
    const accessToken = Cookies.get('access_token');

    // Vérifier si le token d'accès est présent
    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    // Fetch data from the API
    const { data } = await axios.post('/api/requests/unicity-assurance', { input , accessToken });
 
    // Vérification des données
    return data || {};
  } catch (error) {
    console.error('[UA]', error);
    throw error; // Optionnel : relancer l'erreur pour la gérer en amont
  }
};


export const unicityById = async (id: string) => {
  try {
    // Récupérer le token d'accès
    const accessToken = Cookies.get('access_token');

    // Vérifier si le token d'accès est présent
    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    // Fetch data from the API
    const { data } = await axios.post(`/api/requests/unicity-assurance/${id}`, { accessToken });
 
    // Vérification des données
    return data || {};
  } catch (error) {
    console.error('[UA-ID]', error);
    throw error; // Optionnel : relancer l'erreur pour la gérer en amont
  }
};