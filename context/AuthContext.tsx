import { supabase } from "@/lib/supabase";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
interface User{
    id:string;
    email:string;
}
interface AuthContextType {
    user : User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user:null,
    loading:true,
    signOut: async () => {}
});

export const AuthProvider = ({children}:{children:ReactNode})=>{
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const getUser = async() =>{
            const {data:{user}} = await supabase.auth.getUser();
            if(user){
                setUser({ id: user.id, email: user.email ?? '' });
            }
            setLoading(false);
        };
        getUser();

        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            setUser({ id: session.user.id, email: session.user.email ?? '' });
        } else {
            setUser(null);
        }
        });

        return () => subscription?.subscription.unsubscribe();
    },[]);

    const handleSignOut = async() =>{
        const {error} = await supabase.auth.signOut();
        if(error){
            console.error("Error During SignOut: ",error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading,signOut:handleSignOut }}>
        {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

