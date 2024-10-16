import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Image, ImageBackground, StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

export const DetailsComponent: React.FC = () => {
    return (
        <>

        <View style={{ flex: 4/5, backgroundColor: 'blue', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
            <ImageBackground style={styles.Image} source={require('@/assets/images/poster.png')}></ImageBackground>
            <ThemedText type="defaultSemiBold" style={styles.title}>Tudo em Todo Lugar ao Mesmo Tempo</ThemedText>
            <FontAwesome style={{position: 'absolute', left: 20, top:50, padding: 20, borderRadius: 10000, backgroundColor: '#D46162', opacity: .8}} size={25} name="chevron-left" color='white'/>
            <FontAwesome style={{position: 'absolute', right: 20, top:50, padding: 20, borderRadius: 10000, backgroundColor: 'black', opacity: .7}} size={25} name="heart" color='#D46162'/>
            <FontAwesome style={{position: 'absolute', right: 20, top:120, padding: 20, borderRadius: 10000, backgroundColor: 'black', opacity: .7}} size={25} name="close" color='#D46162'/>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.dark.background, padding: 15, paddingTop: 5}}>
        <View style={{ flex: 1/10, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'space-between', alignItems: 'center', padding: 0}}>
            <ThemedText type="defaultSemiBold" style={styles.details}>2024 &#x2022; 179min &#x2022; Ficção Científica &#x2022; Drama</ThemedText>
            <ThemedText type="subtitle" style={{position: 'relative', right: 0, top: 5, fontSize: 26}}>4.3 <FontAwesome size={22} name="star" color='#D46162'/></ThemedText>
        </View>
            <View style={{ flex: 1/14, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'space-between', alignItems: 'center', marginLeft: 0, gap: 2}}>
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: Colors.dark.background, justifyContent: 'flex-start', alignItems: 'center', gap: 1.2}}>
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
                    <ThemedText type="subtitle" style={{position: 'absolute', right: 12, bottom: 0, opacity: .5, fontSize: 14}}>IMDb</ThemedText>
                </View>
            </View>
            <View style={{ flex: 1, backgroundColor: Colors.dark.background, justifyContent: 'space-around', alignItems: 'center'}}>
                <ThemedText style={{fontSize: 19}}>Uma imigrante chinesa parte rumo a uma aventura onde, sozinha, precisará salvar o mundo, explorando outros universos e outras vidas que poderia ter vivido. Contudo, as coisas se complicam quando ela fica presa nessa infinidade de possibilidades sem conseguir retornar para casa.</ThemedText>
                <ThemedText type="subtitle" style={{}}>ELENCO</ThemedText>
                <View style={{flex:1/2, flexDirection: 'row'}}>
                    <View style={styles.elenco}>
                        <Image style={{width: 55, height: 53}} source={require('@/assets/images/cast-image-example.png')}></Image>
                        <ThemedText type="default" style={{}}>Ke Huy Quan</ThemedText>
                    </View>
                    <View style={styles.elenco}>
                        <Image style={{width: 55, height: 53}} source={require('@/assets/images/cast-image-example.png')}></Image>
                        <ThemedText type="default" style={{}}>Ke Huy Quan</ThemedText>
                    </View>
                    <View style={styles.elenco}>
                        <Image style={{width: 55, height: 53}} source={require('@/assets/images/cast-image-example.png')}></Image>
                        <ThemedText type="default" style={{}}>Ke Huy Quan</ThemedText>
                    </View>
                    <View style={styles.elenco}>
                        <Image style={{width: 55, height: 53}} source={require('@/assets/images/cast-image-example.png')}></Image>
                        <ThemedText type="default" style={{}}>Ke Huy Quan</ThemedText>
                    </View>
                    <View style={styles.elenco}>
                        <Image style={{width: 55, height: 53}} source={require('@/assets/images/cast-image-example.png')}></Image>
                        <ThemedText type="default" style={{}}>Ke Huy Quan</ThemedText>
                    </View>
                </View>
            </View>
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
        fontSize: 24,
        color: 'white',
        position: 'absolute',
        marginTop: 270,
        padding: 15,
        backgroundColor: Colors.dark.background,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        shadowOpacity: 4,

    },
    details:{
        fontSize: 12,
        color: 'white',
        shadowOpacity: 4,
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
    },
    elenco:{
        flex: 1/5,
        alignItems: 'center',
    }
});
