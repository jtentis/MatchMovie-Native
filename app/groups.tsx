import { AddUserBottomSheet } from "@/components/AddUserBottomSheet";
import { ChangeGroupBottomSheet } from "@/components/ChangeGroupImageBottomSheet";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { URL_LOCALHOST } from "@/constants/Url";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Modalize } from "react-native-modalize";
import { ThemedText } from "../components/ThemedText";
import { useAuth } from "./contexts/AuthContext";
import {
    connectWebSocket,
    disconnectWebSocket,
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
    users: GroupUser[];
};

type RootStackParamList = {
    history: undefined;
    groups: { groupId: number };
};

type GroupsNavigationProp = RouteProp<RootStackParamList, "groups">;

const GroupsScreen = ({ navigation }: { navigation: any }) => {
    navigation = useNavigation();
    const route = useRoute<GroupsNavigationProp>();
    const { groupId } = route.params;
    const { authToken } = useAuth();
    const [group, setGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const addUserModalRef = useRef<Modalize>(null);
    const changeImageModalRef = useRef<Modalize>(null);

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
        setGroup(updatedGroup)
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
                // console.log(data);
            } catch (error) {
                console.error("Error fetching group:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroup();

        const socket = connectWebSocket(groupId);

        onGroupUpdate((data) => {
            if (data.groupId === groupId) {
                console.log("WebSocket: Group update received");
                setGroup((prevGroup) => {
                    if (!prevGroup) return prevGroup;
                    return {
                        ...prevGroup,
                        users: [...prevGroup.users, data.newUser],
                    };
                });
            }
        });

        return () => {
            disconnectWebSocket(false);
        };
    }, [groupId]);

    const handleUserAdded = (newUser: any) => {
        setGroup((prevGroup) => {
            if (!prevGroup) return prevGroup;
            return { ...prevGroup, users: [...prevGroup.users, newUser] };
        });
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

    const imageSource = group.image
    ? { uri: group.image }
    : require('@/assets/images/group_background.png')

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
                    style={{
                        position: "absolute",
                        right: 19,
                        top: 70,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 12,
                        backgroundColor: Colors.dark.background,
                    }}
                >
                    <FontAwesome size={25} name="plus" color={"white"} />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={openChangeImageModal}
                    style={{
                        position: "absolute",
                        right: 18,
                        top: 130,
                        borderWidth: 1,
                        borderRadius: 5,
                        padding: 12,
                        backgroundColor: Colors.dark.background,
                    }}
                >
                    <FontAwesome size={25} name="pencil" color={"white"} />
                </TouchableOpacity>
            </View>
            <View style={styles.mainContainer}>
                <View
                    style={{
                        flex: 4 / 3,
                        backgroundColor: Colors.dark.background,
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
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
                            <View>
                                <Text style={styles.userName}>
                                    @{item.user.user}
                                </Text>
                            </View>
                        )}
                    />
                </View>
                <View
                    style={{
                        flex: 3 / 1,
                        backgroundColor: Colors.dark.background,
                        alignItems: "center",
                        justifyContent: "flex-start",
                    }}
                >
                    <ThemedText type="defaultSemiBold" style={styles.subtitle}>
                        Filme de referência para votação
                    </ThemedText>
                    <View
                        style={{
                            backgroundColor: Colors.dark.background,
                            alignItems: "center",
                            justifyContent: "flex-start",
                            padding: 20,
                            flexDirection: "row",
                            gap: 5,
                        }}
                    >
                        <View style={styles.poster}>
                            <Image
                                source={require("@/assets/images/movie-poster.jpg")}
                                style={styles.poster}
                            ></Image>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        flex: 2 / 1,
                        backgroundColor: Colors.dark.background,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                    }}
                >
                    <Pressable style={styles.buttonMatch}>
                        <ThemedText type="title" style={{ fontSize: 18 }}>
                            Iniciar Match
                        </ThemedText>
                    </Pressable>
                    <Pressable
                        onPress={() => navigation.navigate("history")}
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
                currentName={group.name}
                currentImage={group.image}
                onSave={handleSave}
            />
        </>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 3 / 1,
        alignContent: "center",
        justifyContent: "center",
        padding: 27,
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
        marginTop: 10,
    },
    subtitleFiltros: {
        fontSize: 24,
        color: "white",
        marginTop: 15,
    },
    poster: {
        width: 120,
        height: 160,
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
    selected: {
        backgroundColor: Colors.dark.tabIconSelected,
    },
    default: {
        backgroundColor: Colors.dark.input,
    },
    buttonText: {
        fontSize: 12,
        color: "white",
    },
    buttonMatch: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.tabIconSelected,
        padding: 12,
        borderRadius: 8,
        elevation: 10,
    },
    buttonHistory: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.dark.background,
        padding: 12,
        borderRadius: 8,
        elevation: 2,
        borderWidth: 1,
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
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    userName: {
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        borderColor: Colors.dark.tabIconSelected,
        backgroundColor: Colors.dark.tabIconSelected,
        fontSize: 20,
        color: Colors.dark.text,
    },
    modalContent: {
        flex: 1,
        flexDirection: "row",
        padding: 16,
        justifyContent: "center",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 16,
        alignSelf: "center",
        marginTop: 30,
    },
    input: {
        width: 350,
        height: 50,
        backgroundColor: Colors.dark.input,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
        color: Colors.dark.text,
    },
    button: {
        right: 20,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        borderRadius: 8,
        elevation: 2,
        fontSize: Fonts.dark.buttonText,
    },
});

export default GroupsScreen;
