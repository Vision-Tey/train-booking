import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, userData: { fullName: string, phone: string }) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setIsAdmin(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
      setIsAdmin(data.is_admin || false);
    }
    
    setIsLoading(false);
  };

  const signUp = async (email: string, password: string, userData: { fullName: string, phone: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          phone: userData.phone,
        },
      },
    });

    if (!error && data.user) {
      // Create profile record
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: userData.fullName,
        phone: userData.phone,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.fullName}`,
        is_admin: false,
      });

      if (profileError) {
        console.error("Error creating profile:", profileError);
        return { error: profileError };
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const updateProfile = async (profileData: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") };

    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", user.id);

    if (!error) {
      setProfile({ ...profile, ...profileData } as Profile);
    }

    return { error };
  };

  const value = {
    user,
    profile,
    session,
    isLoading,
    isAdmin,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return user ? <>{children}</> : null;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }

  return isAdmin ? <>{children}</> : null;
}