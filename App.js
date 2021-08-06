import React from "react";
import { StatusBar } from "expo-status-bar";
import { NativeBaseProvider } from "native-base";
import { AuthProvider } from "./src/providers/AuthProvider";
import Navigation from "./src/navigation";

const App = () => {
  return (
    <NativeBaseProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
      <StatusBar />
    </NativeBaseProvider>
  );
};

export default App;
