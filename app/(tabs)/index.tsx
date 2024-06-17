// App.tsx
import React, {useState} from 'react';
import {
    SafeAreaView,
    TextInput,
    Button,
    FlatList,
    Image,
    StyleSheet,
    View,
    Dimensions,
    ListRenderItem
} from 'react-native';
import {ResponsiveGrid} from "react-native-flexible-grid";
import {Colors} from "@/constants/Colors";
import {ThemedText} from "@/components/ThemedText";
import { Icon } from 'react-native-elements'

const API_KEY = '2017240ed8d4e61fbe9ed801fe5da25a';
const SEARCH_MOVIE_URL = 'http://10.0.2.2:3000/movies/movies';

interface Movie {
    id: number;
    poster_path: string | null;
}

export default function IndexScreen() {
    const [query, setQuery] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);

    const searchMovies = async () => {
        if (query.length < 1) return;
        const url = `${SEARCH_MOVIE_URL}?search=${query}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(response)
            setMovies(data.results);
        } catch (error) {
            console.error(error);
        }
    };

    const renderItem = ({ item }: { item: Movie }) => {
        const posterUrl = item.poster_path = `https://image.tmdb.org/t/p/w500${item.poster_path}`
        return (
            <View style={styles.boxContainer}>
                <Image
                    source={{ uri: posterUrl }}
                    style={styles.box}
                    resizeMode="cover"
                />
            </View>
        );
    };


    return (
        <><View style={styles.searchDiv}>
            <Image source={require('@/assets/images/logo-clean.png')} style={styles.logo}>
            </Image>
            <TextInput
                style={styles.input}
                placeholder="Procurando algum filme?"
                value={query}
                onChangeText={setQuery}
            />
            <Icon style={{
                position: 'absolute',
                marginTop: 100,
                marginRight: 10,
            }} onPress={searchMovies} name="search" size={30} color="white" />
            {/*<Button title="Buscar" onPress={searchMovies} />*/}
        </View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: Colors.dark.background}}>
                <ThemedText type="default" style={{fontSize: 12, marginTop:10}}>Populares</ThemedText>
                <ThemedText type="default" style={{fontSize: 12, marginTop:10}}>Em Breve</ThemedText>
                <ThemedText type="default" style={{fontSize: 12, marginTop:10}}>Nos Cinemas</ThemedText>
                <ThemedText type="default" style={{fontSize: 12, marginTop:10}}>Mais Votados</ThemedText>
            </View>
            <View style={{flex: 15}}>
                <ResponsiveGrid
                    data={movies}
                    renderItem={renderItem}
                    showScrollIndicator={false}
                    keyExtractor={(item: Movie) => item.id.toString()}
                    maxItemsPerColumn={2}/>
            </View></>
    );
};

const styles = StyleSheet.create({
    boxContainer: {
        flex: 1,
    },
    box: {
        width: (Dimensions.get('window').width / 2) , // Responsivo baseado na largura da tela
        height: ((Dimensions.get('window').width / 2) - 15) * 1.5, // Aspect ratio 2:3
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent'
    },
    text: {
        color: 'white',
        fontSize: 10,
        position: 'absolute',
        bottom: 10,
    },
    input: {
        width: 250,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        marginTop: 30,
        borderRadius: 8,
        elevation: 10,
    },
    searchDiv: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        flex: 3,
        gap: 10,
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: 'space-between',
        backgroundColor: Colors.dark.background,
    },
    logo: {
        marginTop: 35,
        width: 40,
        height: 70,
    },
});
