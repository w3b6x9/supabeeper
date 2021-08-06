import React, { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { NavigationContainer } from "@react-navigation/native";
import Loading from "../screens/utils/Loading";
import Auth from "./AuthStack";

export default () => {
  const auth = useContext(AuthContext);
  const user = auth.user;

  return (
    <NavigationContainer>
      {user === null && <Loading />}
      {user === undefined && <Auth />}
      {/* {user && <Loading />} */}
    </NavigationContainer>
  );
};
