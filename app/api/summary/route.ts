import { NextResponse, NextRequest } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!NEXT_PUBLIC_SERVER_URI) {
        return NextResponse.json(
            { error: 'Server URI is not defined' },
            { status: 500 }
        );
    }
    try {
        const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/summary${data.filter}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': data.accessToken
            },
            credentials: 'include' 
        });

        if (!response.ok) {
            console.error('SUMMARY', await response.text());
            return NextResponse.json({ ...response }, { status: response.status });
        }

        const result = await response.json();

        return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }
}