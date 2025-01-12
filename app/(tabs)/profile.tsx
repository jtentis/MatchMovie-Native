import AlertModal from '@/components/ModalAlert';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Pressable } from "expo-router/build/views/Pressable";
import * as SecureStore from "expo-secure-store";
import React, { useState } from 'react';
import { Image, StyleSheet, TextInput, View } from 'react-native';

type RootStackParamList = {
    '(auths)': { screen: string };
  };

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    // State to manage modal visibility and type
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'error' | 'success' | 'alert'>('alert');
    const [modalMessage, setModalMessage] = useState<string>('');

    const handleLogout = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            console.log('token', token);

            await SecureStore.deleteItemAsync('authToken');
            console.log('token deleted');

            setModalMessage('Usuário desconectado com sucesso!');
            setModalType('success');
            setModalVisible(true);

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: '(auths)' }],
                });
            }, 1500);
        } catch (error) {
            console.error('Erro ao desconectar:', error);

            setModalMessage('Erro ao desconectar usuário.');
            setModalType('error');
            setModalVisible(true);
        }
    };
    
    return (
        <View style={{flex:1, backgroundColor: Colors.dark.background,justifyContent:'center', alignItems:'center'}}>
            <View style={{
                width:'100%',
                height: 80,
                marginTop: '16%',
                backgroundColor: Colors.dark.background,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingHorizontal: 16,
            }}>
                <ThemedText type="title">Perfil</ThemedText>
                <FontAwesome size={22} name="pencil" color={'#FFFFFF'} style={{
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    right: 30,
                    top: 25,
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
                    <ThemedText type="default" style={{color:'white'}}>Nome</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="Little Cachorrinho"
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                    />
                </View>
                <View style={{flex:1,flexDirection:'column', backgroundColor: Colors.dark.background,justifyContent:'center', alignItems:'flex-start'}}>
                    <ThemedText type="default" style={{color:'white'}}>Usuário</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="little.cachorrinho"
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                    />
                </View>
                <View style={{flex:1, flexDirection:'column', backgroundColor: Colors.dark.background,justifyContent:'center', alignItems:'flex-start'}}>
                    <ThemedText type="default" style={{color:'white'}}>E-mail</ThemedText>
                    <TextInput
                        style={styles.input}
                        placeholder="little.cachorrinho@gmail.com"
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                    />
                </View>
            </View>
            <View style={{flex:1/2, flexDirection:'row', backgroundColor: Colors.dark.background,justifyContent:'space-around', alignItems:'center', marginBottom: 40, gap: 10}}>
                <Pressable style={styles.button}>
                    <ThemedText type="defaultSemiBold" style={{color:'white'}}>Salvar Perfil</ThemedText>
                </Pressable>
                <Pressable style={styles.button2} onPress={handleLogout}>
                    <ThemedText type="defaultSemiBold" style={{color:'white'}}>Sair</ThemedText>
                </Pressable>
                <AlertModal
                type={modalType}
                message={modalMessage}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                />
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
        elevation: 2,
        marginTop:5,
        color:Colors.dark.text
    },
    button:{
        justifyContent:'center',
        alignItems:'center',
        width: 175,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 2,
    },
    button2:{
        justifyContent:'center',
        alignItems:'center',
        width: 175,
        height: 50,
        backgroundColor: Colors.dark.background,
        padding: 0,
        borderRadius: 8,
        borderWidth:1,
        borderColor: Colors.dark.tabIconSelected,
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
