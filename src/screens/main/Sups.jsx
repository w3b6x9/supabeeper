import React, { useState, useEffect } from "react";
import { View, KeyboardAvoidingView } from "react-native";
import {
  Box,
  Text,
  Button,
  Flex,
  Center,
  Input,
  VStack,
  ScrollView,
  Alert,
} from "native-base";
import supabaseClient from "../../supabaseClient";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const isFocused = useIsFocused();
  const currentUser = supabaseClient.auth.user();

  const [requests, setRequests] = useState();

  useEffect(() => {
    const fetchRequests = async () => {
      const { data } = await supabaseClient.rpc("fetch_requests", {
        requestee_id: currentUser.id,
      });
      setRequests(data);
    };

    isFocused && fetchRequests();
  }, [isFocused]);

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
      <Flex h="100%" mt="1">
        <Center flex={1}>
          <ScrollView px={3} width="100%" keyboardShouldPersistTaps="handled">
            <View width="100%" paddingBottom={5}>
              <VStack alignItems="center" flex={1}>
                {requests &&
                  requests.map(({ username, request_id, object_id }) => (
                    <Center
                      key={request_id}
                      width="100%"
                      rounded="lg"
                      p={3}
                      bg="white"
                      my={1}
                      mb={1}
                    >
                      <Flex
                        w="95%"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text>{username}</Text>
                        <Box>
                          <Button
                            size="sm"
                            onPress={() =>
                              navigation.navigate("SupsCamera", {
                                requestId: request_id,
                              })
                            }
                            isDisabled={!!object_id}
                          >
                            <Ionicons
                              name="ios-camera-outline"
                              size={20}
                              color="white"
                            />
                          </Button>
                        </Box>
                      </Flex>
                    </Center>
                  ))}
              </VStack>
            </View>
          </ScrollView>
        </Center>
      </Flex>
    </KeyboardAvoidingView>
  );
};

export default Home;
