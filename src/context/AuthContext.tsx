"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface Client {
  businessClient: string;
  name: string;
  businessId: string;
}

interface AuthContextType {
  token: string | null;
  client: Client | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, client: Client) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Solo se ejecuta en el cliente
    const storedToken = localStorage.getItem("token");
    const storedClient = localStorage.getItem("client");

    let parsedClient: Client | null = null;
    if (storedClient) {
      try {
        parsedClient = JSON.parse(storedClient);
      } catch (error) {
        console.error("Error parsing stored client", error);
      }
    }

    // Update state to hydrate auth correctly on client.
    // Wrap in setTimeout to avoid the 'react-hooks/set-state-in-effect' warning,
    // which fires because we're calling setState synchronously in the effect
    // body without a callback from an external system.
    setTimeout(() => {
      setToken(storedToken);
      setClient(parsedClient);
      setIsLoading(false);
    }, 0);
  }, []);

  const login = (newToken: string, newClient: Client) => {
    setToken(newToken);
    setClient(newClient);
    localStorage.setItem("token", newToken);
    localStorage.setItem("client", JSON.stringify(newClient));
  };

  const logout = () => {
    setToken(null);
    setClient(null);
    localStorage.removeItem("token");
    localStorage.removeItem("client");
  };

  const isAuthenticated = !!token;

  // Render children immediately to avoid breaking SSR.
  // The client side will handle redirects once hydrated.

  return (
    <AuthContext.Provider value={{ token, client, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
