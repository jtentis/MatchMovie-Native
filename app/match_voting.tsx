import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import { FontAwesome } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ImageBackground,
    Linking,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
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
    const [ingressoText, setIngressoText] = useState<string>("");
    const [ingressoTextPadding, setIngressoTextPadding] = useState<number>(30);
    const route = useRoute();
    const { groupId, movieId, filter } = route.params as MatchRouteParams;
    const { authToken, userId } = useAuth();
    const [showConfetti, setShowConfetti] = useState(false);
    const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [winner, setWinner] = useState<Movie | null>(null);
    const [selectedMovie, setSelectedMovie] = useState<Movie | any>(null);
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
                const items = data.items;
                // console.log('teste', items)

                if (!Array.isArray(items)) {
                    throw new Error("Invalid data from ingresso.com.");
                }

                const matchedMovie = items.find(
                    (item) =>
                        item.title &&
                        item.title.toLowerCase().trim() ===
                            winner.title.toLowerCase().trim()
                );

                if (matchedMovie) {
                    const { siteURL, urlKey } = matchedMovie;
                    setIngressoURL(siteURL);
                    // setModalMessageAlert(
                    //     "Localização com cinemas próximos! Clique em Ingresso para saber mais!"
                    // );
                    // setModalTypeAlert("success");
                    // setModalVisibleAlert(true);
                    setIngressoText(
                        "Sua localização possui cinemas próximos! Clique em Ingresso para saber mais!"
                    );
                    setIngressoTextPadding(0);
                } else {
                    // setModalMessageAlert(
                    //     "Filme não encontrado no ingresso.com."
                    // );
                    // setModalTypeAlert("alert");
                    // setModalVisibleAlert(true);
                    setIngressoText("Filme não encontrado no ingresso.com.");
                    setIngressoTextPadding(0);
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
                // setModalMessageAlert(
                //     "Erro calcular sua localização, redirecionando para página padrão do ingresso.com."
                // );
                // setModalTypeAlert("alert");
                // setModalVisibleAlert(true);
                setIngressoText(
                    "Erro calcular sua localização, redirecionando para página padrão do ingresso.com."
                );
                setIngressoTextPadding(0);
            } finally {
                setIsIngressoLoading(false);
            }
        }
    };

    useEffect(() => {
        connectWebSocket(userId);

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

        if (winner) {
            setShowConfetti(true);
        }

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
            <ActivityIndicator
                size="large"
                color={Colors.dark.tabIconSelected}
                style={{
                    flex: 1,
                    alignContent: "center",
                    backgroundColor: Colors.dark.background,
                }}
            />
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
                {showConfetti && (
                    <View style={styles.confettiContainer}>
                        <ConfettiCannon
                            count={100}
                            origin={{ x: -10, y: 0 }}
                            fadeOut={true}
                            onAnimationEnd={() => setShowConfetti(false)}
                        />
                    </View>
                )}
                {winner && (
                    <>
                        {isPosterLoading && (
                            <ActivityIndicator
                                style={styles.posterLoader}
                                size="large"
                                color={Colors.dark.tabIconSelected}
                            />
                        )}
                        <View
                            style={{
                                borderWidth: 2,
                                borderColor: Colors.dark.tabIconSelected,
                                borderRadius: 10,
                                height: 614,
                            }}
                        >
                            <ImageBackground
                                borderRadius={10}
                                source={{
                                    uri: `https://image.tmdb.org/t/p/w500${winner.poster_path}`,
                                }}
                                onLoadStart={() => setIsPosterLoading(true)}
                                onLoad={() => setIsPosterLoading(false)}
                                style={[styles.poster, styles.winnerPoster]}
                            >
                                <Text style={styles.winnerText}>
                                    <Text style={{ color: "white" }}>
                                        It's a{" "}
                                    </Text>
                                    Match!
                                </Text>
                                <Text style={styles.titleImage}>
                                    {winner.title}
                                </Text>
                                <View
                                    style={[
                                        styles.buttonContainer,
                                        styles.buttonContainer2,
                                    ]}
                                >
                                    <Pressable
                                        style={[styles.buttonEnd]}
                                        onPress={() => homePage()}
                                    >
                                        <ThemedText
                                            type="title"
                                            style={{ fontSize: 18 }}
                                        >
                                            Finalizar
                                        </ThemedText>
                                    </Pressable>
                                    {ingressoURL && (
                                        <Pressable
                                            style={styles.buttonEnd}
                                            onPress={() =>
                                                ingressoRedirect(ingressoURL)
                                            }
                                        >
                                            <ThemedText
                                                type="title"
                                                style={{ fontSize: 18 }}
                                            >
                                                Ingresso
                                            </ThemedText>
                                        </Pressable>
                                    )}
                                </View>
                                <LinearGradient
                                    colors={[
                                        "rgba(0,0,0,0.9)",
                                        "rgba(0,0,0,0)",
                                    ]}
                                    start={{ x: 0.5, y: 1 }}
                                    end={{ x: 0.5, y: 0 }}
                                    style={styles.innerShadow}
                                />
                            </ImageBackground>
                        </View>
                        <View style={{ paddingTop: ingressoTextPadding }}>
                            {ingressoText && (
                                <Text style={[styles.endText, styles.set]}>
                                    {ingressoText}
                                </Text>
                            )}
                            <Text> </Text>
                            <Text style={styles.endText}>
                                O grupo chegou em um denominador comum e elegeu
                                o filme
                                <Text
                                    style={{
                                        color: Colors.dark.tabIconSelected,
                                    }}
                                >
                                    {" "}
                                    {winner.title}{" "}
                                </Text>
                                para assistir!
                            </Text>
                            <Text> </Text>
                            <Text style={styles.endText}>
                                Seu
                                <Text
                                    style={{
                                        color: Colors.dark.tabIconSelected,
                                    }}
                                >
                                    {" "}
                                    Match{" "}
                                </Text>
                                ficará salvo no histórico do grupo.
                            </Text>
                        </View>
                        <AlertModal
                            type={modalTypeAlert}
                            message={modalMessageAlert}
                            visible={modalVisibleAlert}
                            onClose={() => setModalVisibleAlert(false)}
                        />
                    </>
                )}
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
            {currentMovie && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "space-around",
                        alignItems: "center",
                    }}
                >
                    <ThemedText type="defaultSemiBold" style={styles.titlePage}>
                        Votação
                    </ThemedText>
                    <ImageBackground
                        imageStyle={{ borderRadius: 10 }}
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`,
                        }}
                        onLoadStart={() => setIsPosterLoading(true)}
                        onLoad={() => setIsPosterLoading(false)}
                        style={[styles.poster, styles.votePoster]}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 28,
                                color: "white",
                                padding: 25,
                                zIndex: 1,
                                flexWrap: "wrap",
                                maxWidth: 240,
                            }}
                        >
                            {currentMovie.title}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 28,
                                color: "white",
                                padding: 25,
                                zIndex: 1,
                            }}
                        >
                            {(currentMovie.vote_average / 2).toFixed(2)}
                            {"  "}
                            <FontAwesome
                                size={15}
                                name="star"
                                style={[styles.modalInfo, styles.modalInfoStar]}
                            />
                        </Text>
                        <LinearGradient
                            colors={["rgba(0,0,0,0.9)", "rgba(0,0,0,0)"]}
                            start={{ x: 0.5, y: 1 }}
                            end={{ x: 0.5, y: 0 }}
                            style={styles.innerShadow}
                        />
                    </ImageBackground>
                </View>
            )}
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
                        <View style={{ marginTop: 20 }}>
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
    },
    titlePage: {
        marginTop: 60,
        fontSize: 40,
        color: "white",
        paddingVertical: 20,
        backgroundColor: Colors.dark.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    poster: {
        width: Dimensions.get("window").width - 20,
        height: 590,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 10,
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexDirection: "column",
    },
    votePoster: {
        flexDirection: "row",
    },
    titleImage: {
        position: "absolute",
        bottom: 70,
        fontWeight: "bold",
        fontSize: 28,
        color: "white",
        padding: 25,
        zIndex: 1,
        flexWrap: "wrap",
        minWidth: Dimensions.get("window").width - 20,
        textAlign: "center",
    },
    winnerPoster: {
        height: 610,
    },
    buttonEnd: {
        width: 130,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
        padding: 8,
        borderRadius: 8,
        zIndex: 1,
    },
    buttonContainer: {
        height: 100,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        width: "100%",
    },
    buttonContainer2: {
        marginBottom: 0,
    },
    button: {
        width: 70,
        height: 70,
        elevation: 10,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.tabIconSelected,
    },
    infoButton: {
        width: 40,
        height: 40,
        elevation: 5,
        opacity: 0.8,
        borderRadius: 75,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.text,
    },
    winnerText: {
        backgroundColor: Colors.dark.background,
        width: Dimensions.get("window").width - 20,
        flexWrap: "wrap",
        textAlign: "center",
        fontSize: 36,
        color: Colors.dark.tabIconSelected,
        fontFamily: "CoinyRegular",
        marginBottom: 40,
        marginTop: 20,
    },
    endText: {
        fontSize: 18,
        color: "white",
        fontWeight: "500",
        textAlign: "center",
        paddingHorizontal: 10,
    },
    set: {
        width: Dimensions.get("window").width - 20,
        borderColor: Colors.dark.input,
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        alignSelf: "center",
        marginTop: 10,
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
    confettiContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 111,
        pointerEvents: "none",
    },
    innerShadow: {
        ...StyleSheet.absoluteFillObject, // Fill the entire image
        borderRadius: 10, // Match the borderRadius of the ImageBackground
    },
});

export default MatchVotingScreen;
