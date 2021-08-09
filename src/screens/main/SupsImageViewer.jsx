import React, { useState, useEffect } from "react";
import { TouchableOpacity, Image } from "react-native";
import { View } from "native-base";
import { Feather } from "@expo/vector-icons";
import supabaseClient from "../../supabaseClient";

const SupsImageViewer = ({ route, navigation }) => {
  const [blob, setBlob] = useState();

  useEffect(() => {
    let timeoutId;
    const fetchImage = async () => {
      const { signedURL } = await supabaseClient.storage
        .from("media")
        .createSignedUrl(route.params.objectName, 10);

      setBlob(signedURL);
    };

    fetchImage().then(() => {
      timeoutId = setTimeout(() => {
        navigation.goBack();
      }, 10000);
    });

    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
  }, []);

  return (
    <View flex={1}>
      <Image flex={1} source={{ uri: blob }} />
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 10,
          left: 10,
        }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Feather name="arrow-left-circle" size={40} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SupsImageViewer;
