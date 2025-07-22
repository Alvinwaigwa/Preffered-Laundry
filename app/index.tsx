import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Login</Text>
      <Pressable
        onPress={() => router.replace('/(tabs)')}
        style={{ backgroundColor: 'skyblue', padding: 12, borderRadius: 8 }}
      >
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
}

