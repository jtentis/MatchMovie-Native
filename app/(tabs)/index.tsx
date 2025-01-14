// App.tsx
import { Colors } from "@/constants/Colors";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Pressable } from "expo-router/build/views/Pressable";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";
import { Icon } from "../../components/MatchLogo";

const EXPO_PUBLIC_BASE_NGROK = process.env.EXPO_PUBLIC_BASE_NGROK;
const POPULAR_MOVIES_URL_API = `${EXPO_PUBLIC_BASE_NGROK}/movies/popular`;
const NOW_PLAYING_MOVIES_URL_API = `${EXPO_PUBLIC_BASE_NGROK}/movies/now_playing`;
const TOP_RATED_MOVIES_URL_API = `${EXPO_PUBLIC_BASE_NGROK}/movies/top_rated`;
const UPCOMING_MOVIES_URL_API = `${EXPO_PUBLIC_BASE_NGROK}/movies/upcoming`;
const SEARCH_MOVIES_URL_API = `${EXPO_PUBLIC_BASE_NGROK}/movies/search`;
const MOVIE_POSTER_URL_API = `${EXPO_PUBLIC_BASE_NGROK}/movies`;
// const BASE_URL = "https://api.themoviedb.org/3";
// const API_KEY = process.env.TMDB_API_KEY;
// const POPULAR_MOVIES_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR`;
// const NOW_PLAYING_MOVIES_URL = `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=pt-BR`;
// const TOP_RATED_MOVIES_URL = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=pt-BR`;
// const UPCOMING_MOVIES_URL = `${BASE_URL}/movie/upcoming?api_key=${API_KEY}&language=pt-BR`;
// const SEARCH_MOVIE_URL = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR`;

// const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

interface Movie {
    id: number;
    poster_path: string | null | any;
}

type RootStackParamListTeste = {
    register: undefined;
    index: undefined;
};

type LoginScreenNavigationProp = RouteProp<RootStackParamListTeste>;

