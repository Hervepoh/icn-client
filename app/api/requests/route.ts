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

    // GET
    if (data.enpoint == '/list') {

        try {
            const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests${data.filter}`, {
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


    if (data.enpoint == '/create-bulk') {

        try {
            const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests/bulk`, {
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

    // if (data.enpoint == '/get-status') {
    //     try {
    //         const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/status${data.search}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }

    // if (data.enpoint == '/request') {
    //     try {
    //         const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests/${data.id}`, {
    //             method: 'GET',
    //             headers: {
    //                 //'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }

    // if (data.enpoint == '/request-details') {
    //     try {
    //         const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests-details/${data.id}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }

    // if (data.enpoint == '/create-request-detail') {

    //     try {
    //         const response = await fetch(`$${NEXT_PUBLIC_SERVER_URI}/requests-details/bulk/${data.id}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             body: data.data,
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }

    // // PUT
    // if (data.enpoint == '/put') {
    //     try {
    //         const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/payModes/${data.id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             body: data.data,
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }

    // if (data.enpoint == '/edit-request') {
    //     try {
    //         const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests/${data.id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             body: data.payload,
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }

    // if (data.enpoint == '/save') {
    //     try {
    //         const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests-details/bulk/${data.id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             body: data.json,
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }

    // // DELETE
    // if (data.enpoint == '/delete') {
    //     try {
    //         const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests/${data.id}}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }

    // if (data.enpoint == '/delete-request-detail') {
    //     try {
    //         const response = await fetch(`${NEXT_PUBLIC_SERVER_URI}/requests-details/${data.requestId}`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': data.accessToken
    //             },
    //             credentials: 'include'
    //         });

    //         const result = await response.json();

    //         if (!response.ok) {
    //             return NextResponse.json({ ...result }, { status: response.status });
    //         }

    //         return NextResponse.json({ ...result });
    //     } catch (error) {
    //         return NextResponse.json({ error: 'Failed to connect to the API' }, { status: 500 });
    //     }
    // }


    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}