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
import { Feather } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  const isFocused = useIsFocused();
  const currentUser = supabaseClient.auth.user();

  const [requestsFulfilled, setRequestsFulfilled] = useState();

  useEffect(() => {
    const fetchRequestsFulfilled = async () => {
      const { data } = await supabaseClient.rpc("fetch_requests_fulfilled", {
        requestor_id: currentUser.id,
      });
      setRequestsFulfilled(data);
    };

    isFocused && fetchRequestsFulfilled();
  }, [isFocused]);

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
      <Flex h="100%" mt="1">
        <Center flex={1}>
          <ScrollView px={3} width="100%" keyboardShouldPersistTaps="handled">
            <View width="100%" paddingBottom={5}>
              <VStack alignItems="center" flex={1}>
                {requestsFulfilled &&
                  requestsFulfilled.map(
                    ({
                      username,
                      request_id,
                      object_id,
                      object_name,
                      viewed_at,
                    }) => (
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
                              colorScheme="green"
                              size="sm"
                              onPress={async () => {
                                await supabaseClient.rpc("update_viewed_at", {
                                  request_id,
                                  object_id,
                                });
                                navigation.navigate("SupBacksView", {
                                  objectName: object_name,
                                });
                              }}
                              isDisabled={!!viewed_at}
                            >
                              <Feather name="play" size={20} color="white" />
                            </Button>
                          </Box>
                        </Flex>
                      </Center>
                    )
                  )}
              </VStack>
            </View>
          </ScrollView>
        </Center>
      </Flex>
    </KeyboardAvoidingView>
  );
};

export default Home;
