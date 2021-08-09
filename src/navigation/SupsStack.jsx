import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Sups from "../screens/main/Sups";
import SupsCamera from "../screens/main/SupsCamera";

const SupsStack = createStackNavigator();
const SupsNavigator = () => {
  return (
    <SupsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SupsStack.Screen name="SupsScreen" component={Sups} />
      <SupsStack.Screen name="SupsCamera" component={SupsCamera} />
    </SupsStack.Navigator>
  );
};

export default SupsNavigator;
