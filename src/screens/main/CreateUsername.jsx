import React, { useState, useContext } from "react";
import { TouchableOpacity, KeyboardAvoidingView } from "react-native";
import {
  Heading,
  FormControl,
  Input,
  Center,
  Button,
  Box,
  VStack,
  Alert,
  Text,
} from "native-base";
import { AuthContext } from "../../providers/AuthProvider";
import supabaseClient from "../../supabaseClient";

const CreateUsername = ({ navigation }) => {
  const { onUserProfileChange } = useContext(AuthContext);
  const currentUser = supabaseClient.auth.user();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");

  const save = async () => {
    setError("");
    setIsLoading(true);

    const { data, error } = await supabaseClient
      .from("profiles")
      .insert([{ id: supabaseClient.auth.user().id, username }]);

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      onUserProfileChange(data[0]);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1 }}>
      <Center flex={1}>
        <Box w="95%" mx="auto">
          {error ? (
            <Alert status="error" w="100%" mb={2}>
              <Alert.Icon />
              <Alert.Title flexShrink={1}>{error}</Alert.Title>
            </Alert>
          ) : null}
        </Box>

        <Center height="60%" width="95%">
          <Box safeArea flex={1} p={2} w="100%" mx="auto">
            <Heading size="lg">Enter username</Heading>

            <VStack space={4} mt={5}>
              <FormControl>
                <Input
                  value={username}
                  onChangeText={setUsername}
                  maxLength={15}
                  autoCapitalize="none"
                />
              </FormControl>

              <Button
                onPress={save}
                isDisabled={isLoading || !username || !currentUser}
              >
                Save
              </Button>

              <TouchableOpacity
                onPress={() => {
                  supabaseClient.auth.signOut();
                }}
              >
                <Text size="md" fontWeight="bold">
                  Log out
                </Text>
              </TouchableOpacity>
            </VStack>
          </Box>
        </Center>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default CreateUsername;
