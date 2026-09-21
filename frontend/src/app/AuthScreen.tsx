import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { userService } from '../services/userService'; // Your existing service file

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const handleAuthentication = async () => {
        try {
            let userCredential;
            
            // 1. Authenticate securely with Firebase
            if (isLogin) {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            } else {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
            }

            // 2. Extract the permanent Firebase UID
            const uid = userCredential.user.uid;
            
            // 3. THE HANDSHAKE: Send the UID to Spring Boot / PostgreSQL
            // If they just signed up, Spring Boot creates the row.
            // If they logged in, Spring Boot fetches their profile.
            const userProfile = await userService.getUserProfile(uid);
            
            Alert.alert("Success!", `Welcome back to SurfLog, ${userProfile.name}`);
            
            // 4. Navigate the user to your main app screen here
            // e.g., router.replace('/home');

        } catch (error: any) {
            Alert.alert("Authentication Error", error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <Button title={isLogin ? "Sign In" : "Sign Up"} onPress={handleAuthentication} />
            
            <Button 
                title={isLogin ? "Need an account? Sign Up" : "Have an account? Sign In"} 
                onPress={() => setIsLogin(!isLogin)} 
                color="gray"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 }
});