import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Sups from "./SupsStack";
import SupBacks from "./SupBacksStack";
import Home from "../screens/main/Home";
import Auth from "./AuthStack";
import Username from "./UsernameStack";

const Tab = createBottomTabNavigator();

export default () => {
  let screen;
  const auth = useContext(AuthContext);
  const { user, userProfile } = auth;

  if (!user) {
    screen = <Auth />;
  } else if (user && Object.keys(user).length) {
    if (userProfile) {
      screen = (
        <Tab.Navigator>
          <Tab.Screen
            name="Users"
            component={Home}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="users" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Sups"
            component={Sups}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="email-send-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
          <Tab.Screen
            name="SupBacks"
            component={SupBacks}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons
                  name="email-receive-outline"
                  color={color}
                  size={size}
                />
              ),
            }}
          />
        </Tab.Navigator>
      );
    } else {
      screen = <Username />;
    }
  }

  return <NavigationContainer>{screen}</NavigationContainer>;
};
