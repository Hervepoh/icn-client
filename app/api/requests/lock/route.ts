import { NextResponse, NextRequest } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

export async function GET(request: NextRequest) {
    try {
        const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests/lock`);
    
        if (!response.ok) {
            return NextResponse.json({ ...response }, { status: response.status });
        }

        const result = await response.json();
        return NextResponse.json({ ...result });
    } catch (error) {
        console.log("[LOCK-GET]", error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}


export async function POST(request: NextRequest) {

    try {
        const data = await request.json();
        const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests/lock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': data.accessToken
            },
            body: JSON.stringify(data.data),
            credentials: 'include'
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json({ ...result }, { status: response.status });
        }

        return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }
}
// REMOVE LOCK
export async function DELETE(request: NextRequest) {

    try {
        const data = await request.json();
        const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests/lock`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': data.accessToken
            },
            body: JSON.stringify(data.data),
            credentials: 'include'
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json({ ...result }, { status: response.status });
        }

        return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }
}


const ckeckConfig = () => {
    if (!NEXT_PUBLIC_SERVER_URI) {
        return NextResponse.json(
            { error: 'Server URI is not defined' },
            { status: 500 }
        );
    }
}
