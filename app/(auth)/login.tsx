import { signIn } from "@/services/authService";
import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const openSignUp = () => {
        router.replace("/signup");
    };

    const handleSignIn = async () => {
        const { error } = await signIn(email, password);
        if (error) {
            Alert.alert('Login failed', error.message);
        } else {
            Alert.alert('Success', 'Logged in successfully!', [
                {
                    text: 'OK',
                    // onPress: () => router.replace("/"),
                    onPress: () => {
                        setTimeout(() => {
                            router.replace("/");
                        }, 300);
                    },
                },
            ]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.inner}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <Text style={styles.title}>Login</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <TextInput
                    style={styles.textArea}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={openSignUp}>
                    <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fb',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 32,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
    },
    textArea: {
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007aff',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    linkText: {
        textAlign: 'center',
        color: '#007aff',
        fontSize: 15,
    },
});


// import { signIn } from "@/services/authService";
// import { router } from "expo-router";
// import { useState } from "react";
// import { Alert, Button, SafeAreaView, TextInput, View } from "react-native";

// export default function loginScreen() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const openSignUp = async () => {
//         router.replace("/signup");
//     }

//     const handleSignIn = async () => {
//         const { error } = await signIn(email, password);
//         if (error) {
//             Alert.alert('Login failed', error.message);
//         }
//         else {
//             router.replace("/");
//         }
//     }
//     return (
//         <SafeAreaView>
//             <View>
//                 <TextInput placeholder="Email" onChangeText={setEmail} />
//                 <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
//                 {/* <Button title="Sign In" onPress={() => signIn(email, password)} /> */}
//                 <Button title="Sign In" onPress={handleSignIn} />
//                 <Button title="Sign Up" onPress={openSignUp} />
//             </View>
//         </SafeAreaView>
//     )
// }