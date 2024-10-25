import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

const LoginScreen = ({navigation}: {navigation: any}) => {
    // const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        // try {
        //     const response = await fetch('http://10.0.2.2:3000/auth/login', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             email: email,
        //             password: password,
        //         }),
        //     });
        //
        //     if(response.status === 201) {
        //         console.log(response)
        //         // navigation.navigate("Home", { token: token });
        //     } else {
        //         Alert.alert('Erro de Login', 'Senha incorreta!!!');
        //     }
        //     return response;
        // } catch (error) {
        //     Alert.alert('Erro de Login', 'Ocorreu um erro de servidor');
        // }
        try {
            const response = await fetch('http://10.0.2.2:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if(response.status === 201) {
                navigation.navigate("Home");
            } else {
                Alert.alert('Erro de Login', 'Senha incorreta!!!');
            }
        } catch (error) {
            Alert.alert('Erro de Login', 'Ocorreu um erro de servidor');
        }

    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        color: 'white',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default LoginScreen;
