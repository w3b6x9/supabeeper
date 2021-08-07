import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
import Loading from "../screens/utils/Loading";
import Auth from "./AuthStack";
import Main from "./MainStack";

export default () => {
  let screen;
  const auth = useContext(AuthContext);
  const user = auth.user;

  if (user === undefined) {
    screen = <Loading />;
  } else if (user === null) {
    screen = <Auth />;
  } else if (user && Object.keys(user).length) {
    screen = <Main />;
  }

  return <NavigationContainer>{screen}</NavigationContainer>;
};
