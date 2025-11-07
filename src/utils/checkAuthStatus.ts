export async function checkAuthStatus(): Promise<boolean> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/loggedIn`, {
            method: 'GET',
            credentials: 'include', // include cookies (access + refresh tokens)
        });

        if (!res.ok) return false;

        const data = await res.json();
        return data.loggedIn === true;
    } catch (error) {
        console.error('Error checking auth status:', error);
        return false;
    }
}