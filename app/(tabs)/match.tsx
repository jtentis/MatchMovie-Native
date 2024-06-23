import React from 'react';
import {
    Button,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Colors} from "@/constants/Colors";
import Carousel from 'react-native-reanimated-carousel';

export default function MatchScreen() {

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
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: 10,
            }}>
                {/*<FontAwesome size={22} name="arrow-left" color={'#FFFFFF'} style={{*/}
                {/*    marginTop: '10%',*/}
                {/*    backgroundColor: Colors.dark.tabIconSelected,*/}
                {/*    padding: 15,*/}
                {/*    borderRadius: 100,*/}
                {/*}}/>*/}
                <ThemedText type="title" style={{marginTop: '10%'}}>Minhas Sessões</ThemedText>
            </View>
            <View style={{
                flex: 4 / 2,
                backgroundColor: Colors.dark.background,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <ScrollView horizontal={true} style={{marginLeft: 20}} showsHorizontalScrollIndicator={false}>
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
                flex: 1,
                backgroundColor: Colors.dark.background,
                paddingLeft: 27,
                paddingTop: 20,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent:'space-between',
                gap: 10
            }}>
                <ThemedText type="subtitle" style={{
                    position: 'absolute',
                    paddingTop: 10,
                    paddingLeft: 30

                }}>Criar nova sessão</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Nome da Sessão"
                    keyboardType="default"
                />
            </View>
            <View style={{
                flex: 1,
                backgroundColor: Colors.dark.background,
                paddingLeft: 27,
                paddingTop: 20,
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent:'space-between',
                gap: 10
            }}>
                <ThemedText type="subtitle" style={{
                    position: 'absolute',
                    paddingTop: 10,
                    paddingLeft: 30

                }}>Entrar em sessão existente</ThemedText>
                <TextInput
                    style={styles.input}
                    placeholder="Endereço da Sessão"
                    keyboardType="default"
                />
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
        marginTop: 30,
        borderRadius: 8,
        elevation: 10,
    }
});
