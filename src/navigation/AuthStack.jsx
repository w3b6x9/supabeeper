import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "../screens/auth/Login";
import Confirm from "../screens/auth/OTPConfirm";

const AuthStack = createStackNavigator();
const Auth = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Confirm" component={Confirm} />
    </AuthStack.Navigator>
  );
};

export default Auth;