type RootStackParamList = {
    index: undefined;
    details: { movieId: number };
    "(auths)": { screen: "Login" };
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
    // const [showModal, setShowModal] = useState(false);
    // const [modalText, setModalText] = useState<string>("");
    useEffect(() => {
        const checkAuth = async () => {
            // SecureStore.deleteItemAsync("authToken");
            const token = await SecureStore.getItemAsync("authToken");
            if (!token) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "(auths)" }],
                });
                console.log("nao ta logado", token);
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
    const [posterCache, setPosterCache] = useState<{ [id: string]: string | null }>({});

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
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    // Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
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

    //TODO: loadmoremovies da procura de filmes esta bugado
    const searchMovies = () => {
        if (query.trim().length < 1) return;

        setFilter("search");
        setPage(1);

        const url = `${SEARCH_MOVIES_URL_API}?search=${query}&page=1`;
        fetchMovies(url);
        listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };

    const listRef = useRef<FlatList>(null);
    const applyFilter = (filterType: string, index: number) => {
        setFilter(filterType);
        setPage(1);

        let url = "";

        if (filterType === "search") {
            url = FILTER_URLS.search(query, 1);

            Animated.timing(underlineColor, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
            }).start();
        } else {
            url = FILTER_URLS[filterType];
            Animated.timing(underlineColor, {
                toValue: 0,
                duration: 150,
                useNativeDriver: false,
            }).start();

            Animated.timing(underlinePosition, {
                toValue: index * 100,
                useNativeDriver: false,
            }).start();
        }

        fetchMovies(url);
        listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    };
    const underlineColor = useRef(new Animated.Value(0)).current;

    const animatedColor = underlineColor.interpolate({
        inputRange: [0, 1],
        outputRange:
            filter === "search"
                ? [Colors.dark.background, Colors.dark.background]
                : [Colors.dark.tabIconSelected, Colors.dark.background],
    });

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

    const [posters, setPosters] = useState<{ [id: string]: string | null }>({});

    useEffect(() => {
        const fetchPosters = async () => {
            // Define the type for newPosters
            const newPosters: { [id: number]: string | null } = {};
    
            await Promise.all(
                movies.map(async (movie) => {
                    // Check the cache first
                    if (posterCache[movie.id]) {
                        newPosters[movie.id] = posterCache[movie.id];
                        return;
                    }
    
                    // Format the poster path
                    const formattedPosterPath = movie.poster_path
                        ? `${movie.poster_path[0]}%2F${movie.poster_path.slice(1)}`
                        : "";
    
                    try {
                        // Fetch the poster data
                        const response = await fetch(
                            `${MOVIE_POSTER_URL_API}${formattedPosterPath}/poster`
                        );
    
                        if (response.ok) {
                            const base64Image = await response.text();
                            newPosters[movie.id] = base64Image; // Cache the poster
                        } else {
                            newPosters[movie.id] = null; // Handle failed fetch
                        }
                    } catch (error) {
                        console.error("Error fetching poster:", movie.id, error);
                        newPosters[movie.id] = null; // Handle errors
                    }
                })
            );
    
            // Update the state with the new posters
            setPosterCache((prevCache) => ({ ...prevCache, ...newPosters }));
            setPosters(newPosters);
        };
    
        fetchPosters();
    }, [movies]);
    

    const renderMovie = ({ item }: { item: Movie }) => {
        const posterUrl = posters[item.id];

        if (!posterUrl) {
            return (
                <ContentLoader
                    speed={1}
                    width={Dimensions.get("window").width / 2}
                    height={(Dimensions.get("window").width / 2) * 1.5}
                    viewBox="0 0 200 300"
                    backgroundColor="#ccc"
                    foregroundColor="#ddd"
                >
                    <Rect x="0" y="0" width="200" height="300" />
                </ContentLoader>
            );
        }

        const posterSource = { uri: `data:image/jpeg;base64,${posterUrl}` };

        return (
            <TouchableWithoutFeedback
                onPress={() =>
                    navigation.navigate("details", { movieId: item.id })
                }
            >
                <View key={item.id} style={styles.gridItem}>
                    <Image source={posterSource} style={styles.posterImage} />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    const filterTypes = ["popular", "top_rated", "now_playing", "upcoming"];
    const filterTranslations: any = {
        popular: "Popular",
        top_rated: "Melhor avaliados",
        now_playing: "Em exibição",
        upcoming: "Em breve",
    };
    const underlinePosition = useRef(new Animated.Value(0)).current;

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
                    viewBox={"0 0 34 35"}
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
                <Animated.View
                    style={[
                        styles.underline,
                        {
                            left: underlinePosition,
                            backgroundColor: animatedColor,
                        },
                    ]}
                />
                {filterTypes.map((filterType, index) => (
                    <Text
                        key={filterType}
                        onPress={() => applyFilter(filterType, index)}
                        style={getFilterButtonStyle(filterType)}
                    >
                        {filterTranslations[filterType].replace("_", " ")}
                    </Text>
                ))}
            </View>
            <SafeAreaView style={styles.container}>
                <FlatList
                    style={{backgroundColor: Colors.dark.input}}
                    ref={listRef}
                    data={movies}
                    renderItem={renderMovie}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    onEndReached={loadMoreMovies}
                    onEndReachedThreshold={0.5}
                    initialNumToRender={10} // Render only a few items initially
                    maxToRenderPerBatch={10} // Limit rendering per batch
                    removeClippedSubviews={true} // Remove offscreen items
                    windowSize={5} // Number of items to render around the viewport
                    ListFooterComponent={
                        isLoading ? (
                            <ActivityIndicator size="large" color={Colors.dark.tabIconSelected} />
                        ) : null
                    }
                />
            </SafeAreaView>
            {/* {showModal && <TinyModal text={modalText} />} */}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 10,
        padding: 0,
        backgroundColor: "#fff",
    },
    underline: {
        position: "absolute",
        bottom: 0,
        width: 100,
        height: 3,
        backgroundColor: "black",
        zIndex: 1000,
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
        marginTop: 10,
        fontSize: 14,
        color: Colors.dark.text,
        textTransform: "capitalize",
        textAlign: "center",
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
        fontWeight: "bold",
    },
    icon: {
        position: "absolute",
        top: 63,
        left: 14,
    },
});
export default HomeScreen;
