import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import supabaseClient from "../supabaseClient";

import Loading from "../screens/utils/Loading";
import Username from "../screens/main/CreateUsername";
import Home from "../screens/main/Home";

const MainStack = createStackNavigator();
const Main = () => {
  let screen;
  const currentUser = supabaseClient.auth.user();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      const { data } = await supabaseClient
        .from("profiles")
        .select()
        .eq("id", currentUser.id);
      return data;
    };

    fetchProfile().then((data) => {
      setUserProfile(data[0]);
    });
  }, [currentUser, userProfile]);

  if (userProfile === null) {
    screen = <MainStack.Screen name="Loading" component={Loading} />;
  } else if (userProfile === undefined) {
    screen = <MainStack.Screen name="Username" component={Username} />;
  } else {
    screen = <MainStack.Screen name="Home" component={Home} />;
  }

  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {screen}
    </MainStack.Navigator>
  );
};

export default Main;
