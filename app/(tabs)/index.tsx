// App.tsx
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { createStackNavigator } from "@react-navigation/stack";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ImageSourcePropType,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const API_KEY = '2017240ed8d4e61fbe9ed801fe5da25a';
const BASE_URL = 'https://api.themoviedb.org/3';
const BASE_URL_API = 'http://10.0.2.2:3000/movies';
const POPULAR_MOVIES_URL_API = 'http://10.0.2.2:3000/movies/popular';
const POPULAR_MOVIES_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`;
const NOW_PLAYING_MOVIES_URL = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR`;
const TOP_RATED_MOVIES_URL = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-BR`;
const UPCOMING_MOVIES_URL = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=pt-BR`;
const SEARCH_MOVIE_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR`;

const Icon = (props:any) => (
    <Svg
      viewBox="0 0 34 39"
      width={54}
      height={50}
      {...props}
    >
      <G filter="url(#a)">
        <Path
          fillRule="evenodd"
          d="m24.408 1.453-.533 1.382-2.98-.114-2.98-.113V4.9l2.228.136c1.226.074 2.321.224 2.434.332.114.108-.038.754-.336 1.436-.298.681-.493 1.286-.433 1.343.161.154 8.544-1.105 8.766-1.316.168-.16-4.827-6.282-5.404-6.623-.126-.075-.47.486-.762 1.246Zm-11.096.502c-.503.531-.57 1.732-.57 10.212 0 6.187-.123 9.61-.346 9.61-.208 0-.344-1.404-.344-3.55 0-4.07-.393-5.016-2.081-5.016-1.884 0-2.146.912-2.007 7.002.12 5.298.136 5.395 1.257 7.57 1.235 2.394 3 4.068 5.563 5.274 1.303.614 2.151.743 4.855.743 2.939 0 3.482-.1 5.273-.966 2.336-1.13 4.487-3.23 5.53-5.4.67-1.39.742-2.109.746-7.374.005-6.418-.15-6.93-2.093-6.93-1.31 0-1.868.88-1.868 2.944 0 .962-.156 1.75-.345 1.75-.2 0-.345-1.074-.345-2.563 0-2.985-.527-4.026-2.036-4.026-1.582 0-2.103.883-2.103 3.567 0 1.355-.147 2.363-.345 2.363-.201 0-.345-1.106-.345-2.658 0-2.888-.327-3.821-1.488-4.24-.768-.277-1.912.092-2.386.77-.14.2-.256 1.511-.26 2.916-.002 1.479-.15 2.553-.35 2.553-.218 0-.344-2.501-.344-6.845 0-5.661-.093-6.97-.537-7.576-.663-.905-2.233-.972-3.03-.13ZM9.2 5.034l-2.335 1.04-.99-.906c-.544-.497-1.069-.782-1.166-.63-.377.585-2.013 6.764-1.836 6.933.167.16 2.141-.243 6.203-1.264l1.335-.336-.904-.9c-.497-.496-.903-.992-.903-1.103 0-.111.698-.457 1.552-.768 1.469-.536 1.552-.634 1.552-1.84 0-.7-.039-1.271-.087-1.27-.047.002-1.137.472-2.421 1.044Z"
          clipRule="evenodd"
        />
      </G>
    </Svg>
  )

interface Movie {
    id: number;
    poster_path: string | null;
}

const Stack = createStackNavigator();

const App = ({navigation}:{navigation: any}) => {
    const [query, setQuery] = useState<string>('');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filter, setFilter] = useState<string>('popular');
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchMovies(POPULAR_MOVIES_URL);
    }, []);

    const fetchMovies = async (url: string, isLoadMore = false) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();
            setMovies((prevMovies) => (isLoadMore ? [...prevMovies, ...data.results] : data.results));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // const fetchMovies = async (url: string) => {
    //     try {
    //         const response = await fetch(url);
    //         const data = await response.json();
    //         setMovies(data.results || []);
    //     } catch (error) {
    //         console.error(error);
    //         setMovies([]);
    //     }
    // };

    const searchMovies = () => {
        if (query.length < 1) return;
        const url = `${SEARCH_MOVIE_URL}&query=${query}`;
        fetchMovies(url);
        listRef.current?.scrollToOffset({animated: true, offset: 0});
    };

    const listRef = useRef<FlatList>(null)
    const applyFilter = (filterType: string) => {
        setFilter(filterType);
        setPage(1);
        let url = '';
        switch (filterType) {
            case 'popular':
                url = POPULAR_MOVIES_URL;
                break;
            case 'now_playing':
                url = NOW_PLAYING_MOVIES_URL;
                break;
            case 'top_rated':
                url = TOP_RATED_MOVIES_URL;
                break;
            case 'upcoming':
                url = UPCOMING_MOVIES_URL;
                break;
        }
        fetchMovies(url);
        listRef.current?.scrollToOffset({animated: true, offset: 0});
    };

    const loadMoreMovies = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        let url = '';
        switch (filter) {
            case 'popular':
                url = `${POPULAR_MOVIES_URL}&page=${nextPage}`;
                break;
            case 'now_playing':
                url = `${NOW_PLAYING_MOVIES_URL}&page=${nextPage}`;
                break;
            case 'top_rated':
                url = `${TOP_RATED_MOVIES_URL}&page=${nextPage}`;
                break;
            case 'upcoming':
                url = `${UPCOMING_MOVIES_URL}&page=${nextPage}`;
                break;
            case 'search':
                url = `${SEARCH_MOVIE_URL}&query=${query}&page=${nextPage}`;
                break;
        }
        fetchMovies(url, true);
    };

    const renderMovie = ({ item }: { item: Movie }) => {
        const posterUrl: ImageSourcePropType = item.poster_path
            ? { uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }
            : require('@/assets/images/No-Image-Placeholder.png');

        return (
            <TouchableWithoutFeedback onPress={() => navigation.navigate('MovieDetailsScreen', { movieId: item.id })}>
                <View key={item.id} style={styles.gridItem}>
                    <Image source={posterUrl} style={styles.posterImage} />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const getFilterButtonStyle = (filterType: string) => {
        return (filter === filterType
            ? [styles.filterButton, styles.filterButtonActive]
            : styles.filterButton
        )
    };

    return (
        <><View style={styles.searchDiv}>
            <Icon fill="#D46162" style={styles.icon}/>
            <View style={{flexDirection: 'row'}}>
                <TextInput
                    style={styles.input}
                    placeholder="Procurando algum filme?"
                    value={query}
                    onChangeText={setQuery}
                />
                <Pressable style={styles.button} onPress={searchMovies}>
                    <Text style={{
                        fontSize: 12,
                        lineHeight: 20,
                        fontWeight: 'bold',
                        letterSpacing: 0.5,
                        color: 'white',
                        flex: 1,
                        alignSelf: 'center',
                    }}>Procurar</Text>
                </Pressable>
            </View>
        </View>
            <View style={{
                flex: 1 / 2,
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: Colors.dark.background,
                paddingBottom: 10
            }}>
                <ThemedText onPress={() => applyFilter('popular')} type="subtitle"
                            style={getFilterButtonStyle('popular')}>Populares</ThemedText>
                <ThemedText onPress={() => applyFilter('top_rated')} type="subtitle"
                            style={getFilterButtonStyle('top_rated')}>Mais Votados</ThemedText>
                <ThemedText onPress={() => applyFilter('now_playing')} type="subtitle"
                            style={getFilterButtonStyle('now_playing')}>Nos Cinemas</ThemedText>
                <ThemedText onPress={() => applyFilter('upcoming')} type="subtitle"
                            style={getFilterButtonStyle('upcoming')} >Em Breve</ThemedText>
            </View>
            <SafeAreaView style={styles.container}>
                <FlatList
                    ref={listRef}
                    data={movies}
                    renderItem={renderMovie}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    onEndReached={loadMoreMovies}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#0000ff"/> : null}
                />
            </SafeAreaView></>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 10,
        padding: 0,
        backgroundColor: '#fff',
    },
    searchDiv: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 30,
        flex: 2,
        flexDirection: 'row',
        alignItems: "center",
        gap:25,
        justifyContent: 'space-between',
        backgroundColor: Colors.dark.background,
    },
    input: {
        width: 205,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        marginTop: 30,
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8,
        elevation: 10,
        marginLeft:55
    },
    button: {
        width: 85,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 15,
        marginTop: 30,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        elevation: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    filterButton: {
        fontSize: 12,
        marginTop: 10,
    },
    gridItem: {
        flex: 1,
        padding: 0,
    },
    posterImage: {
        width: (Dimensions.get('window').width / 2),
        height: ((Dimensions.get('window').width / 2)) * 1.5,
    },
    logo: {
        marginTop: 35,
        width: 40,
        height: 70,
    }, filterButtonActive: {
        color: Colors.dark.tabIconSelected,
    },
    icon:{
        position: 'absolute',
        top:85,
        left:18
    }
});
export default App;
