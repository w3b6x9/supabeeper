# Supabeeper

#### This project is a submission for the [Supabase Hackathon](https://supabase.io/blog/2021/07/30/1-the-supabase-hackathon).

### This mobile app project (iOS only) was inspired by the Yo app and Snapchat. Instead of taking a disappearing picture and sending it to others, you can request pictures from other users by pinging them and they'll send you a disappearing picture.

## Installation

1. Create a brand new Supabase project and run `supabase-schema.sql` (best to leave out the policies for now) in the Supabase Dashboard Sql Editor.

2. Add your Twilio credentials for sms authentication.

3. Install Expo CLI

```js
npm install --global expo-cli
```

4. After cloning this repo, add the following to `.env` file:

```shell
SUPABASE_URL=url
SUPABASE_KEY=key
```

5. Install deps

```js
yarn;
```

6. Start Expo server:

```js
expo start
```

### Credit

- Drew from [codingki/react-native-expo-template](https://github.com/codingki/react-native-expo-template/tree/master/template-typescript-bottom-tabs-supabase-auth-flow) for the Supabase auth flow.
