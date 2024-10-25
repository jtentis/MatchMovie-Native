import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';

type RootStackParamList = {
    groups: undefined;
  };

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'groups'>;

export default function MatchScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    function buttonPressed(){
        return Alert.alert('Botão pressionado!');
    }

    return (
        <View
            style={[styles.container,{flexDirection: 'column',},]}>
            <View style={{
                flex: 1,
                backgroundColor: Colors.dark.background,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingHorizontal: 16,
                gap: 10,
            }}>
                <ThemedText type="title" style={{marginTop: '10%'}}>Minhas Sessões</ThemedText>
            </View>
            <View style={{
                flex: 4 / 2,
                backgroundColor: Colors.dark.background,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <ScrollView horizontal={true} style={{marginLeft: 10}} showsHorizontalScrollIndicator={false}>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('groups')}>
                        <View style={[styles.card, styles.elevated]}>
                            <Image source={require('@/assets/images/random1.jpg')} resizeMode={"stretch"}
                                style={styles.images}></Image>
                            <ThemedText type="default" style={{
                                position: 'absolute',
                                paddingTop: '170%',
                                paddingRight: '70%'
                            }}>Escola</ThemedText>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('groups')}>
                        <View style={[styles.card, styles.elevated]}>
                            <Image source={require('@/assets/images/random2.jpg')} resizeMode={"stretch"}
                                style={styles.images}></Image>
                            <ThemedText type="default" style={{
                                position: 'absolute',
                                paddingTop: '170%',
                                paddingRight: '65%'
                            }}>Trabalho</ThemedText>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => navigation.navigate('groups')}>
                        <View style={[styles.card, styles.elevated]}>
                            <Image source={require('@/assets/images/random3.jpg')} resizeMode={"stretch"}
                                style={styles.images}></Image>
                            <ThemedText type="default" style={{
                                position: 'absolute',
                                paddingTop: '170%',
                                paddingRight: '70%'
                            }}>Curso</ThemedText>
                        </View>
                    </TouchableWithoutFeedback>
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
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
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
                    selectionColor={Colors.dark.tabIconSelected}
                    placeholderTextColor={Colors.dark.textPlaceHolder}
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
        elevation: 2,
        color:Colors.dark.text
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
        elevation: 2,
        marginTop:40,
        fontSize: Fonts.dark.buttonText
    },
    backButton:{
        width: 30,
        height: 30,
        alignItems:'center',
        justifyContent:'center',
        opacity: 0.8,
        marginTop:32
    }
});
