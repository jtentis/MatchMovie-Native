import { AddUserBottomSheet } from "@/components/AddUserBottomSheet";
import { ChangeGroupBottomSheet } from "@/components/ChangeGroupImageBottomSheet";
import AlertModal from "@/components/ModalAlert";
import ConfirmModal from "@/components/ModalAlertConfirm";
import MovieSelectionModal from "@/components/MovieSelectionBottomSheet";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { CommonActions, RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Modalize } from "react-native-modalize";
import { ThemedText } from "../components/ThemedText";
import { useAuth } from "./contexts/AuthContext";
import {
    connectWebSocket,
    disconnectWebSocket,
    joinGroupRoom,
    leaveGroupRoom,
    onGroupDeleted,
    onGroupUpdate,
} from "./services/websocket";

type User = {
    id: number;
    name: string;
    second_name: string;
    user: string;
};

type GroupUser = {
    id: number;
    userId: number;
    groupId: number;
    user: User;
};

type Group = {
    id: number;
    name: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    movieId: number | null;
    users: GroupUser[];
};

type RootStackParamList = {
    history: { groupId: number };
    groups: { groupId: number };
    match_voting: { groupId: number };
    "(tabs)": { screen: "match" };
};

type GroupsNavigationProp = RouteProp<RootStackParamList, "groups">;

