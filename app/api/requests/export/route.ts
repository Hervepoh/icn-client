import { NextResponse, NextRequest } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import axios from 'axios';

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${NEXT_PUBLIC_SERVER_URI}/requests/export/${data.id}`,
            headers: {
                'Authorization': data.accessToken,
                'Content-Type': 'application/json',
            },
            data: data
        };

        const resultData = await axios.request(config);

        return NextResponse.json(resultData.data);
    } catch (error) {
        console.log("[REQUESTS-EXPORT]", error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

