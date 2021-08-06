import React, { useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import {
  Heading,
  FormControl,
  Input,
  Center,
  Button,
  Box,
  VStack,
  Alert,
} from "native-base";
import supabaseClient from "../../supabaseClient";

const Login = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const login = async () => {
    setError("");
    setIsLoading(true);

    const fullPhoneNumber = "+" + countryCode + phoneNumber;

    const { error } = await supabaseClient.auth.signIn({
      phone: fullPhoneNumber,
    });

    if (error) {
      setError(`${fullPhoneNumber} is not a valid phone number.`);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      navigation.navigate("Confirm", {
        fullPhoneNumber: fullPhoneNumber,
      });
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
            <Heading size="lg">Sign In</Heading>

            <VStack space={4} mt={5}>
              <FormControl>
                <FormControl.Label _text={{ fontSize: "sm", fontWeight: 600 }}>
                  Country code
                </FormControl.Label>
                <Input
                  value={countryCode}
                  onChangeText={setCountryCode}
                  maxLength={6}
                  keyboardType="phone-pad"
                  placeholder="65"
                  width="30%"
                />
              </FormControl>
              <FormControl>
                <FormControl.Label _text={{ fontSize: "sm", fontWeight: 600 }}>
                  Phone number
                </FormControl.Label>
                <Input
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  maxLength={14}
                  keyboardType="phone-pad"
                  placeholder="12345678"
                />
              </FormControl>

              <Button
                onPress={login}
                isDisabled={isLoading || !(countryCode && phoneNumber)}
              >
                Sign In
              </Button>
            </VStack>
          </Box>
        </Center>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default Login;
