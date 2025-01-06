// App.tsx
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Pressable } from "expo-router/build/views/Pressable";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
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
    View,
} from "react-native";
import { Icon } from "../../components/MatchLogo";

const API_KEY = "2017240ed8d4e61fbe9ed801fe5da25a";
const BASE_URL = "https://api.themoviedb.org/3";
const BASE_NGROK = "https://c5aa-201-76-179-217.ngrok-free.app";
const POPULAR_MOVIES_URL_API = `${BASE_NGROK}/movies/popular`;
const NOW_PLAYING_MOVIES_URL_API = `${BASE_NGROK}/movies/now_playing`;
const TOP_RATED_MOVIES_URL_API = `${BASE_NGROK}/movies/top_rated`;
const UPCOMING_MOVIES_URL_API = `${BASE_NGROK}/movies/upcoming`;
const SEARCH_MOVIES_URL_API = `${BASE_NGROK}/movies/search`;
const POPULAR_MOVIES_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`;
const NOW_PLAYING_MOVIES_URL = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR`;
const TOP_RATED_MOVIES_URL = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-BR`;
const UPCOMING_MOVIES_URL = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=pt-BR`;
const SEARCH_MOVIE_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR`;

// const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

interface Movie {
    id: number;
    poster_path: string | null;
}

type RootStackParamListTeste = {
    register: undefined;
    index: undefined;
};

type LoginScreenNavigationProp = RouteProp<RootStackParamListTeste>;

type RootStackParamList = {
    index: undefined;
    details: { movieId: number };
    '(auths)': { screen: string };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
    useEffect(() => {
        const checkAuth = async () => {
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) {
                navigation.navigate('(auths)', { screen: 'login' });  // Redirect to login if no token is found
            }
        };

        checkAuth();
    }, []);

    const route = useRoute<LoginScreenNavigationProp>();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [query, setQuery] = useState<string>("");
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filter, setFilter] = useState<string>("popular");
    const [page, setPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const FILTER_URLS: any = {
        popular: POPULAR_MOVIES_URL_API,
        now_playing: NOW_PLAYING_MOVIES_URL_API,
        top_rated: TOP_RATED_MOVIES_URL_API,
        upcoming: UPCOMING_MOVIES_URL_API,
        search: (query: string, page: number) =>
            `${SEARCH_MOVIES_URL_API}?search=${query}&page=${page}`,
    };

    useEffect(() => {
        fetchMovies(POPULAR_MOVIES_URL_API);
    }, []);

    const fetchMovies = async (url: string, isLoadMore = false) => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            console.log(`Fetching from URL: ${url}`);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(
                    `HTTP status ${response.status}: ${response.statusText}`
                );
            }
            const data = await response.json();
            setMovies((prevMovies) =>
                isLoadMore ? [...prevMovies, ...data.results] : data.results
            );
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
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
        if (query.trim().length < 1) return;

        setFilter("search"); // Set the filter to "search"
        setPage(1); // Reset the page number

        const url = `${SEARCH_MOVIES_URL_API}?search=${query}&page=1`;
        fetchMovies(url);
        listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };

    const listRef = useRef<FlatList>(null);
    const applyFilter = (filterType: string) => {
        setFilter(filterType);
        setPage(1);

        let url = "";

        if (filterType === "search") {
            url = FILTER_URLS.search(query, 1);
        } else {
            url = FILTER_URLS[filterType];
        }

        fetchMovies(url);
        listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };

    const loadMoreMovies = () => {
        const nextPage = page + 1;
        setPage(nextPage);

        let url = "";

        if (filter === "search") {
            url = `${SEARCH_MOVIES_URL_API}?search=${query}&page=${nextPage}`;
        } else {
            url = `${FILTER_URLS[filter]}?page=${nextPage}`;
        }

        fetchMovies(url, true);
    };

    const renderMovie = ({ item }: { item: Movie }) => {
        const posterUrl: ImageSourcePropType = item.poster_path
            ? { uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }
            : require("@/assets/images/No-Image-Placeholder.png");

        return (
            <TouchableWithoutFeedback
                onPress={() =>
                    navigation.navigate("details", { movieId: item.id })
                }
            >
                <View key={item.id} style={styles.gridItem}>
                    <Image source={posterUrl} style={styles.posterImage} />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const getFilterButtonStyle = (filterType: string) => {
        return filter === filterType
            ? [styles.filterButton, styles.filterButtonActive]
            : styles.filterButton;
    };

    return (
        <>
            <View style={styles.searchDiv}>
                <Icon
                    fill="#D46162"
                    viewBox={"0 0 34 39"}
                    width={54}
                    height={50}
                    style={styles.icon}
                />
                <View style={{ flexDirection: "row" }}>
                    <TextInput
                        style={styles.input}
                        placeholder="Procurando algum filme?"
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                        value={query}
                        onChangeText={setQuery}
                        selectionColor={Colors.dark.tabIconSelected}
                    />
                    <Pressable style={styles.button} onPress={searchMovies}>
                        <Text
                            style={{
                                fontSize: 12,
                                lineHeight: 20,
                                fontWeight: "bold",
                                letterSpacing: 0.5,
                                color: "white",
                                flex: 1,
                                alignSelf: "center",
                            }}
                        >
                            Procurar
                        </Text>
                    </Pressable>
                </View>
            </View>
            <View
                style={{
                    flex: 1 / 2,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    backgroundColor: Colors.dark.background,
                    paddingBottom: 10,
                }}
            >
                <ThemedText
                    onPress={() => applyFilter("popular")}
                    type="subtitle"
                    style={getFilterButtonStyle("popular")}
                >
                    Populares
                </ThemedText>
                <ThemedText
                    onPress={() => applyFilter("top_rated")}
                    type="subtitle"
                    style={getFilterButtonStyle("top_rated")}
                >
                    Mais Votados
                </ThemedText>
                <ThemedText
                    onPress={() => applyFilter("now_playing")}
                    type="subtitle"
                    style={getFilterButtonStyle("now_playing")}
                >
                    Nos Cinemas
                </ThemedText>
                <ThemedText
                    onPress={() => applyFilter("upcoming")}
                    type="subtitle"
                    style={getFilterButtonStyle("upcoming")}
                >
                    Em Breve
                </ThemedText>
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
                    ListFooterComponent={
                        isLoading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : null
                    }
                />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 10,
        padding: 0,
        backgroundColor: "#fff",
    },
    searchDiv: {
        paddingHorizontal: 30,
        paddingTop: 10,
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        gap: 25,
        justifyContent: "space-between",
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
        marginLeft: 55,
        color: Colors.dark.text,
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
        flexDirection: "row",
        justifyContent: "space-around",
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
        width: Dimensions.get("window").width / 2,
        height: (Dimensions.get("window").width / 2) * 1.5,
    },
    logo: {
        marginTop: 35,
        width: 40,
        height: 70,
    },
    filterButtonActive: {
        color: Colors.dark.tabIconSelected,
    },
    icon: {
        position: "absolute",
        top: 60,
        left: 18,
    },
});
export default HomeScreen;
