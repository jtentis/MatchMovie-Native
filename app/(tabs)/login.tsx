import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useFonts } from 'expo-font';
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '../../components/MatchLogo';

const Login = ({navigation}: { navigation: any }) => {
    // const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
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

            if (response.status === 201) {
                Alert.alert('Erro de Login', 'Login bem sucedido!');
                console.log(response)
                // navigation.navigate("Home", { token: token });
            } else {
                Alert.alert('Erro de Login', 'Senha incorreta!');
                console.log(response)
            }
            return response;
        } catch (error) {
            Alert.alert('Erro de Login');
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
                    secureTextEntry/>
                <View style={{flex:1/2, flexDirection:'column', backgroundColor: Colors.dark.background, justifyContent:'center', alignItems:'center', marginBottom: 40, gap:10}}>
                    <Pressable onPress={handleLogin} style={styles.buttonLogin}>
                        <ThemedText type={'defaultSemiBold'} style={{fontSize: 16}}>Login</ThemedText>
                    </Pressable>
                    <Pressable onPress={handleLogin} style={styles.buttonRegister}>
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

export default Login;
