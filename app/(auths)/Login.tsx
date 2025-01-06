import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { StackNavigationProp } from "@react-navigation/stack";
import { useFonts } from 'expo-font';
import { router, useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '../../components/MatchLogo';

type RootStackParamList = {
    register: undefined;
    '(tabs)': { screen: string };
  };

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

//TODO: CONSERTAR COMPORTAMENTO DA DIV DOS BOTOES DE LOGIN COM O TECLADO

const LoginScreen = () => {
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('https://c5aa-201-76-179-217.ngrok-free.app/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });

            if (response.status === 201) {
                const data = await response.json();
                const accessToken = data.accessToken;
                
                await SecureStore.setItemAsync('authToken', accessToken);

                navigation.reset({
                    index: 0,
                    routes: [{ name: '(tabs)' }], // Replace 'login' with your login screen's route name
                });
                Alert.alert('Sucesso', 'Login bem sucedido!');
                console.log(data.accessToken)
            } else {
                Alert.alert('Erro', 'Informações incorretas!');
                // router.push('/(tabs)')
                console.log(response)
            }
            return response;
        } catch (error) {
            router.push('/(tabs)')
            // Alert.alert('Erro de Login');
        }
    };

    let [fontsLoaded] = useFonts({
        'Coiny-Regular': require('../../assets/fonts/Coiny-Regular.ttf'),
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 16,
            backgroundColor: Colors.dark.background,
        }}>
            <View style={{flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: 16,
                marginTop: 100,
                backgroundColor: Colors.dark.background,}}>
                <Icon width={150} height={150} fill={Colors.dark.tabIconSelected} />
                <ThemedText type="title" style={styles.textLogo}>Match Movie</ThemedText>
            </View>
            <View style={styles.container}>
                <ThemedText type="default" style={{color:'white', alignSelf:'flex-start'}}>E-mail</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Digite seu email"
                    value={email}
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"/>
                <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>Senha</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Digite sua senha"
                    value={password}
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
                    onChangeText={setPassword}
                    secureTextEntry></TextInput>
                <View style={{flex:1/2, flexDirection:'column', backgroundColor: Colors.dark.background, justifyContent:'center', alignItems:'center', marginBottom: 40, gap:10}}>
                    <Pressable onPress={handleLogin} style={styles.buttonLogin}>
                        <ThemedText type={'defaultSemiBold'} style={{fontSize: 16}}>Login</ThemedText>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('register')} style={styles.buttonRegister}>
                        <ThemedText type={'defaultSemiBold'} style={{fontSize: 16}}>Criar Conta</ThemedText>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 2,
        justifyContent: 'center',
        alignItems:'center',
        padding: 16,
        backgroundColor: Colors.dark.background,
        gap:5
    },
    title: {
        fontSize: 24,
        marginBottom: 0,
        textAlign: 'center',
    },
    input: {
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
        color: Colors.dark.text
    },
    buttonLogin:{
        justifyContent:'center',
        alignItems:'center',
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 2,
        marginTop:100
    },
    buttonRegister:{
        justifyContent:'center',
        alignItems:'center',
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.background,
        padding: 0,
        borderRadius: 8,
        borderWidth:1,
        borderColor: Colors.dark.tabIconSelected,
    },
    textLogo:{
        color:'white',
        alignSelf:'center',
        justifyContent:'center',
        width: 130,
        textAlign:'center',
        backgroundColor:Colors.dark.background,
        fontFamily:'Coiny-Regular',
        fontWeight: 400,
        fontSize: 46
    }
});

export default LoginScreen;
