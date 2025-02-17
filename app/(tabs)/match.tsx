import AlertModal from "@/components/ModalAlert";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { URL_LOCALHOST } from "@/constants/Url";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useAuth } from "../contexts/AuthContext";
import {
    connectWebSocket,
    disconnectWebSocket,
    onGroupCreated,
    onGroupDeleted,
    onGroupUpdate,
} from "../services/websocket";

interface Group {
    id: number;
    name: string;
    image: string | null;
}

type RootStackParamList = {
    groups: { groupId: number };
};

type GroupsNavigationProp = StackNavigationProp<RootStackParamList>;

//TODO: metade da tela fica travada apos criar grupo e voltar. nao sei por diabos isso ta acontecendo.
export default function MatchScreen() {
    const navigation = useNavigation<GroupsNavigationProp>();
    const { userId, authToken } = useAuth();
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<"error" | "success" | "alert">(
        "alert"
    );
    const [modalMessage, setModalMessage] = useState<string>("");

    const fetchGroups = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `${URL_LOCALHOST}/users/${userId}/groups`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (!response.ok) {
                console.log(response)
                throw new Error("Failed to fetch groups");
            }

            const data = await response.json();
            setGroups(data);
            // console.log(data);
        } catch (error) {
            console.error("Error fetching groups:", error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, [userId, authToken]);

    useEffect(() => {
        if (!authToken || !userId) {
            console.log("Usuário esta deslogado. Desconsiderando websockets.");
            return;
        }

        fetchGroups();
        connectWebSocket(userId);

        onGroupUpdate(() => fetchGroups());
        onGroupCreated((newGroup) => {
            setGroups((prevGroups) => [...prevGroups, newGroup]);
        });

        const handleGroupDeleted = (data: any) => {
            console.log(`Group deleted: ${data.groupId}`);
            setGroups((prevGroups) =>
                prevGroups.filter((group) => group.id !== data.groupId)
            ); // atualizar o grupo deletado para todos os usuarios
        };

        onGroupDeleted(handleGroupDeleted);

        return () => {
            disconnectWebSocket();
        };
    }, [fetchGroups, userId]);

    const renderGroup = (item: Group, navigation: any) => {
        const imageSource = item.image
            ? { uri: item.image }
            : require("@/assets/images/group_background.png");

        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate("groups", { groupId: item.id })
                }
            >
                <View style={styles.groupContainer}>
                    <Image source={imageSource} style={styles.groupImage} />
                    <Text style={styles.groupName}>{item.name}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    const createGroup = async () => {
        console.log(groups.map((group) => group.id));
        if (!groupName.trim()) {
            setModalType("error");
            setModalMessage("Não pode estar vazio!");
            setModalVisible(true);
            return;
        }

        try {
            setIsCreating(true);
            console.log("Payload:", {
                name: groupName,
                userIds: [userId],
            });

            if (!userId) {
                setModalType("error");
                setModalMessage("Falha ao criar grupo!");
                setModalVisible(true);
                return;
            }

            const response = await fetch(`${URL_LOCALHOST}/groups`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                    name: groupName,
                    userIds: [parseInt(userId, 10)],
                }),
            });

            if (!response.ok) {
                console.log(response);
                throw new Error("Failed to create group");
            }

            const newGroup = await response.json();
            setGroups((prevGroups) => {
                const groupExists = prevGroups.some(
                    (g) => g.id === newGroup.id
                );
                if (!groupExists) {
                    return [...prevGroups, newGroup];
                }
                return prevGroups;
            });

            // setModalType("success");
            // setModalMessage("Grupo criado com sucesso!");
            // setModalVisible(true);
            setGroupName("");
            navigation.navigate("groups", { groupId: newGroup.id });
        } catch (error) {
            console.error("Error creating group:", error);
            setModalType("error");
            setModalMessage("Falha ao criar grupo!");
            setModalVisible(true);
        } finally {
            setIsCreating(false);
        }
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
    
    return (
        <SafeAreaView style={[styles.container, { flexDirection: "column" }]}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: Colors.dark.background,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    paddingLeft: 25,
                    gap: 10,
                }}
            >
                <ThemedText type="title" style={{ marginTop: "10%" }}>
                    Minhas Sessões
                </ThemedText>
            </View>
            <SafeAreaView
                style={{
                    flex: 4 / 2,
                    backgroundColor: Colors.dark.background,
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "center",
                }}
            >
                {groups.length === 0 ? (
                    <Text style={styles.noGroupsMessage}>
                        Você não está em nenhum grupo.
                    </Text>
                ) : (
                    <FlatList
                        data={groups}
                        renderItem={({ item }) => renderGroup(item, navigation)} // Pass navigation
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}
            </SafeAreaView>
            <View
                style={{
                    flex: 2,
                    backgroundColor: Colors.dark.background,
                    alignItems: "flex-start",
                    justifyContent: "center",
                    gap: 30,
                }}
            >
                <ThemedText type="title" style={{ paddingLeft: 20 }}>
                    Criar nova sessão
                </ThemedText>
                <View
                    style={{
                        flexDirection: "row",
                        backgroundColor: Colors.dark.background,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <TextInput
                        style={styles.input}
                        placeholder="Nome da Sessão"
                        keyboardType="default"
                        value={groupName}
                        onChangeText={setGroupName}
                        editable={!isCreating}
                        selectionColor={Colors.dark.tabIconSelected}
                        placeholderTextColor={Colors.dark.textPlaceHolder}
                    />
                    <Pressable
                        style={styles.button}
                        onPress={createGroup}
                        disabled={isCreating}
                    >
                        <ThemedText
                            type={"defaultSemiBold"}
                            style={{ fontSize: Fonts.dark.buttonText }}
                        >
                            {isCreating ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={{ color: "#fff", fontSize: 16 }}>
                                    Criar
                                </Text>
                            )}
                        </ThemedText>
                    </Pressable>
                    <AlertModal
                        type={modalType}
                        message={modalMessage}
                        visible={modalVisible}
                        onClose={() => setModalVisible(false)}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    groupContainer: {
        alignItems: "center",
        marginRight: 15,
    },
    groupImage: {
        borderRadius: 8,
        width: 170,
        height: 260,
        elevation: 10,
        borderWidth: 2,
        borderColor: Colors.dark.input,
    },
    listContainer: {
        backgroundColor: Colors.dark.background,
        borderRadius: 8,
        paddingLeft: 25,
    },
    boxContainer: {
        flex: 1,
    },
    elevated: {
        backgroundColor: "white",
    },
    input: {
        width: Dimensions.get("screen").width - 40,
        height: 50,
        backgroundColor: Colors.dark.input,
        borderColor: Colors.dark.tabIconSelected,
        borderWidth: 1,
        padding: 15,
        borderRadius: 8,
        elevation: 2,
        color: Colors.dark.text,
        marginLeft: 20,
    },
    button: {
        right: 0,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 50,
        backgroundColor: Colors.dark.tabIconSelected,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        elevation: 2,
        fontSize: Fonts.dark.buttonText,
    },
    backButton: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.8,
        marginTop: 32,
    },
    groupName: {
        fontSize: 16,
        color: Colors.dark.text,
        alignSelf: "flex-start",
        fontWeight: "500",
        flexWrap: "wrap",
        maxWidth: 170,
    },
    noGroupsMessage: {
        width: 350,
        height: 250,
        fontSize: 36,
        borderRadius: 8,
        borderWidth: 1,
        padding: 20,
        color: "gray",
        textAlign: "center",
        marginLeft: 20,
    },
});
