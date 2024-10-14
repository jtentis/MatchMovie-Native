import { Colors } from '@/constants/Colors';
import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export const DetailsComponent: React.FC = () => {
    return (
        <>

        <View style={{ flex: 4/7, backgroundColor: 'blue', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <ImageBackground style={styles.Image} source={require('@/assets/images/poster.png')}></ImageBackground>
            <ThemedText type="defaultSemiBold" style={styles.title}>Tudo em Todo Lugar ao Mesmo Tempo</ThemedText>
        </View>
        <View style={{ flex: 1/20, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'space-between', alignItems: 'center', padding: 5}}>
            <ThemedText type="defaultSemiBold" style={styles.details}>2024 &#x2022; 179min &#x2022; Ficção Científica &#x2022; Drama</ThemedText>
            <ThemedText type="subtitle" style={{position: 'absolute', right: 25, bottom: 0}}>4,3</ThemedText>
        </View>
        <View style={{ flex: 1/50, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'space-between', alignItems: 'center', padding: 13, gap: 2}}>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'flex-start', alignItems: 'center'}}>
                <View style={styles.streamings}>
                    <Image style={styles.streamingImages} source={require('@/assets/images/netflix.png')}></Image>
                </View>
                <View style={styles.streamings}>
                    <Image style={styles.streamingImages} source={require('@/assets/images/prime.png')}></Image>
                </View>
                <View style={styles.streamings}>
                    <Image style={{width: 35, height: 6}} source={require('@/assets/images/globoplay.png')}></Image>
                </View>
            </View>
            <View>
            <ThemedText type="subtitle" style={{position: 'absolute', right: 11, bottom: 0, opacity: .5, fontSize: 12}}>IMDb</ThemedText>
            </View>
        </View>
        <View style={{ flex: 1, backgroundColor: Colors.dark.background, justifyContent: 'center', alignItems: 'center'}}>
            <ThemedText style={{borderWidth: 3, borderColor:'red'}}>This is MyComponent!</ThemedText>
        </View>

        </>
    )
};

const styles = StyleSheet.create({
    Image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    title:{
        fontSize: 20,
        color: 'white',
        position: 'absolute',
        marginTop: 200,
        padding: 10,
        backgroundColor: Colors.dark.background,
        borderRadius: 5,
        shadowOpacity: 4,

    },
    details:{
        fontSize: 10,
        color: 'white',
        shadowOpacity: 4,
        marginLeft: 10,
        opacity: .6,
    },
    streamings:{
        height: 25,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderBlockColor: 'black',
        borderRadius: 5
    },
    streamingImages:{
        width: 30,
        height: 10
    }
});
