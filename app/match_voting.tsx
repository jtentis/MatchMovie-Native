import { URL_LOCALHOST } from "@/constants/Url";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "./contexts/AuthContext";
import {
    connectWebSocket,
    disconnectWebSocket,
    onWinnerReceived
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

const MatchVotingScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { groupId, movieId } = route.params as MatchRouteParams;
    const { authToken, userId } = useAuth();

    const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [winner, setWinner] = useState<Movie | null>(null);

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
    
        onWinnerReceived((winnerData) => {
            console.log("Winner received:", winnerData);
            setWinner(winnerData); // Set the winner in state for all users
            setRecommendations([]); // Clear remaining recommendations
        });
    
        fetchRecommendations();
    
        return () => {
            disconnectWebSocket();
        };
    }, [movieId, groupId]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (winner) {
        return (
            <View style={styles.winnerContainer}>
                <Text style={styles.winnerText}>🎉 The winner is:</Text>
                <Image
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${winner.poster_path}`,
                    }}
                    style={styles.winnerImage}
                />
                <Text style={styles.winnerTitle}>{winner.title}</Text>
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
            <Text style={styles.title}>{currentMovie.title}</Text>
            <Text style={styles.description}>{currentMovie.overview}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.dislikeButton]}
                    onPress={() => handleVote(false)}
                >
                    <Text style={styles.buttonText}>👎 Dislike</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.likeButton]}
                    onPress={() => handleVote(true)}
                >
                    <Text style={styles.buttonText}>👍 Like</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    poster: {
        width: 300,
        height: 450,
        borderRadius: 10,
        marginBottom: 20,
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
        justifyContent: "space-between",
        width: "100%",
    },
    button: {
        padding: 15,
        borderRadius: 10,
        width: "45%",
        alignItems: "center",
    },
    likeButton: {
        backgroundColor: "#4CAF50",
    },
    dislikeButton: {
        backgroundColor: "#F44336",
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
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
    },
    winnerImage: {
        width: 300,
        height: 450,
        borderRadius: 10,
        marginBottom: 20,
    },
    winnerTitle: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#4CAF50",
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
});

export default MatchVotingScreen;
