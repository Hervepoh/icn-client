import { NextResponse, NextRequest } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';

export async function POST(request: NextRequest) {
    const data = await request.json();

    // Check if the server URI is defined
    if (!NEXT_PUBLIC_SERVER_URI) {
        return NextResponse.json(
            { error: 'Server URI is not defined' }, { status: 500 }
        );
    }

    try {
        const page = data.page || 1; // Default to page 1 if not provided
        const limit = data.limit || 10; // Default to limit of 10 if not provided
        const filters = data.filters ? JSON.stringify(data.filters) : ''; // Convert filters to JSON string

        // Fetch the paginated audits from the server
        const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/audits?page=${page}&limit=${limit}&filters=${encodeURIComponent(filters)}`, {
            method: 'GET',
            headers: {
                // 'Content-Type': 'application/json', // Not needed for GET requests
                'Authorization': data.accessToken,
            },
            credentials: 'include',
        });

        const result = await response.json();

        // Handle non-OK responses
        if (!response.ok) {
            return NextResponse.json({ ...result }, { status: response.status });
        }

        // Return the result from the API
        return NextResponse.json({ ...result });
    } catch (error) {
        // Handle connection errors
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }

    // Return an error if the endpoint is not recognized
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 500 });
}