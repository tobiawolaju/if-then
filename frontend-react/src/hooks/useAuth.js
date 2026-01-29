import { useState, useEffect } from 'react';
import { auth, googleProvider } from './firebase-config';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setAccessToken(result.credential.accessToken);
            return result.user;
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const logout = () => signOut(auth);

    return { user, loading, accessToken, login, logout };
}
