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
                <ThemedText type="defaultSemiBold" style={{color:'white', alignSelf:'flex-start'}}>E-mail</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"/>
                <ThemedText type="defaultSemiBold" style={{color:'white', alignSelf:'flex-start'}}>Senha</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry/>
                <ThemedText type={'default'} style={{fontSize: 12}}>Não possui conta?<ThemedText type={'default'} style={{fontSize: 12, color:Colors.dark.tabIconSelected}}> Registre-se!</ThemedText></ThemedText>
                <View style={{flex:1/2, flexDirection:'row', backgroundColor: Colors.dark.background,justifyContent:'space-around', alignItems:'center', marginBottom: 40,paddingLeft:60, paddingRight:60, gap: 10}}>
                    <Pressable onPress={handleLogin} style={styles.button}>
                        <ThemedText type={'defaultSemiBold'} style={{fontSize: 16}}>Login</ThemedText>
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
        width: 340,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 10,
    },
    button:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width: 100,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 10,
        marginTop:50
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
