import { Image, StyleSheet, TextInput, View } from 'react-native';

import MatchScreen from "@/app/(tabs)/match";
import { ThemedText } from '@/components/ThemedText';
import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable } from "expo-router/build/views/Pressable";
import React from 'react';

export default function ProfileScreen({navigation}: {navigation: any}) {
    return (
        <View style={{flex:1, backgroundColor: Colors.dark.background,justifyContent:'center', alignItems:'center'}}>
            <View style={{
                width:'100%',
                backgroundColor: Colors.dark.background,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 30,
                paddingHorizontal:10
            }}>
                <View style={styles.backButton}><FontAwesome size={25}name="chevron-left" color="white"/></View>
                <ThemedText type="title" style={{marginTop: '10%'}}>Perfil</ThemedText>
                <FontAwesome size={22} name="pencil" color={'#FFFFFF'} style={{
                    marginTop: '10%',
                    backgroundColor: 'transparent',
                    padding: 15,
                    borderRadius: 100,
                }}/>
            </View>
            <View style={{flex:2, flexDirection:'row', backgroundColor: Colors.dark.background,justifyContent:'center', alignItems:'center'}}>
                <View style={{flex:2, flexDirection:'row', marginTop:80, backgroundColor: Colors.dark.background,justifyContent:'space-around', alignItems:'center'}}>
                    <Image source={require('@/assets/images/foto_perfil.png')}></Image>
                </View>
            </View>
            <View style={{flex:2, backgroundColor: 'transparent',justifyContent:'flex-start', alignItems:'center'}}>
                <ThemedText type="defaultSemiBold" style={{marginTop: '20%'}}>Little Cachorrinho</ThemedText>
            </View>
            <View style={{flex:4, backgroundColor: Colors.dark.background, justifyContent:'center', alignItems:'flex-start', marginBottom: 30}}>
                <View style={{flex:1,flexDirection:'column', backgroundColor: Colors.dark.background,justifyContent:'center', alignItems:'flex-start'}}>
                    <ThemedText type="defaultSemiBold" style={{color:'white'}}>Nome</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Little Cachorrinho"
                    />
                </View>
                <View style={{flex:1,flexDirection:'column', backgroundColor: Colors.dark.background,justifyContent:'center', alignItems:'flex-start'}}>
                    <ThemedText type="defaultSemiBold" style={{color:'white'}}>Usuário</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="little.cachorrinho"
                    />
                </View>
                <View style={{flex:1, flexDirection:'column', backgroundColor: Colors.dark.background,justifyContent:'center', alignItems:'flex-start'}}>
                    <ThemedText type="defaultSemiBold" style={{color:'white'}}>E-mail</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="little.cachorrinho@gmail.com"
                    />
                </View>
            </View>
            <View style={{flex:1/2, flexDirection:'row', backgroundColor: Colors.dark.background,justifyContent:'space-around', alignItems:'center', marginBottom: 40,paddingLeft:60, paddingRight:60, gap: 10}}>
                <Pressable style={styles.button}>
                    <ThemedText type="defaultSemiBold" style={{color:'white'}}>Salvar Perfil</ThemedText>
                </Pressable>
                <Pressable style={styles.button2} onPress={() => navigation.navigate(MatchScreen())}>
                    <ThemedText type="defaultSemiBold" style={{color:'white'}}>Sair</ThemedText>
                </Pressable>
            </View>
        </View>

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
        marginTop:5
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
    backButton:{
        width: 55,
        height: 55,
        alignItems:'center',
        justifyContent:'center',
        opacity: 0.8,
        marginTop: 32
    },
});
