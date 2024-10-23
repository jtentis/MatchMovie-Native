import { ThemedText } from '@/components/ThemedText';
import { Colors } from "@/constants/Colors";
import { Pressable } from "expo-router/build/views/Pressable";
import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '../../components/MatchLogo';


export default function RegisterScreen({navigation}: {navigation: any}) {
    return (
        <><><View style={{ flex: 2/3, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{alignContent:'center', justifyContent:'center', marginTop:'10%'}}>
                <Icon width={130} height={130} fill={Colors.dark.tabIconSelected} style={{alignSelf:'center', marginRight:5}}/>
                <ThemedText type="defaultSemiBold" style={{color:'white'}}>Preencha com suas informações e faça registro!</ThemedText>
            </View>
        </View><ScrollView style={{ flex: 1 }}>
                <View style={{ flex: 5, flexDirection: 'column', backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        keyboardType="default" />
                    <TextInput
                        style={styles.input}
                        placeholder="Sobrenome"
                        keyboardType="default" />
                    <TextInput
                        style={styles.input}
                        placeholder="Usuário"
                        keyboardType="default" />
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        keyboardType="default" />
                    <TextInput
                        style={styles.input}
                        placeholder="Senha"
                        keyboardType="default" />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirmação de senha"
                        keyboardType="default" />
                    <TextInput
                        style={styles.input}
                        placeholder="CPF"
                        keyboardType="default" />
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <TextInput
                        style={styles.inputSmall}
                        placeholder="Endereço"
                        keyboardType="default" />
                        <TextInput
                        style={styles.inputSmall}
                        placeholder="Número"
                        keyboardType="default" />
                    </View>
                </View>
            </ScrollView></><View style={{ flex: 1/3, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{flex:1, flexDirection:'row', backgroundColor: Colors.dark.background,justifyContent:'space-around', alignItems:'center', marginBottom: 0,paddingLeft:60, paddingRight:60, gap: 10}}>
                    <Pressable style={styles.button}>
                        <ThemedText type="defaultSemiBold" style={{color:'white'}}>Registrar</ThemedText>
                    </Pressable>
                </View>
            </View></>
    );
}

const styles = StyleSheet.create({
    input: {
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 10,
    },
    inputSmall: {
        width: 175,
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
        width: 80,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 10,
    },
    button2:{
        flex:1/2,
        justifyContent:'center',
        alignItems:'center',
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 10,
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
        fontSize: 38
    }
});
