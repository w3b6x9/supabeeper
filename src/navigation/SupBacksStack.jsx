import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SupBacks from "../screens/main/SupBacks";
import SupsImageViewer from "../screens/main/SupsImageViewer";

const SupBacksStack = createStackNavigator();
const SupBacksNavigator = () => {
  return (
    <SupBacksStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SupBacksStack.Screen name="SupBacksScreen" component={SupBacks} />
      <SupBacksStack.Screen name="SupBacksView" component={SupsImageViewer} />
    </SupBacksStack.Navigator>
  );
};

export default SupBacksNavigator;
