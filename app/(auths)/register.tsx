import { ThemedText } from '@/components/ThemedText';
import { Colors } from "@/constants/Colors";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from 'expo-router';
import { Pressable } from "expo-router/build/views/Pressable";
import React from 'react';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Icon } from '../../components/MatchLogo';

const RegisterScreen = ({navigation}: {navigation: any}) => {
    navigation = useNavigation();
    return (
        <><><View style={{ flex: 2/4, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center' }}>
                <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
                    <View >
                    <FontAwesome size={30} name="chevron-left" color={Colors.dark.text} />
                    </View>
                </Pressable>
            <View style={{height: '100%',width:'100%', alignItems:'center', justifyContent:'center', marginTop:'10%'}}>
                <Icon width={130} height={130} fill={Colors.dark.tabIconSelected} style={{alignSelf:'center', marginRight:0}}/>
                <ThemedText type="default" style={{fontFamily:'Coiny-Regular', fontWeight:400, fontSize: 32, padding: 20}}>Registre-se!</ThemedText>
            </View>
        </View>
            <ScrollView style={{ flex: 1, backgroundColor: Colors.dark.background}}>
                <View style={{ flex: 5, flexDirection: 'column', backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center', gap:2, marginBottom:30,  marginHorizontal: 16}}>
                    <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>Nome</ThemedText>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Digite seu nome"
                        keyboardType="default" />
                    <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>Sobrenome</ThemedText>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Digite seu sobrenome"
                        keyboardType="default" />
                    <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>Usuário</ThemedText>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Digite seu usuário"
                        keyboardType="default" />
                    <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>E-mail</ThemedText>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Digite seu e-mail"
                        keyboardType="default" />
                    <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>Senha</ThemedText>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Digite sua senha"
                        secureTextEntry
                        keyboardType="default" />
                    <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>Confirmação de Senha</ThemedText>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Confirme sua senha"
                        secureTextEntry
                        keyboardType="default" />
                    <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>CPF</ThemedText>
                    <TextInput
                        style={styles.input}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Digite seu CPF"
                        keyboardType="default" />
                    <ThemedText type="default" style={{color:'white', alignSelf:'flex-start', marginTop:10}}>Endereço</ThemedText>
                    <View style={{flexDirection: 'row', gap: 10}}>
                        <TextInput
                        style={[styles.inputSmall, styles.size]}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Digite seu Endereço"
                        keyboardType="default" />
                        <TextInput
                        style={[styles.inputSmall, styles.size2]}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        placeholder="Número"
                        keyboardType="default" />
                    </View>
                    <Pressable style={styles.button}>
                        <ThemedText type="defaultSemiBold" style={{color:'white'}}>Registrar</ThemedText>
                    </Pressable>
                </View>
            </ScrollView></>
        </>
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
        color: Colors.dark.text
    },
    inputSmall: {
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 10,
    },
    size:{
        width: 240,
        height: 50,
    },
    size2:{
        width: 110,
        height: 50,
    },
    button:{
        justifyContent:'center',
        alignItems:'center',
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 10,
        marginTop:20
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
    },
    backButton: {
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 60,
        left:0,
        backgroundColor: Colors.dark.background,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
});

export default RegisterScreen;