import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import { FontAwesome } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { useAuth } from "./contexts/AuthContext";
import {
    connectWebSocket,
    disconnectWebSocket,
    joinGroupRoom,
    leaveGroupRoom,
    onWinnerReceived,
} from "./services/websocket";

type Movie = {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    vote_average: number;
    release_date: string;
};

type MatchRouteParams = {
    groupId: number;
    movieId?: number;
    filter?: string;
};

type RootStackParamList = {
    history: { groupId: number };
    groups: { groupId: number };
    match_voting: { groupId: number };
};

type GroupsNavigationProp = RouteProp<RootStackParamList, "groups">;

const MatchVotingScreen = ({ navigation }: { navigation: any }) => {
    navigation = useNavigation();
    const [modalVisibleAlert, setModalVisibleAlert] = useState(false);
    const [modalTypeAlert, setModalTypeAlert] = useState<
        "error" | "success" | "alert"
    >("alert");
    const [modalMessageAlert, setModalMessageAlert] = useState<string>("");
    const route = useRoute();
    const { groupId, movieId, filter } = route.params as MatchRouteParams;
    const { authToken, userId } = useAuth();
    const screenWidth = Dimensions.get("window").width;
    const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [winner, setWinner] = useState<Movie | null>(null);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const modalizeRef = useRef<Modalize>(null);
    const [ingressoURL, setIngressoURL] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [fontsLoaded] = useFonts({
        CoinyRegular: require("../assets/fonts/Coiny-Regular.ttf"),
    });
    const [isPosterLoading, setIsPosterLoading] = useState(true);
    const [isIngressoLoading, setIsIngressoLoading] = useState(false);

    // Fpega recomendacao de filmes ou filtro

    const fetchRecommendations = async (page: number) => {
        try {
            let endpoint = "";

            if (filter) {
                endpoint = `${URL_LOCALHOST}/movies/${filter}?page=${page}`;
            } else if (groupId) {
                endpoint = `${URL_LOCALHOST}/match/${groupId}/recommendations?page=${page}`;
            } else {
                console.log("endpoint", endpoint);
                throw new Error("Neither movieId nor filter is provided.");
            }

            console.log("Fetching recommendations from endpoint:", endpoint);

            const response = await fetch(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch recommendations");
            }

            const data = await response.json();
            const movieArray = data.results || data.movies || data;

            if (!movieArray || !Array.isArray(movieArray)) {
                throw new Error("Invalid recommendations data");
            }

            setRecommendations((prev) => [...prev, ...movieArray]);
            setCurrentMovie(movieArray[0] || null);
            setTotalPages(data.total_pages || 1); // paginacao
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setIsFetchingMore(false);
            setIsLoading(false);
        }
    };

    const loadMoreMovies = () => {
        if (currentPage < totalPages && !isFetchingMore) {
            setIsFetchingMore(true);
            setCurrentPage((prev) => prev + 1);
            fetchRecommendations(currentPage + 1);
        }
    };

    const handleVote = async (liked: boolean) => {
        if (winner) {
            console.log("Votação concluida.");
            return; // para a votacao apos concluir
        }

        try {
            const nextIndex =
                recommendations.findIndex(
                    (movie) => movie.id === currentMovie?.id
                ) + 1;

            if (nextIndex < recommendations.length) {
                setCurrentMovie(recommendations[nextIndex]);
            } else if (currentPage < totalPages) {
                loadMoreMovies();
            } else {
                setCurrentMovie(null);
            }

            const response = await fetch(
                `${URL_LOCALHOST}/match/${groupId}/vote`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({
                        groupId,
                        userId,
                        movieId: currentMovie?.id,
                        liked,
                    }),
                }
            );

            if (!response.ok) {
                console.log(response);
                throw new Error("Failed to vote for movie");
            }

            const voteResult = await response.json();
            if (voteResult.winner) {
                setWinner(voteResult.winner);
            } else if (nextIndex < recommendations.length) {
                setCurrentMovie(recommendations[nextIndex]);
            } else {
                setCurrentMovie(null);
            }
        } catch (error) {
            console.error("Error voting:", error);
        }
    };

    const fetchGroupLatLng = async (
        groupId: number
    ): Promise<{ lat: number; lng: number } | null> => {
        try {
            const response = await fetch(
                `${URL_LOCALHOST}/geolocation/${groupId}/midpoint`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (!response.ok) {
                console.log("Failed to fetch group's latitude and longitude.");
                // throw new Error(
                //     "Failed to fetch group's latitude and longitude."
                // );
            }

            const data = await response.json();
            return data.midpoint;
        } catch (error: any) {
            console.log(
                "Error fetching group's latitude and longitude:",
                error.message
            );
            return null;
        }
    };

    const fetchCityId = async (
        lat: number,
        lng: number
    ): Promise<string | null> => {
        try {
            const url = `${URL_LOCALHOST}/ingresso/lat/${lat}/lng/${lng}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Failed to fetch city ID.");
            }

            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                return data[0].id;
            }

            return null;
        } catch (error: any) {
            console.error("Error fetching city ID:", error.message);
            return null;
        }
    };

    const fetchIngressoURL = async (groupId: number) => {
        if (filter === "now_playing" && winner && winner.title) {
            try {
                setIsIngressoLoading(true);
                const groupLatLng = await fetchGroupLatLng(groupId);

                if (!groupLatLng) {
                    throw new Error(
                        "Não foi possível pegar latitude e longitude."
                    );
                }

                const cityId = await fetchCityId(
                    groupLatLng.lat,
                    groupLatLng.lng
                );

                if (!cityId) {
                    throw new Error("Não foi possivel pegar ID de cidade.");
                }

                const response = await fetch(
                    `${URL_LOCALHOST}/ingresso/city/${cityId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data from ingresso.com.");
                }

                const data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error("Invalid data from ingresso.com.");
                }

                const matchedMovie = data.find(
                    (item) =>
                        item.event &&
                        item.event.title &&
                        item.event.title.toLowerCase().trim() ===
                            winner.title.toLowerCase().trim()
                );

                if (matchedMovie) {
                    const { siteURL, urlKey } = matchedMovie.event;
                    setIngressoURL(siteURL);
                    setModalMessageAlert(
                        "Localização com cinemas próximos! Clique em Ingresso para saber mais!"
                    );
                    setModalTypeAlert("success");
                    setModalVisibleAlert(true);
                } else {
                    setModalMessageAlert(
                        "Filme não encontrado no ingresso.com."
                    );
                    setModalTypeAlert("alert");
                    setModalVisibleAlert(true);
                    return false;
                }
            } catch (error: any) {
                console.error(
                    "Error fetching ingresso.com data:",
                    error.message
                );

                const fallbackUrlKey = winner?.title
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/:/g, "");
                setIngressoURL(
                    `https://www.ingresso.com/filme/${
                        fallbackUrlKey || "unknown"
                    }?partnership=home`
                );
                console.log(fallbackUrlKey);
                setModalMessageAlert(
                    "Erro calcular sua localização, redirecionando para página padrão do ingresso.com."
                );
                setModalTypeAlert("alert");
                setModalVisibleAlert(true);
            } finally {
                setIsIngressoLoading(false);
            }
        }
    };

    useEffect(() => {
        const socketInstance = connectWebSocket(userId);

        if (socketInstance.connected) {
            joinGroupRoom(groupId);
        } else {
            console.error("WebSocket connection failed to establish.");
        }

        joinGroupRoom(groupId);

        onWinnerReceived((winnerData) => {
            console.log("Winner received:", winnerData);
            setWinner(winnerData); // setar o ganhador
            setRecommendations([]); // apagar recomendações restantes
        });

        setCurrentPage(1); // resetar para pagina 1
        setRecommendations([]);
        fetchRecommendations(1);

        fetchIngressoURL(groupId); // usando group id para pegar usuarios e calcular lat long e dps usar pra pegar cityId e usar no endpoint do ingresso.com

        return () => {
            leaveGroupRoom(groupId);
            disconnectWebSocket();
        };
    }, [movieId, filter, groupId, winner]);

    const openMovieDetailsModal = (movie: Movie) => {
        console.log(movie);
        setSelectedMovie(movie);
        modalizeRef.current?.open();
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={Colors.dark.tabIconSelected}
                />
            </View>
        );
    }

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }

    const homePage = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: "(tabs)" }],
        });
    };

    const ingressoRedirect = (url: any) => {
        Linking.openURL(url);
        navigation.reset({
            index: 0,
            routes: [{ name: "(tabs)" }],
        });
    };

    if (isIngressoLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color={Colors.dark.tabIconSelected}
                />
            </View>
        );
    }

    if (winner) {
        return (
            <View style={styles.container}>
                <Text style={styles.winnerText}>MATCH ENCONTRADO</Text>
                {isPosterLoading && (
                    <ActivityIndicator
                        style={styles.posterLoader}
                        size="large"
                        color={Colors.dark.tabIconSelected}
                    />
                )}
                <Image
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${winner.poster_path}`,
                    }}
                    onLoadStart={() => setIsPosterLoading(true)}
                    onLoad={() => setIsPosterLoading(false)}
                    style={styles.poster}
                />
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={[
                            styles.buttonEnd,
                            ingressoURL ? styles.buttonEndHalf : undefined,
                        ]}
                        onPress={() => homePage()}
                    >
                        <ThemedText type="title" style={{ fontSize: 24 }}>
                            Finalizar
                        </ThemedText>
                    </Pressable>
                    {ingressoURL && (
                        <Pressable
                            style={styles.buttonIngresso}
                            onPress={() => ingressoRedirect(ingressoURL)}
                        >
                            <ThemedText type="title" style={{ fontSize: 18 }}>
                                Ingresso
                            </ThemedText>
                        </Pressable>
                    )}
                </View>
                <AlertModal
                    type={modalTypeAlert}
                    message={modalMessageAlert}
                    visible={modalVisibleAlert}
                    onClose={() => setModalVisibleAlert(false)}
                />
            </View>
        );
    }

    if (!currentMovie) {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    style={styles.posterLoader}
                    size="large"
                    color={Colors.dark.tabIconSelected}
                />
            </View>
        );
    }

    if (!currentMovie) {
        return (
            <View style={styles.container}>
                <ActivityIndicator
                    style={styles.posterLoader}
                    size="large"
                    color={Colors.dark.tabIconSelected}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isPosterLoading && (
                <ActivityIndicator
                    style={styles.posterLoader}
                    size="large"
                    color={Colors.dark.tabIconSelected}
                />
            )}
            <Image
                source={{
                    uri: `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`,
                }}
                onLoadStart={() => setIsPosterLoading(true)}
                onLoad={() => setIsPosterLoading(false)}
                style={styles.poster}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleVote(false)}
                >
                    <FontAwesome
                        size={30}
                        name="times"
                        color={Colors.dark.background}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.infoButton}
                    onPress={() => openMovieDetailsModal(currentMovie)}
                >
                    <FontAwesome
                        size={20}
                        name="info"
                        color={Colors.dark.background}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleVote(true)}
                >
                    <FontAwesome
                        size={30}
                        name="check"
                        color={Colors.dark.background}
                    />
                </TouchableOpacity>
            </View>
            <Modalize
                ref={modalizeRef}
                adjustToContentHeight
                modalStyle={{ backgroundColor: "#343637" }}
                handleStyle={{
                    width: 100,
                    height: 5,
                    marginTop: 30,
                }}
            >
                {selectedMovie && (
                    <View style={styles.modalContent}>
                        <ThemedText
                            style={{
                                fontSize: 24,
                                marginTop: 20,
                                fontWeight: "600",
                            }}
                        >
                            Informações do filme
                        </ThemedText>
                        <View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                }}
                            >
                                <View>
                                    <Text style={styles.modalTitle}>
                                        {selectedMovie.title}
                                    </Text>
                                    <Text style={styles.modalDate}>
                                        {"Ano de lançamento: "}
                                        {selectedMovie.release_date.substring(
                                            0,
                                            selectedMovie.release_date.length -
                                                6
                                        )}
                                    </Text>
                                </View>
                                <Text style={styles.modalInfo}>
                                    {(selectedMovie.vote_average / 2).toFixed(
                                        2
                                    )}
                                    {"  "}
                                    <FontAwesome
                                        size={15}
                                        name="star"
                                        style={[
                                            styles.modalInfo,
                                            styles.modalInfoStar,
                                        ]}
                                    />
                                </Text>
                            </View>
                            <Text style={styles.modalOverview}>
                                {selectedMovie.overview}
                            </Text>
                        </View>
                    </View>
                )}
            </Modalize>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
        paddingTop: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    poster: {
        width: Dimensions.get("window").width - 20,
        height: 600,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 10,
    },
    buttonEnd: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 12,
        borderRadius: 8,
        elevation: 10,
        width: Dimensions.get("window").width - 20,
    },
    buttonEndHalf: {
        flex: 1,
        marginLeft: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: "#ccc",
        textAlign: "center",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    button: {
        width: 70,
        height: 70,
        elevation: 10,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.tabIconSelected,
        marginTop: 20,
    },
    infoButton: {
        width: 40,
        height: 40,
        elevation: 5,
        opacity: 0.8,
        borderRadius: 75,
        marginTop: 35,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.text,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    winnerText: {
        backgroundColor: Colors.dark.tabIconSelected,
        width: Dimensions.get("window").width,
        flexWrap: "wrap",
        textAlign: "center",
        fontSize: 36,
        color: Colors.dark.text,
        fontFamily: "CoinyRegular",
        marginBottom: 40,
        marginTop: 20,
    },
    buttonIngresso: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.dark.tabIconSelected,
        marginHorizontal: 5,
    },
    winnerImage: {
        width: 300,
        height: 450,
        borderRadius: 10,
        marginBottom: 20,
    },
    winnerTitle: {
        fontSize: 36,
        fontFamily: "CoinyRegular",
    },
    noMoviesContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noMoviesText: {
        fontSize: 18,
        color: "#fff",
    },
    modalContent: {
        padding: 20,
        alignItems: "center",
    },
    modalTitle: {
        marginTop: 20,
        fontSize: 24,
        fontWeight: "semibold",
        color: "white",
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    modalInfo: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "semibold",
        color: "white",
        alignSelf: "flex-start",
    },
    modalDate: {
        fontSize: 14,
        fontWeight: "semibold",
        color: Colors.dark.input,
        alignSelf: "flex-start",
        marginBottom: 5,
    },
    modalInfoStar: {
        color: Colors.dark.tabIconSelected,
    },
    modalOverview: {
        color: "white",
        textAlign: "left",
    },
    posterLoader: {
        position: "absolute",
        alignSelf: "center",
        top: "50%",
        zIndex: 1,
        color: Colors.dark.tabIconSelected,
    },
});

export default MatchVotingScreen;
