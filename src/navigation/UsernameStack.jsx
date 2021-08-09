import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Username from "../screens/main/CreateUsername";

const UsernameStack = createStackNavigator();
const UsernameNavigator = () => {
  return (
    <UsernameStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <UsernameStack.Screen name="Username" component={Username} />
    </UsernameStack.Navigator>
  );
};

export default UsernameNavigator;
