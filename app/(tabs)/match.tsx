import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable } from "expo-router/build/views/Pressable";
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';

export default function MatchScreen() {
    function buttonPressed(){
        return Alert.alert('Botão pressionado!');
    }

    return (
        <View
            style={[
                styles.container,
                {
                    // Try setting `flexDirection` to `"row"`.
                    flexDirection: 'column',
                },
            ]}>
            <View style={{
                flex: 1,
                backgroundColor: Colors.dark.background,
                flexDirection: 'row-reverse',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 15,
                gap: 10,
            }}>
                <ThemedText type="title" style={{marginTop: '10%'}}>Minhas Sessões</ThemedText>
                <View style={styles.backButton}><FontAwesome size={25}name="chevron-left" color="white"/></View>
            </View>
            <View style={{
                flex: 4 / 2,
                backgroundColor: Colors.dark.background,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <ScrollView horizontal={true} style={{marginLeft: 10}} showsHorizontalScrollIndicator={false}>
                    <View style={[styles.card, styles.elevated]}>
                        <Image source={require('@/assets/images/random1.jpg')} resizeMode={"stretch"}
                               style={styles.images}></Image>
                        <ThemedText type="defaultSemiBold" style={{
                            position: 'absolute',
                            paddingTop: '170%',
                            paddingRight: '70%'
                        }}>Escola</ThemedText>
                    </View>
                    <View style={[styles.card, styles.elevated]}>
                        <Image source={require('@/assets/images/random2.jpg')} resizeMode={"stretch"}
                               style={styles.images}></Image>
                        <ThemedText type="defaultSemiBold" style={{
                            position: 'absolute',
                            paddingTop: '170%',
                            paddingRight: '60%'
                        }}>Trabalho</ThemedText>
                    </View>
                    <View style={[styles.card, styles.elevated]}>
                        <Image source={require('@/assets/images/random3.jpg')} resizeMode={"stretch"}
                               style={styles.images}></Image>
                        <ThemedText type="defaultSemiBold" style={{
                            position: 'absolute',
                            paddingTop: '170%',
                            paddingRight: '60%'
                        }}>Família</ThemedText>
                    </View>
                    <View style={[styles.card, styles.elevated]}>
                        <Image source={require('@/assets/images/random 4.jpg')} resizeMode={"stretch"}
                               style={styles.images}></Image>
                        <ThemedText type="defaultSemiBold" style={{
                            position: 'absolute',
                            paddingTop: '170%',
                            paddingRight: '60%'
                        }}>Escola</ThemedText>
                    </View>
                    <View style={[styles.card, styles.elevated]}>
                        <Image source={require('@/assets/images/random1.jpg')} resizeMode={"stretch"}
                               style={styles.images}></Image>
                        <ThemedText type="defaultSemiBold" style={{
                            position: 'absolute',
                            paddingTop: '170%',
                            paddingRight: '60%'
                        }}>Trabalho</ThemedText>
                    </View>
                </ScrollView>
            </View>
            <View style={{
                flex: 3/4,
                backgroundColor: Colors.dark.background,
                paddingLeft: 20,
                paddingTop: 20,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent:'space-between',
                gap: 10
            }}>
                <ThemedText type="subtitle" style={{
                    position: 'absolute',
                    marginTop: 10,
                    marginLeft: 20,

                }}>Criar nova sessão</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Nome da Sessão"
                    keyboardType="default"
                />
                <Pressable style={styles.button}>
                    <ThemedText onPress={buttonPressed} type={'defaultSemiBold'} style={{fontSize: Fonts.dark.buttonText}}>Criar</ThemedText>
                </Pressable>
            </View>
            <View style={{
                flex: 1,
                backgroundColor: Colors.dark.background,
                paddingLeft: 20,
                paddingTop: 20,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent:'space-between',
                gap: 10
            }}>
                <ThemedText type="subtitle" style={{
                    position: 'absolute',
                    marginTop: 10,
                    marginLeft: 20,

                }}>Entrar em sessão existente</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Endereço da Sessão"
                    keyboardType="default"
                />
                <Pressable style={styles.button}>
                    <ThemedText onPress={buttonPressed} type={'defaultSemiBold'} style={{fontSize: Fonts.dark.buttonText}}>Entrar</ThemedText>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    images: {
        borderRadius: 8,
        width: 160,
        height: 230,
        elevation: 10
    },
    boxContainer: {
        flex: 1,
    },
    card: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 160,
        height: 230,
        borderRadius: 8,
        margin: 8,
        elevation: 10
    },
    elevated: {
        backgroundColor: 'white',
    },
    input: {
        width: 360,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        marginTop: 20,
        borderRadius: 8,
        elevation: 10,
    },
    button:{
        position: 'absolute',
        right: 12,
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        width: 100,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 0,
        borderRadius: 8,
        elevation: 10,
        marginTop:40,
        fontSize: Fonts.dark.buttonText
    },
    backButton:{
        width: 55,
        height: 55,
        alignItems:'center',
        justifyContent:'center',
        opacity: 0.8,
        marginTop:32
    }
});
