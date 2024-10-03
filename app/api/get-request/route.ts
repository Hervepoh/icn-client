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
            method: 'get',
            maxBodyLength: Infinity,
            url: `${NEXT_PUBLIC_SERVER_URI}/requests/${data.id}`,
            headers: {
                'Authorization': data.accessToken,
                'Content-Type': 'application/json',
            },
            data: data
        };


        const resultData = await axios.request(config);

        return NextResponse.json(resultData.data);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }



}