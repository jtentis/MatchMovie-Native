import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Button,
    FlatList,
    Image,
    ImageBackground,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ThemedText } from "../components/ThemedText";
import { useAuth } from "./contexts/AuthContext";

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
    const route = useRoute<GroupsNavigationProp>();
    const { groupId } = route.params;
    navigation = useNavigation();
    const buttonNames = [
        "Em Cartaz",
        "Populares",
        "Melhor Avaliados",
        "Em Breve",
    ];
    const dropdownNames = ["Gênero", "Ano", "Nacionalidade"];
    const [group, setGroup] = useState<Group | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { userId, authToken } = useAuth();
    const [newUserId, setNewUserId] = useState(""); // Input for new user ID
    const [isAdding, setIsAdding] = useState(false);
    const [username, setUsername] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

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
                console.log(data);
            } catch (error) {
                console.error("Error fetching group:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGroup();
        
    }, [groupId]);

    const addUserToGroup = async () => {
        if (!username.trim()) {
            alert("Please enter a username");
            return;
        }

        try {
            setIsAdding(true);
            // Fetch user ID by username
            const userResponse = await fetch(
                `${URL_LOCALHOST}/users/username/${username}`,{
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );
            if (!userResponse.ok) {
                throw new Error("Failed to fetch user by username");
            }

            const { id: userFoundId } = await userResponse.json();

            const response = await fetch(
                `${URL_LOCALHOST}/groups/${groupId}/users/${userFoundId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to add user to group");
            }

            const updatedGroup = await response.json();
            setGroup(updatedGroup.group); // Update group state with the new data
            setUsername(""); // Clear username field
            setModalVisible(false); // Close modal
        } catch (error) {
            console.error("Error adding user to group:", error);
            alert("Failed to add user to group");
        } finally {
            setIsAdding(false);
        }
    };

    const [selectedButtons, setSelectedButtons] = useState(
        Array(buttonNames.length).fill(false)
    );

    const handlePress = (index: any) => {
        console.log(groupId);
        const newSelectedButtons = [...selectedButtons];
        newSelectedButtons[index] = !newSelectedButtons[index];
        setSelectedButtons(newSelectedButtons);
    };

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

    const isBase64Image = (image: string | null): boolean => {
        if (!image) return false;
        const base64Pattern = /^data:image\/(png|jpg|jpeg);base64,/;
        return base64Pattern.test(image);
    };

    const imageSource =
            group.image && group.image.trim() !== ""
                ? isBase64Image(group.image)
                    ? { uri: group.image }
                    : { uri: `data:image/jpeg;base64,${group.image}` }
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
                    style={{
                        position: "absolute",
                        right: 30,
                        top: 70,
                        elevation: 10,
                    }}
                >
                    <FontAwesome
                        size={25}
                        name="plus"
                        color={"white"}
                        onPress={() => setModalVisible(true)}
                    />
                </TouchableOpacity>
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                Add User by Username
                            </Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter username"
                                value={username}
                                onChangeText={setUsername}
                            />
                            <View style={styles.modalButtons}>
                                <Button
                                    title="Cancel"
                                    onPress={() => setModalVisible(false)}
                                />
                                <Button
                                    title={isAdding ? "Adding..." : "Add User"}
                                    onPress={addUserToGroup}
                                    disabled={isAdding}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
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
                    contentContainerStyle={{gap:3}}
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
                {/* <View
                    style={{
                        flex: 2,
                        backgroundColor: Colors.dark.background,
                        alignItems: "center",
                        justifyContent: "flex-start",
                        borderTopWidth: 1,
                        borderColor: Colors.dark.light,
                        gap: 10,
                    }}
                >
                    <ThemedText
                        type="defaultSemiBold"
                        style={styles.subtitleFiltros}
                    >
                        Filtros da sessão
                    </ThemedText>
                    <View
                        style={{
                            width: 360,
                            backgroundColor: Colors.dark.background,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            gap: 5,
                            flexWrap: "nowrap",
                        }}
                    >
                        {dropdownNames.map((name, index) => (
                            <Pressable
                                key={index}
                                style={[styles.button, styles.default]}
                            >
                                <ThemedText
                                    type="default"
                                    style={styles.buttonText}
                                >
                                    {name}{" "}
                                    <FontAwesome size={12} name="caret-down" />
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>
                    <View
                        style={{
                            width: 360,
                            backgroundColor: Colors.dark.background,
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            gap: 5,
                            flexWrap: "wrap",
                        }}
                    >
                        {buttonNames.map((name, index) => (
                            <Pressable
                                key={index}
                                style={[
                                    styles.button,
                                    selectedButtons[index]
                                        ? styles.selected
                                        : styles.default,
                                ]}
                                onPress={() => handlePress(index)}
                            >
                                <ThemedText
                                    type="default"
                                    style={styles.buttonText}
                                >
                                    {name}
                                </ThemedText>
                            </Pressable>
                        ))}
                    </View>
                </View> */}
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
    button: {
        padding: 8,
        borderRadius: 5,
        elevation: 5,
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: "white",
        padding: 16,
        borderRadius: 8,
        width: "80%",
    },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
    input: { borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 4 },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },
});

export default GroupsScreen;
