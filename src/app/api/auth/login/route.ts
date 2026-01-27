import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // Basic validation for demonstration. 
        // In a real app, you would check against a database here.
        if (email === 'admin@gmail.com' && password === 'admin123') {
            return NextResponse.json({
                success: true,
                message: 'Login successful',
                user: { email: 'admin@gmail.com', role: 'admin' }
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
