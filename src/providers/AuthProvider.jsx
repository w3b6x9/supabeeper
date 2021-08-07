import React, { createContext, useState, useEffect } from "react";
import supabaseClient from "../supabaseClient";

const AuthContext = createContext({});

const AuthProvider = (props) => {
  const [user, setUser] = useState();
  const [session, setSession] = useState();

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

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
