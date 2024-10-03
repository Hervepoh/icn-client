import { NextResponse, NextRequest } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import axios from 'axios';

export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!NEXT_PUBLIC_SERVER_URI) {
        return NextResponse.json(
            { error: 'Server URI is not defined' },
            { status: 500 }
        );
    }

    try {
        let config = {
            method: 'delete',
            url: `${NEXT_PUBLIC_SERVER_URI}/requests-details/${data.id}`,
            headers: {
                'Authorization': data.accessToken
            },
            data: ""
        };
        const resultData = await axios.request(config);
   
        return NextResponse.json({});
        // const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests-details/${data.id}`, {
        //     method: 'DELETE',
        //     headers: {
        //         'Authorization': data.accessToken
        //     },
        //     body: "",
        //     redirect: "follow"
        // });

        // if (!response.ok) {
        //     return NextResponse.json({ ...response }, { status: response.status });
        // }

        //return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }
}

