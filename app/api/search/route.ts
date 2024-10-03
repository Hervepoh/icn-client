import { NextResponse, NextRequest } from 'next/server';
import { NEXT_PUBLIC_SERVER_URI } from '@/secret';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
    const data = await request.json();

    if (!NEXT_PUBLIC_SERVER_URI) {
        return NextResponse.json(
            { error: 'Server URI is not defined' },
            { status: 500 }
        );
    }

    if (data.enpoint == '/by-codecli') {
        try {
            const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/search-unpaid?by=customer&value=${data.values.value}&from=${format(data.values.from, "yyyy-MM-dd")}&to=${format(data.values.to, "yyyy-MM-dd")}`, {
                method: 'GET',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': data.accessToken
                },
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

    
    if (data.enpoint == '/search-by-contract') {
        try {
            const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/search-unpaid?by=contract&value=${data.values.value}&from=${format(data.values.from, "yyyy-MM-dd")}&to=${format(data.values.to, "yyyy-MM-dd")}`, {
                method: 'GET',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': data.accessToken
                },
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


    if (data.enpoint == '/search-by-regroup') {
        try {
            const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/search-unpaid?by=regroup&value=${data.values.value}&from=${format(data.values.from, "yyyy-MM-dd")}&to=${format(data.values.to, "yyyy-MM-dd")}`, {
                method: 'GET',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': data.accessToken
                },
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


    
    if (data.enpoint == '/search-by-invoice') {
        try {
            const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/search-unpaid?by=invoice&value=${data.values.value}`, {
                method: 'GET',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': data.accessToken
                },
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


    if (data.enpoint == '/search-paid-or-unpaid-by-invoice') {

        try {
            const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/search-paid-or-unpaid?by=invoice&value=${data.values.toString()}`, {
                method: 'GET',
                headers: {
                    // 'Content-Type': 'application/json',
                    'Authorization': data.accessToken
                },
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




    return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
}