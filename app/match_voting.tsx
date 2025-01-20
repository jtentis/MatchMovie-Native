import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import { FontAwesome } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useFonts } from "expo-font";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
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
};

type MatchRouteParams = {
    groupId: number;
    movieId: number;
};

type RootStackParamList = {
    history: { groupId: number };
    groups: { groupId: number };
    match_voting: { groupId: number };
};

type GroupsNavigationProp = RouteProp<RootStackParamList, "groups">;

const MatchVotingScreen = ({ navigation }: { navigation: any }) => {
    navigation = useNavigation();
    const route = useRoute();
    const { groupId, movieId } = route.params as MatchRouteParams;
    const { authToken, userId } = useAuth();

    const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [winner, setWinner] = useState<Movie | null>(null);
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const modalizeRef = useRef<Modalize>(null);
    const [fontsLoaded] = useFonts({
        CoinyRegular: require("../assets/fonts/Coiny-Regular.ttf"),
    });

    // Fetch movie recommendations

    const fetchRecommendations = async () => {
        try {
            if (!movieId) {
                throw new Error("Movie ID is not provided.");
            }

            if (!groupId) {
                throw new Error("Group ID is not provided.");
            }

            setIsLoading(true);

            const response = await fetch(
                `${URL_LOCALHOST}/match/${groupId}/recommendations`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch recommendations");
            }

            const data = await response.json();

            if (!data || !Array.isArray(data)) {
                throw new Error("Invalid recommendations data");
            }

            setRecommendations(data);
            setCurrentMovie(data[0] || null); // Set the first movie, or null if none
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle voting
    const handleVote = async (liked: boolean) => {
        if (winner) {
            console.log("Match already completed. No more votes allowed.");
            return; // Prevent voting after the match is completed
        }

        try {
            const nextIndex =
                recommendations.findIndex(
                    (movie) => movie.id === currentMovie?.id
                ) + 1;

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

    useEffect(() => {
        const socket = connectWebSocket(userId);

        joinGroupRoom(groupId);

        onWinnerReceived((winnerData) => {
            console.log("Winner received:", winnerData);
            setWinner(winnerData); // Set the winner in state for all users
            setRecommendations([]); // Clear remaining recommendations
        });

        fetchRecommendations();

        return () => {
            leaveGroupRoom(groupId); // Leave the room when navigating away
            disconnectWebSocket();
            disconnectWebSocket(false);
        };
    }, [movieId, groupId]);

    const openMovieDetailsModal = (movie: Movie) => {
        console.log(movie);
        setSelectedMovie(movie); // Set the selected movie
        setModalVisible(true); // Open the modal
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!fontsLoaded) {
        return <Text>Carregando fontes...</Text>;
    }

    const homePage = () => {
        navigation.navigate("(tabs)");
    }

    if (winner) {
        return (
            <View style={styles.container}>
                <Text style={styles.winnerText}>O FILME VENCEDOR É:</Text>
                <Image
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${winner.poster_path}`,
                    }}
                    style={styles.poster}
                />
                <Pressable
                        style={styles.buttonMatch}
                        onPress={() => homePage()}
                    >
                        <ThemedText type="title" style={{ fontSize: 24 }}>
                            Finalizar 
                        </ThemedText>
                    </Pressable>
            </View>
        );
    }

    if (!currentMovie) {
        return (
            <View style={styles.noMoviesContainer}>
                <Text style={styles.noMoviesText}>
                    No more movies to vote on!
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={{
                    uri: `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`,
                }}
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
                    onPress={() => openMovieDetailsModal(currentMovie)} // Open modal on info button press
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

            {/* Movie Details Modal */}
            <Modalize
                ref={modalizeRef}
                onClosed={() => setModalVisible(false)} // Close modal when done
                adjustToContentHeight
                modalStyle={{ backgroundColor: "#343637" }}
            >
                {selectedMovie && (
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {selectedMovie.title}
                        </Text>
                        <Image
                            source={{
                                uri: `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`,
                            }}
                            style={styles.modalPoster}
                        />
                        <Text style={styles.modalOverview}>
                            {selectedMovie.overview}
                        </Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    poster: {
        width: 380,
        height: 600,
        borderRadius: 10,
        marginBottom: 60,
        elevation: 10,
    },
    buttonMatch: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 12,
        borderRadius: 8,
        elevation: 10,
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
    },
    infoButton: {
        width: 40,
        height: 40,
        elevation: 5,
        opacity: 0.8,
        borderRadius: 75,
        marginTop: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.text,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    winnerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    winnerText: {
        fontSize: 36,
        color: Colors.dark.tabIconSelected,
        fontFamily:"CoinyRegular",
        marginBottom: 5,
        marginTop: 20,
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
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 10,
    },
    modalPoster: {
        width: 200,
        height: 300,
        borderRadius: 10,
        marginBottom: 10,
    },
    modalOverview: {
        color: "white",
        textAlign: "center",
    },
});

export default MatchVotingScreen;
