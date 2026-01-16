import { auth } from "@/lib/firebase";
import { supabase } from "@/lib/supabase";
import { User, UserRole } from "@/types/database";
import { User as FirebaseUser, onAuthStateChanged } from "firebase/auth";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

interface AuthContextType {
    firebaseUser: FirebaseUser | null;
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    role: UserRole | null;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch user data from Supabase
    const fetchUserData = async (firebaseUid: string) => {
        try {
            const { data, error } = await supabase
                .from("users")
                .select("*")
                .eq("firebase_uid", firebaseUid)
                .single();

            if (error) {
                console.error("Error fetching user data:", error);
                return null;
            }
            return data as User;
        } catch (error) {
            console.error("Error fetching user data:", error);
            return null;
        }
    };

    // Refresh user data
    const refreshUser = async () => {
        if (firebaseUser) {
            const userData = await fetchUserData(firebaseUser.uid);
            setUser(userData);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
            setFirebaseUser(fbUser);

            if (fbUser) {
                const userData = await fetchUserData(fbUser.uid);
                setUser(userData);
            } else {
                setUser(null);
            }

            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value: AuthContextType = {
        firebaseUser,
        user,
        isLoading,
        isAuthenticated: !!firebaseUser && !!user,
        role: user?.role || null,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
