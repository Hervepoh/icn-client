import { NextResponse, NextRequest } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

export async function POST(request: NextRequest) {

    try {
        console.log("USERS-CREATE")
        const data = await request.json();
        console.log("data",data);
        const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/users`, {
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
        console.log("[USERS-CREATE]", error);
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }
}