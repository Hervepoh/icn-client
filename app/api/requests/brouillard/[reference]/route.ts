import { NextResponse } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import axios from 'axios';

export async function GET(request: Request, { params }: { params: { reference: string } }) {
    const { reference } = params;

    if (!reference) {
        return NextResponse.json({ error: 'Reference is required' }, { status: 400 });
    }

    try {
        // Faire la requête à l'API externe
        const response = await axios.get(`${NEXT_PUBLIC_SERVER_URI}/icn/brouillard/${reference}`, {
            responseType: 'arraybuffer', // Assurer que nous obtenons les données binaires
        });

        // Extraire le nom de fichier des en-têtes de réponse
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'BROUILLARD.xlsx'; // Nom de fichier par défaut

        if (contentDisposition) {
            const matches = contentDisposition.match(/filename="?([^"]+)"?/);
            if (matches && matches[1]) {
                filename = matches[1]; // Prendre seulement la partie sans guillemets
            }
        }

        // Créer un Blob à partir des données
        const fileBlob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        // Retourner le fichier en tant que réponse binaire
        return new NextResponse(fileBlob, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error: any) {
        console.log("[BROUILLARD-GET]", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}