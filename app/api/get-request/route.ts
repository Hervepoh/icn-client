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
    console.log('ok')
    console.log("data",data)
    try {
        console.log(data.id)
        console.log(data.accessToken)
        return NextResponse.json({ }, { status: 200 });
        // const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests/${}`, {
        //     method: 'GET',
        //     headers: {
        //         'Authorization': data.accessToken
        //     },
        //     body:"",
        //     credentials: 'include'
        // });
        //  console.log(response);
        
        // const result = await response.json();

        // if (!response.ok) {
        //     return NextResponse.json({ ...result }, { status: response.status });
        // }

        //return NextResponse.json({ ...result });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    }
}

