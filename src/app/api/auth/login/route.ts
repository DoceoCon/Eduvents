import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Get admin credentials from environment variables
        const adminCredentialsJson = process.env.ADMIN_CREDENTIALS;

        if (!adminCredentialsJson) {
            return NextResponse.json({
                success: false,
                message: 'Server configuration error'
            }, { status: 500 });
        }

        // Parse the admin credentials JSON
        const adminCredentials: Array<{ email: string; password: string }> = JSON.parse(adminCredentialsJson);

        // Check if the provided credentials match any admin account
        const matchingAdmin = adminCredentials.find(
            admin => admin.email === email && admin.password === password
        );

        if (matchingAdmin) {
            return NextResponse.json({
                success: true,
                message: 'Login successful',
                user: { email: matchingAdmin.email, role: 'admin' }
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: 'Invalid email or password'
            }, { status: 401 });
        }
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({
            success: false,
            message: 'An error occurred during login'
        }, { status: 500 });
    }
}
