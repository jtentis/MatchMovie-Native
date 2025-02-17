import { useAuth } from "@/app/contexts/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    Pressable,
    SafeAreaView,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface Movie {
    id: number;
    poster_path: string | null | any;
}

type RootStackParamList = {
    UserListsScreen: { userId: number; type: "watched" | "favorites" };
    details: { movieId: number };
};

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
const MOVIE_POSTER_URL_API = `${URL_LOCALHOST}/movies`;

const UserListsScreen: React.FC = () => {
    const navigation = useNavigation<ScreenNavigationProp>();
    const route = useRoute();
    const { userId, type } = route.params as {
        userId: number;
        type: "watched" | "favorites";
    };
    const { authToken } = useAuth();
    const [movies, setMovies] = useState<any[]>([]);
    const [posters, setPosters] = useState<{ [id: number]: string | null }>({});
    const [posterCache, setPosterCache] = useState<{
        [id: number]: string | null;
    }>({});
    const [isLoading, setIsLoading] = useState(true);
    const listRef = useRef<FlatList<any>>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(
                    `${URL_LOCALHOST}/${type}/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                const data = await response.json();
                setMovies(data);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMovies();
    }, [userId, type]);

    useEffect(() => {
        const fetchPosters = async () => {
            const newPosters: { [id: number]: string | null } = {};

            await Promise.all(
                movies.map(async (movie) => {
                    if (posterCache[movie.id]) {
                        newPosters[movie.id] = posterCache[movie.id];
                        return;
                    }

                    if (!movie.poster_path) {
                        newPosters[movie.id] = null;
                        return;
                    }

                    const formattedPosterPath = movie.poster_path.replace(
                        /^\//,
                        ""
                    );

                    try {
                        const response = await fetch(
                            `${MOVIE_POSTER_URL_API}/${formattedPosterPath}/poster`
                        );

                        if (response.ok) {
                            console.log(response);
                            const base64Image = await response.text();
                            newPosters[movie.id] = base64Image;
                        } else {
                            newPosters[movie.id] = null;
                        }
                    } catch (error) {
                        console.error(
                            "Error fetching poster:",
                            movie.id,
                            error
                        );
                        newPosters[movie.id] = null;
                    }
                })
            );

            setPosterCache((prevCache) => ({ ...prevCache, ...newPosters }));
            setPosters(newPosters);
        };

        if (movies.length > 0) {
            fetchPosters();
        }
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

        return (
            <TouchableWithoutFeedback
                onPress={() =>
                    navigation.navigate("details", { movieId: item.id })
                }
            >
                <View key={item.id} style={styles.gridItem}>
                    <Image
                        source={{ uri: `data:image/jpeg;base64,${posterUrl}` }}
                        style={styles.posterImage}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    };

    return (
        <View style={{width: '100%', height: '100%', backgroundColor: Colors.dark.background}}>
            <View style={styles.title}>
                <ThemedText style={{fontSize: 32, padding: 15, fontFamily:'CoinyRegular'}}>
                    {type === "watched"
                        ? "Filmes assistidos"
                        : "Filmes favoritos"}
                </ThemedText>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <View>
                        <FontAwesome
                            size={30}
                            name="chevron-left"
                            color={Colors.dark.text}
                        />
                    </View>
                </Pressable>
            </View>
            <SafeAreaView style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color={Colors.dark.tabIconSelected} />
            ) : movies.length === 0 ? ( // ✅ Check if there are no movies
                <View style={styles.emptyContainer}>
                    <ThemedText style={styles.emptyText}>
                        {type === "watched"
                            ? "Você ainda não marcou nenhum filme como assistido."
                            : "Você ainda não favoritou nenhum filme."}
                    </ThemedText>
                </View>
            ) : (
                <FlatList
                    style={{ backgroundColor: Colors.dark.background }}
                    ref={listRef}
                    data={movies}
                    renderItem={renderMovie}
                    keyExtractor={(item) => (item?.id ? item.id.toString() : Math.random().toString())}
                    numColumns={2}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    removeClippedSubviews={true}
                    windowSize={5}
                />
            )}
        </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        flex: 1.5,
        flexDirection:'row',
        alignItems: "flex-end",
        justifyContent: "flex-end",
        backgroundColor: Colors.dark.background,
    },
    backButton: {
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 60,
        left: 0,
        backgroundColor: Colors.dark.tabIconSelected,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    container: {
        flex: 10,
        padding: 0,
        marginTop: 15,
        backgroundColor: Colors.dark.background,
        alignItems:'center'
    },
    gridItem: {
        flex: 1,
        margin: 5,
        borderRadius: 10,
        overflow: "hidden",
        alignItems: "center",
    },
    posterImage: {
        width: Dimensions.get("window").width / 2.2,
        height: (Dimensions.get("window").width / 2.2) * 1.5,
        borderRadius: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        alignContent:'center',
        width: Dimensions.get('window').width - 90,
        backgroundColor: Colors.dark.background,
    },
    emptyText: {
        fontSize: 16,
        color: Colors.dark.text,
        textAlign: "center",
        opacity: .5
    },
});

export default UserListsScreen;
