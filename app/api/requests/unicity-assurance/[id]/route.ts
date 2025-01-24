import { NextResponse, NextRequest } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import axios from 'axios';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const data = await request.json();

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${NEXT_PUBLIC_SERVER_URI}/requests/unicity-assurance/${id}`,
            headers: {
                'Authorization': data.accessToken,
                'Content-Type': 'application/json',
            },
        };

        const resultData = await axios.request(config);

        return NextResponse.json(resultData.data);
    } catch (error) {
        console.log("[REQUESTS-UA-ID]", error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

