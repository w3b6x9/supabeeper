import React, { createContext, useState, useEffect } from "react";
import supabaseClient from "../supabaseClient";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [user, setUser] = useState();
  const [session, setSession] = useState();
  const [userProfile, setUserProfile] = useState(null);

  const onUserProfileChange = (profile) => {
    setUserProfile(profile);
  };

  useEffect(() => {
    setSession(supabaseClient.auth.session());
    setUser(supabaseClient.auth.user());
    const { data: authListener } = supabaseClient.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user);
      }
    );
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const { data } = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", user.id);
      return data;
    };

    fetchProfile().then((data) => {
      setUserProfile(data[0]);
    });
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        onUserProfileChange,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
