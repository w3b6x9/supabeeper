import React, { useState, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { Button, View, Text } from "native-base";
import { Feather, Ionicons } from "@expo/vector-icons";
import { decode } from "base64-arraybuffer";
import supabaseClient from "../../supabaseClient";

const SupCamera = ({ route, navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [imgBase64, setImgBase64] = useState();
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  } else if (hasPermission === false) {
    return <Text> No access to camera</Text>;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Camera
          ref={cameraRef}
          style={{ flex: 1, justifyContent: "space-between" }}
          type={type}
        >
          {isPreview ? (
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 10,
                left: 10,
              }}
              onPress={async () => {
                if (cameraRef) {
                  await cameraRef.current.resumePreview();
                  setIsPreview(false);
                }
              }}
            >
              <Feather name="x-circle" size={40} color="white" />
            </TouchableOpacity>
          ) : (
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
          )}

          {isPreview && (
            <TouchableOpacity
              style={{
                position: "absolute",
                right: 25,
                bottom: 45,
              }}
              onPress={async () => {
                const { requestId } = route.params;
                const { data } = await supabaseClient.storage
                  .from("media")
                  .upload(`images/${requestId}.png`, decode(imgBase64), {
                    contentType: "image/png",
                  });
                await supabaseClient.rpc("insert_request_medium", {
                  request_id: requestId,
                  object_key: data.Key,
                });
                navigation.goBack();
              }}
            >
              <Feather name="send" size={45} color="white" />
            </TouchableOpacity>
          )}

          {!isPreview && (
            <>
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 75,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  style={{
                    backgroundColor: "transparent",
                    borderWidth: 6,
                    borderColor: "white",
                    borderRadius: "50%",
                    height: 70,
                    width: 70,
                  }}
                  onPress={async () => {
                    if (cameraRef) {
                      const options = { quality: 0.7, base64: true };
                      const data = await cameraRef.current.takePictureAsync(
                        options
                      );
                      const source = data.base64;

                      if (source) {
                        await cameraRef.current.pausePreview();
                        setImgBase64(source);
                        setIsPreview(true);
                      }
                    }
                  }}
                />
              </View>

              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    setType(
                      type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                >
                  <Ionicons name="ios-camera-reverse" size={45} color="white" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </Camera>
      </View>
    );
  }
};

export default SupCamera;
