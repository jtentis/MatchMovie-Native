import { useAuth } from "@/app/contexts/AuthContext";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import { FontAwesome } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Modalize } from "react-native-modalize";

// Define the Movie type based on your API response
type Movie = {
    movidId: number;
    id: number;
    title: string;
    poster_path: string | null; // Poster path might be null
};

type MovieSelectionModalProps = {
    groupId: number;
    ref: React.Ref<Modalize>;
    onMovieSelect: (movie: Movie) => void; // Callback to pass the selected movie
};

const EXPO_PUBLIC_BASE_NGROK = URL_LOCALHOST;
const SEARCH_MOVIES_URL_API = `${EXPO_PUBLIC_BASE_NGROK}/movies/search`;

const MovieSelectionModal = React.forwardRef<
    Modalize,
    MovieSelectionModalProps
>(({ onMovieSelect, groupId }, ref) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [movies, setMovies] = useState<Movie[]>([]); // Explicitly set type to Movie[]
    const [isLoading, setIsLoading] = useState(false);
    const { userId, authToken } = useAuth();

    const fetchMovies = async (query: string) => {
        if (!query.trim() || query.trim().length < 3) {
            console.warn("Search query too short.");
            setMovies([]);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(
                `${SEARCH_MOVIES_URL_API}?search=${query}&page=1`
            );
            const data = await response.json();

            if (Array.isArray(data.results)) {
                const validatedMovies = data.results.map((movie: any) => ({
                    ...movie,
                    poster_path: movie.poster_path || null,
                }));
                setMovies(validatedMovies);
            } else {
                console.error("Unexpected API response:", data);
                setMovies([]);
            }
        } catch (error) {
            console.error("Error fetching movies:", error);
            setMovies([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMovieSelect = async (movie: Movie) => {
        try {
            console.log("teste", authToken, groupId);
            // Send movieId to the database
            const response = await fetch(`${URL_LOCALHOST}/groups/${groupId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ movieId: movie.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to update group with movieId");
            }

            const updatedGroup = await response.json();

            // Update parent state with the selected movie
            onMovieSelect(movie);
            onMovieSelect(movie); // Pass the selected movie to the parent component
            setSearchQuery("");
            setMovies([]);
            if (ref && "current" in ref) ref.current?.close(); // Close the modal
        } catch (error) {
            console.error("Error updating group with movieId:", error);
        }
    };

    return (
        <Modalize
            ref={ref}
            adjustToContentHeight // Allow the modal to expand fully
            modalStyle={{ backgroundColor: "#343637" }}
            handleStyle={{
                width: 100,
                height: 5,
                marginTop: 30,
            }}
            flatListProps={{
                data: movies,
                keyExtractor: (item) => item.id.toString(),
                numColumns: 2,
                renderItem: ({ item }) => (
                    <TouchableOpacity onPress={() => handleMovieSelect(item)}>
                        <View style={styles.gridItem}>
                            <Image
                                source={{
                                    uri: item.poster_path
                                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                        : "@/assets/images/No-Image-Placeholder.png", // Fallback image
                                }}
                                style={styles.poster}
                            />
                        </View>
                    </TouchableOpacity>
                ),
                contentContainerStyle: styles.flatListContent,
                ListHeaderComponent: (
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            Selecione um filme para o grupo
                        </Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputWithButton}
                                placeholder="Digite o nome do filme..."
                                placeholderTextColor={Colors.dark.text}
                                cursorColor={Colors.dark.tabIconSelected}
                                value={searchQuery}
                                onChangeText={(text) => setSearchQuery(text)}
                                onSubmitEditing={() => fetchMovies(searchQuery)}
                            />
                            <TouchableOpacity
                                style={styles.searchButton}
                                onPress={() => fetchMovies(searchQuery)}
                            >
                                <Text style={styles.searchButtonText}><FontAwesome name={'search'} size={16}></FontAwesome></Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ),
                ListEmptyComponent: isLoading ? (
                    <ActivityIndicator
                        color={Colors.dark.tabIconSelected}
                        style={{ marginBottom: 20 }}
                    ></ActivityIndicator>
                ) : (
                    <Text style={styles.textLoading}>
                        Nenhum filme encontrado
                    </Text>
                ),
                showsVerticalScrollIndicator: false,
            }}
        />
    );
});

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
    },
    input: {
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        borderColor: Colors.dark.tabIconSelected,
        borderWidth: 1,
        elevation: 2,
        marginBottom: 20,
        color: "white",
    },
    movieItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    flatListContent: {
        alignContent: "center",
        padding: 0, // Add padding for better spacing
    },
    poster: {
        width: Dimensions.get("window").width / 2,
        height: (Dimensions.get("window").width / 2) * 1.5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        alignSelf: "center",
        marginTop: 30,
        color: "white",
    },
    gridItem: {
        flex: 1,
        padding: 0,
    },
    textLoading: {
        textAlign: "center",
        marginBottom: 20,
        color: "white",
        opacity: 0.4,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: Colors.dark.input,
        borderRadius: 8,
        borderColor: Colors.dark.tabIconSelected,
        borderWidth: 1,
        elevation: 2,
        marginBottom: 20,
        overflow: "hidden",
    },
    
    inputWithButton: {
        flex: 1,
        height: 50,
        paddingHorizontal: 15,
        color: "white",
    },
    
    searchButton: {
        height: 50,
        width: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.tabIconSelected,
    },
    
    searchButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default MovieSelectionModal;
