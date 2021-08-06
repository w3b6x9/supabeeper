import React, { useState } from "react";
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
import supabaseClient from "../../supabaseClient";

const OTPConfirm = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpToken, setOTPToken] = useState("");

  const confirm = async () => {
    setError("");
    setIsLoading(true);

    const { session, error } = await supabaseClient.auth.verifyOTP({
      phone: route.params.fullPhoneNumber,
      token: otpToken,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    }

    // Hack b/c of bug: https://github.com/supabase/gotrue-js/issues/113
    const { access_token, expires_in } = session
    const { user } = await supabaseClient.auth.api.getUser(access_token)
    const expires_at = Math.round(Date.now() / 1000) + expires_in
    const newSession = { ...session, user, expires_at }
    supabaseClient.auth._saveSession(newSession)
    supabaseClient.auth._notifyAllSubscribers('SIGNED_IN')
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
            <Heading size="lg">Enter OTP Code</Heading>

            <VStack space={4} mt={5}>
              <FormControl>
                <FormControl.Label _text={{ fontSize: "sm", fontWeight: 600 }}>
                  OTP code
                </FormControl.Label>
                <Input
                  value={otpToken}
                  onChangeText={setOTPToken}
                  maxLength={6}
                  textContentType="oneTimeCode"
                  keyboardType="numeric"
                  width="70%"
                />
              </FormControl>

              <Button onPress={confirm} isDisabled={isLoading || !otpToken}>
                Confirm
              </Button>

              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <Text size="md" fontWeight="bold">
                  Go back
                </Text>
              </TouchableOpacity>
            </VStack>
          </Box>
        </Center>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default OTPConfirm;
