import AlertModal from "@/components/ModalAlert";
import ConfirmModal from "@/components/ModalAlertConfirm";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "../components/ThemedText";
import { useAuth } from "./contexts/AuthContext";

type Match = {
    id: number;
    groupId: number;
    movieId: number;
    createdAt: string;
};

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
};

type RootStackParamList = {
    history: { groupId: number };
    groups: { groupId: number };
    match_voting: { groupId: number };
};

type GroupsNavigationProp = RouteProp<RootStackParamList, "groups">;

const HistoryScreen = ({ navigation }: { navigation: any }) => {
    const route = useRoute<GroupsNavigationProp>();
    const { groupId } = route.params;
    const { authToken } = useAuth();
    const [groupName, setGroupName] = useState<string>("");
    const [groupImage, setGroupImage] = useState<string | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [movies, setMovies] = useState<Record<number, Movie>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [modalMessage, setModalMessage] = useState<string>("");
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);

    navigation = useNavigation();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const groupResponse = await fetch(
                    `${URL_LOCALHOST}/groups/${groupId}`,
                    {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }
                );
                if (!groupResponse.ok) {
                    throw new Error("Failed to fetch group data");
                }
                const groupData = await groupResponse.json();
                setGroupName(groupData.name);
                setGroupImage(groupData.image);

                const matchesResponse = await fetch(
                    `${URL_LOCALHOST}/match/${groupId}/history`,
                    {
                        headers: { Authorization: `Bearer ${authToken}` },
                    }
                );
                if (!matchesResponse.ok) {
                    throw new Error("Failed to fetch match history");
                }
                const matchesData: Match[] = await matchesResponse.json();
                setMatches(matchesData);

                // Fetch movie details for each match
                const movieDetails: any = {};
                for (const match of matchesData) {
                    const movieResponse = await fetch(
                        `${URL_LOCALHOST}/movies/${match.movieId}/details`,
                        {
                            headers: { Authorization: `Bearer ${authToken}` },
                        }
                    );
                    if (movieResponse.ok) {
                        const movieData: Movie = await movieResponse.json();
                        movieDetails[match.movieId] = movieData;
                    }
                }
                setMovies(movieDetails);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, [groupId]);

    const handleDelete = async () => {
        if (!selectedMatchId) return;

        try {
            const response = await fetch(
                `${URL_LOCALHOST}/match/${selectedMatchId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete match");
            }

            // atualiza state local apos deletar
            setMatches((prev) =>
                prev.filter((match) => match.id !== selectedMatchId)
            );
            setIsConfirmVisible(false);
            setSelectedMatchId(null);
            setModalMessage("Match deletado com sucesso!");
            setModalType("success");
            setModalVisible(true);
        } catch (error) {
            console.error("Error deleting match:", error);
        }
    };

    if (isLoading) {
        return <ActivityIndicator size="large" color={Colors.dark.tabIconSelected} style={{flex:1, alignContent:'center', backgroundColor:Colors.dark.background}} />;
    }

    const imageSource = groupImage
        ? { uri: groupImage }
        : require("@/assets/images/group_background.png");

    return (
        <View style={styles.mainContainer}>
            <View
                style={{
                    flex: 1 / 2,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: Colors.dark.background,
                    marginTop: 30,
                }}
            >
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <FontAwesome
                        size={30}
                        name="chevron-left"
                        color={Colors.dark.text}
                    />
                </Pressable>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        backgroundColor: Colors.dark.background,
                    }}
                >
                    <ThemedText type="subtitle" style={styles.groupName}>
                        {groupName}
                    </ThemedText>
                    <View style={styles.groupImage}>
                        <Image
                            source={imageSource}
                            style={styles.groupImage}
                        ></Image>
                    </View>
                </View>
            </View>
            <View
                style={{
                    flex: 3,
                    alignItems: "center",
                    backgroundColor: Colors.dark.background,
                    marginTop: 10,
                }}
            >
                <ThemedText type="title" style={{ marginBottom: 20 }}>
                    Histórico
                </ThemedText>
                <ScrollView
                    style={{
                        width: "100%",
                        height: "100%",
                        gap: 5,
                        padding: 0,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    {matches.length === 0 ? (
                        <View style={{ alignItems: "center", marginTop: 20 }}>
                            <ThemedText
                                type="default"
                                style={{ color: Colors.dark.text }}
                            >
                                Nenhum Match concluído. Sem histórico
                                disponível.
                            </ThemedText>
                        </View>
                    ) : (
                        matches.map((match) => {
                            const movie = movies[match.movieId];
                            return (
                                <View key={match.id} style={styles.card}>
                                    <View style={styles.poster}>
                                        <Image
                                            source={
                                                movie?.poster_path
                                                    ? {
                                                          uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                                                      }
                                                    : require("@/assets/images/No-Image-Placeholder.png")
                                            }
                                            style={styles.poster}
                                        />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <ThemedText
                                            type="default"
                                            style={styles.text}
                                        >
                                            Filme:{" "}
                                            {movie?.title ||
                                                "Título Desconhecido"}
                                        </ThemedText>
                                        <ThemedText
                                            type="default"
                                            style={styles.date}
                                        >
                                            Data do Match:{" "}
                                            {new Date(
                                                match.createdAt
                                            ).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </ThemedText>
                                        <FontAwesome
                                            size={20}
                                            name="trash"
                                            style={styles.trash}
                                            onPress={() => {
                                                setSelectedMatchId(match.id);
                                                setIsConfirmVisible(true);
                                            }}
                                        />
                                    </View>
                                </View>
                            );
                        })
                    )}
                </ScrollView>
                <AlertModal
                    type={modalType}
                    message={modalMessage}
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                />
                <ConfirmModal
                    type="alert"
                    visible={isConfirmVisible}
                    onConfirm={handleDelete}
                    onCancel={() => setIsConfirmVisible(false)}
                    message="Tem certeza que deseja excluir este match?"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: Colors.dark.background,
        gap: 10,
    },
    backButton: {
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.background,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    groupImage: {
        width: 50,
        height: 50,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        elevation: 2,
    },
    groupName: {
        height: 50,
        paddingVertical: 13,
        paddingHorizontal: 10,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        backgroundColor: Colors.dark.tabIconSelected,
    },
    poster: {
        width: 70,
        height: 100,
        borderRadius: 5,
        elevation: 2,
    },
    card: {
        flexDirection: "row",
        width: "100%",
        backgroundColor: "#414344",
        marginTop: 5,
        padding: 5,
        elevation: 5,
        borderRadius: 5,
    },
    date:{
        fontSize: 12,
        position:'absolute',
        opacity: .7,
        alignSelf: 'flex-end',
        bottom: 1,
        right: 5,
    },
    text: {
        flexWrap: 'wrap',
        maxWidth: 250,
        marginLeft: 10,
    },
    trash: {
        position: "absolute",
        right: 5,
        top: 5,
        color: Colors.dark.tabIconSelected,
        opacity: 0.6,
    },
});

export default HistoryScreen;
