import { NextResponse } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await request.json();

    if (!id) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    try {
        const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/users/${id}`, {
            method: 'PUT',
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
        console.log("[USERS-UPDATE]", error);
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }
}