const GroupsScreen = ({ navigation }: { navigation: any }) => {
    navigation = useNavigation();
    const route = useRoute<GroupsNavigationProp>();
    const { groupId } = route.params;
    const { authToken, userId } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const addUserModalRef = useRef<Modalize>(null);
    const changeImageModalRef = useRef<Modalize>(null);
    const movieSelectionModalRef = useRef<Modalize>(null);
    const [selectedMovie, setSelectedMovie] = useState<any>(null);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [isConfirmUserVisible, setIsConfirmUserVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | any>(null);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [modalMessage, setModalMessage] = useState<string>("");

    const openMovieSelectionModal = () => {
        movieSelectionModalRef.current?.open();
    };

    const handleDelete = async () => {
        if (!groupId || !selectedUserId) return;

        if (selectedUserId == userId) {
            setIsConfirmUserVisible(false);
            setModalType("error");
            setModalMessage("Você não pode se excluir do grupo.");
            setModalVisible(true);
            return;
        }

        try {
            const response = await fetch(
                `${URL_LOCALHOST}/groups/${groupId}/users/${selectedUserId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );

            if (!response.ok) {
                throw new Error("Falha.");
            }

            // Update group state after deletion
            setGroup((prevGroup) => {
                if (!prevGroup) return prevGroup;
                return {
                    ...prevGroup,
                    users: prevGroup.users.filter(
                        (user) => user.userId !== selectedUserId
                    ),
                };
            });

            setIsConfirmUserVisible(false);
            setSelectedUserId(null);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    // Trigger modal on long press
    const handleLongPress = (userId: number) => {
        setSelectedUserId(userId);
        setIsConfirmUserVisible(true);
    };

    const handleFilterSelect = (filter: string) => {
        if (selectedFilter === filter) {
            setSelectedFilter(null);
        } else {
            setSelectedFilter(filter);
        }
        setSelectedMovie(null);
    };

    const handleMovieSelect = async (movie: any) => {
        try {
            const response = await fetch(`${URL_LOCALHOST}/groups/${groupId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ movieId: movie.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to update group with selected movie");
            }

            // atualizando group state com o novo filme
            const updatedGroup = await response.json();
            setGroup(updatedGroup);
            setSelectedMovie(movie);
            setSelectedFilter(null);

            onGroupUpdate((data) => {
                if (data.groupId === groupId) {
                    setGroup(data);
                }
            });
        } catch (error) {
            console.error("Error updating group with selected movie:", error);
        } finally {
            // fechando o modal dps de selecionar filme
            if (movieSelectionModalRef && "current" in movieSelectionModalRef) {
                movieSelectionModalRef.current?.close();
            }
        }
    };

    const openAddUserModal = () => {
        addUserModalRef.current?.open();
    };

    const openChangeImageModal = () => {
        changeImageModalRef.current?.open();
    };

    const handleSave = async (modalData: { name?: string; image?: string }) => {
        const response = await fetch(`${URL_LOCALHOST}/groups/${groupId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(modalData),
        });

        if (!response.ok) {
            // console.log(response)
            throw new Error("Failed to update the group");
        }
        // console.log(response)
        const updatedGroup = await response.json();
        setGroup(updatedGroup);

        onGroupUpdate((data) => {
            if (data.groupId === groupId) {
                setGroup(data);
            }
        });
    };

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const response = await fetch(
                    `${URL_LOCALHOST}/groups/${groupId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${authToken}`,
                        },
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch group data");
                }
                const data: Group = await response.json();
                setGroup(data);
                console.log(data.movieId);
                if (data.movieId) {
                    const movieResponse = await fetch(
                        `${URL_LOCALHOST}/movies/${data.movieId}/details`
                    );
                    if (movieResponse.ok) {
                        const movieData = await movieResponse.json();
                        const poster_path = movieData.poster_path;
                        if (selectedFilter) {
                            return;
                        }
                        if (poster_path) {
                            setSelectedMovie({ poster_path: poster_path });
                        }
                        console.log(movieData.poster_path);
                    } else {
                        console.error("Failed to fetch movie details");
                    }
                }
            } catch (error) {
                console.error("Error fetching group:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroup();

        connectWebSocket(userId);

        joinGroupRoom(groupId); // joinando sala de grupo

        onGroupUpdate(() => fetchGroup()); // toda vez q grupo for atulizado, vai chamar a funcao dnv

        onGroupUpdate((data) => {
            if (data.groupId === groupId) {
                console.log("WebSocket: Group update received");
                setGroup((prevGroup) => {
                    if (!prevGroup) return prevGroup;
                    return {
                        ...prevGroup,
                        ...data,
                    };
                });
            }
        });

        const handleGroupDeleted = (data: any) => {
            console.log(`Group deleted: ${data.groupId}`);
            navigation.goBack(); // atualizar e retornar todos os usuários que estao dentro da pagina do grupo
        };

        onGroupDeleted(handleGroupDeleted);

        console.log("Selected Filter Updated:", selectedFilter);
        console.log("Selected Movie:", selectedMovie);
        return () => {
            disconnectWebSocket(false);
            leaveGroupRoom(groupId);
        };
    }, [groupId, userId, selectedFilter]);

    const handleUserAdded = (newUser: any) => {
        setGroup((prevGroup) => {
            if (!prevGroup) return prevGroup;
            return { ...prevGroup, users: [...prevGroup.users, newUser] };
        });
    };

    const handleStartMatch = () => {
        if (!selectedMovie && !selectedFilter) {
            setModalType("error");
            setModalMessage("Selecione um filme ou um filtro!");
            setModalVisible(true);
            return;
        }

        // passando o groupId para tela de votação
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: "match_voting",
                        params: {
                            groupId,
                            filter: selectedFilter || null,
                        },
                    },
                ],
            })
        );
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (isLoading) {
        return (
            <View style={{}}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!group) {
        return (
            <View style={styles.errorContainer}>
                <Text>Group not found</Text>
            </View>
        );
    }

    const infoModal = () => {
        setModalType("alert");
        setModalVisible(true);
        setModalMessage(
            "Para iniciar o match, escolha um filtro ou um filme. Caso o filtro escolhido seja em cartaz, o usuário poderá ser redirecionado para o ingresso.com."
        );
    };

    const imageSource = group.image
        ? { uri: group.image }
        : require("@/assets/images/group_background.png");

    return (
        <>
            <View style={{ flex: 2, backgroundColor: Colors.dark.background }}>
                <ImageBackground
                    style={styles.image}
                    source={imageSource}
                ></ImageBackground>
                <ThemedText type="defaultSemiBold" style={styles.title}>
                    {group.name}
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
                <TouchableOpacity
                    onPress={openAddUserModal}
                    style={styles.addButton}
                >
                    <FontAwesome size={25} name="plus" color={"white"} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={openChangeImageModal}
                    style={[styles.addButton, styles.editButton]}
                >
                    <FontAwesome size={25} name="pencil" color={"white"} />
                </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
                <View
                    style={{
                        flex: 4 / 5,
                        backgroundColor: Colors.dark.background,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 20,
                    }}
                >
                    <ThemedText type="defaultSemiBold" style={styles.subtitle}>
                        Usuários do grupo
                    </ThemedText>
                    <FlatList
                        contentContainerStyle={{ gap: 3 }}
                        data={group.users}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onLongPress={() => handleLongPress(item.userId)}
                                delayLongPress={150} // 1 second long press
                            >
                                <View>
                                    <Text style={styles.userName}>
                                        @{item.user.user}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View
                    style={{
                        width: Dimensions.get("screen").width - 40,
                        backgroundColor: Colors.dark.background,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <ThemedText type="defaultSemiBold" style={styles.subtitle}>
                        <Text style={{ color: Colors.dark.tabIconSelected }}>
                            Filme
                        </Text>{" "}
                        de referência ou{" "}
                        <Text style={{ color: Colors.dark.tabIconSelected }}>
                            filtro
                        </Text>{" "}
                        para votação{" "}
                        <FontAwesome
                            size={20}
                            name="info-circle"
                            color={"white"}
                            onPress={() => infoModal()}
                        />
                    </ThemedText>
                    <View
                        style={{
                            width: Dimensions.get("screen").width - 40,
                            backgroundColor: Colors.dark.background,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 5,
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={openMovieSelectionModal}
                        >
                            <View>
                                <Image
                                    source={
                                        selectedMovie &&
                                        selectedMovie.poster_path
                                            ? {
                                                  uri: `https://image.tmdb.org/t/p/w500${selectedMovie?.poster_path}`,
                                              }
                                            : require("@/assets/images/place-holder-movies.png")
                                    }
                                    style={styles.poster}
                                />
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={styles.filterButtons}>
                            {[
                                { key: "popular", label: "Populares" },
                                { key: "now_playing", label: "Em cartaz" },
                                {
                                    key: "top_rated",
                                    label: "Melhor avaliados",
                                },
                                {
                                    key: "upcoming",
                                    label: "Em breve",
                                },
                            ].map(({ key, label }) => (
                                <TouchableOpacity
                                    key={key}
                                    style={[
                                        styles.filterButton,
                                        selectedFilter === key &&
                                            styles.filterButtonSelected,
                                    ]}
                                    onPress={() => handleFilterSelect(key)}
                                >
                                    <Text style={styles.filterButtonText}>
                                        {label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        width: Dimensions.get("screen").width - 40,
                        backgroundColor: Colors.dark.background,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                        height: 80,
                    }}
                >
                    <Pressable
                        style={styles.buttonMatch}
                        onPress={() => handleStartMatch()}
                    >
                        <ThemedText type="title" style={{ fontSize: 18 }}>
                            Iniciar Match
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            navigation.navigate("history", { groupId })
                        }
                        style={styles.buttonHistory}
                    >
                        <ThemedText type="title" style={{ fontSize: 18 }}>
                            Histórico
                        </ThemedText>
                    </Pressable>
                </View>
            </View>
            <AddUserBottomSheet
                ref={addUserModalRef}
                groupId={groupId}
                onUserAdded={handleUserAdded}
            />
            <ChangeGroupBottomSheet
                ref={changeImageModalRef}
                groupId={group.id}
                currentImage={group.image}
                onSave={handleSave}
            />
            <MovieSelectionModal
                ref={movieSelectionModalRef}
                onMovieSelect={handleMovieSelect}
                groupId={groupId}
            />
            <AlertModal
                type={modalType}
                message={modalMessage}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
            <ConfirmModal
                type="alert"
                visible={isConfirmUserVisible}
                onConfirm={handleDelete}
                onCancel={() => setIsConfirmUserVisible(false)}
                message="Tem certeza que deseja remover este usuário do grupo?"
            />
        </>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 3 / 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
        gap: 15,
        borderTopWidth: 1,
        borderColor: Colors.dark.tabIconSelected,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "center",
    },
    title: {
        fontSize: 24,
        color: "white",
        position: "absolute",
        marginTop: 250,
        padding: 14,
        backgroundColor: Colors.dark.background,
        borderBottomRightRadius: 5,
        borderTopRightRadius: 5,
        shadowOpacity: 4,
        elevation: 1,
    },
    subtitle: {
        fontSize: 24,
        color: "white",
        marginBottom: 10,
        flexWrap: "wrap",
        textAlign: "center",
    },
    poster: {
        width: Dimensions.get("screen").width / 3.2,
        height: 190,
        borderRadius: 5,
        elevation: 10,
    },
    posterAdd: {
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 120,
    },
    add: {
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        backgroundColor: Colors.dark.input,
        borderRadius: 10990,
        opacity: 0.8,
    },
    buttonMatch: {
        width: Dimensions.get("screen").width / 3.2,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 10,
        borderRadius: 8,
        elevation: 10,
    },
    buttonHistory: {
        width: Dimensions.get("screen").width / 3.2,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
        padding: 10,
        borderRadius: 8,
        elevation: 2,
        borderWidth: 1,
        marginLeft: 5,
        borderColor: Colors.dark.tabIconSelected,
    },
    backButton: {
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        top: 60,
        backgroundColor: Colors.dark.background,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    },
    addButton: {
        position: "absolute",
        right: 19,
        top: 60,
        borderWidth: 1,
        borderColor: Colors.dark.background,
        borderRadius: 5,
        width: 55,
        height: 55,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.dark.background,
    },
    editButton: {
        top: 130,
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    userName: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 5,
        borderColor: Colors.dark.tabIconSelected,
        backgroundColor: Colors.dark.tabIconSelected,
        fontSize: 20,
        color: Colors.dark.text,
    },
    filterButtons: {
        width: Dimensions.get("screen").width / 3.2,
        backgroundColor: Colors.dark.background,
        height: 190,
        justifyContent: "space-between",
    },
    filterButton: {
        fontSize: 14,
        backgroundColor: Colors.dark.background,
        borderWidth: 1,
        borderColor: Colors.dark.tabIconSelected,
        width: Dimensions.get("screen").width / 3.2,
        height: 40,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    filterButtonSelected: {
        backgroundColor: Colors.dark.tabIconSelected,
    },
    filterButtonText: { color: "white", fontWeight: "semibold", fontSize: 14 },
});

export default GroupsScreen;
