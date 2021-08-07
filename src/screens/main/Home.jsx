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

const Home = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState();
  const [filteredUsers, setFilteredUsers] = useState();
  const [requestTracker, setRequestTracker] = useState({});

  const onRequest = async (id) => {
    setRequestTracker((prevState) => ({
      ...prevState,
      [id]: true,
    }));

    setTimeout(() => {
      setRequestTracker((prevState) => ({
        ...prevState,
        [id]: false,
      }));
    }, 2000);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabaseClient
        .from("profiles")
        .select("id, username")
        .order("username", { ascending: true });
      setUsers(data);
      setFilteredUsers(data);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!users) return;

    let isActiveSearch = true;

    if (search) {
      const searchUsername = async () => {
        const { data } = await supabaseClient.rpc("fuzzy_search", {
          search,
          threshold: 0.1,
        });

        if (isActiveSearch) {
          if (search) {
            setFilteredUsers(data);
          } else {
            setFilteredUsers(users);
          }
        }
      };
      searchUsername();
    } else {
      setFilteredUsers(users);
    }

    return () => {
      isActiveSearch = false;
    };
  }, [search, users]);

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
      <Flex h="100%" mt="15%">
        <Center>
          <Alert status="info" w="95%" mb={2}>
            <Alert.Icon />
            <Alert.Title flexShrink={1}>
              Click on a user's Sup button to request media.
            </Alert.Title>
          </Alert>
        </Center>
        <Center height="10%" width="100%">
          <VStack alignItems="center" width="100%" space={2}>
            <Input
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search user"
              bg="#fff"
              width="90%"
              borderRadius={4}
              py={3}
              px={1}
              fontSize={14}
              _web={{
                _focus: {
                  borderColor: "muted.300",
                  style: { boxShadow: "none" },
                },
              }}
            />
          </VStack>
        </Center>
        <Center flex={1}>
          {filteredUsers ? (
            <ScrollView px={3} width="100%" keyboardShouldPersistTaps="handled">
              <View width="100%" paddingBottom="30%">
                <VStack alignItems="center" flex={1}>
                  {filteredUsers.map(({ id, username }) => (
                    <Center
                      key={id}
                      width="95%"
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
                            onPress={() => onRequest(id)}
                            isLoading={requestTracker[id]}
                          >
                            Sup
                          </Button>
                        </Box>
                      </Flex>
                    </Center>
                  ))}
                </VStack>
              </View>
            </ScrollView>
          ) : null}
        </Center>
      </Flex>
    </KeyboardAvoidingView>
  );
};

export default Home;
