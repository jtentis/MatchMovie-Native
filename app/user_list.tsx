import { useAuth } from "@/app/contexts/AuthContext";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { URL_LOCALHOST } from "@/constants/Url";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Movie {
  id: number;
  poster_path: string | null | any;
}

type RootStackParamList = {
  UserListsScreen: { userId: number; type: "watched" | "favorites" };
  details: { movieId: number };
};

type ScreenNavigationProp = StackNavigationProp<RootStackParamList>;
const MOVIE_POSTER_URL_API = `${URL_LOCALHOST}/movies`;

const UserListsScreen: React.FC = () => {
  const navigation = useNavigation<ScreenNavigationProp>();
  const route = useRoute();
  const { userId, type } = route.params as {
    userId: number;
    type: "watched" | "favorites";
  };
  const [isMoviesLoading, setIsMoviesLoading] = useState(true);
  const { authToken } = useAuth();
  const [movies, setMovies] = useState<any[]>([]);
  const [posters, setPosters] = useState<{ [id: number]: string | null }>({});
  const listRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsMoviesLoading(true);
      try {
        const response = await fetch(`${URL_LOCALHOST}/${type}/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsMoviesLoading(false);
      }
    };

    fetchMovies();
  }, [userId, type]);

  useEffect(() => {
    const loadPosters = async () => {
      if (movies.length === 0) {
        return;
      }

      const newPosters: { [id: number]: string | null } = {};

      movies.forEach((movie) => {
        newPosters[movie.id] = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null;
      });

      setPosters(newPosters);
    };

    loadPosters();
  }, [movies]);

  const renderMovie = ({ item }: { item: Movie }) => {
    const posterUrl = posters[item.id];

    if (!posterUrl) {
      return (
        <View style={styles.gridItem}>
          <ContentLoader
            speed={1}
            width={Dimensions.get("window").width / 2}
            height={(Dimensions.get("window").width / 2) * 1.5}
            viewBox="0 0 200 300"
            backgroundColor="#ccc"
            foregroundColor="#ddd"
          >
            <Rect x="0" y="0" width="200" height="300" />
          </ContentLoader>
        </View>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("details", { movieId: item.id })}
      >
        <View style={styles.gridItem}>
          <Image
            source={{
              uri: posterUrl,
            }}
            style={styles.poster}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderLoader = () => (
    <View style={styles.gridItem}>
      <ContentLoader
        speed={1}
        width={Dimensions.get("window").width / 2}
        height={(Dimensions.get("window").width / 2) * 1.5}
        viewBox="0 0 200 300"
        backgroundColor="#ccc"
        foregroundColor="#ddd"
      >
        <Rect x="0" y="0" width="200" height="300" />
      </ContentLoader>
    </View>
  );

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: Colors.dark.background,
      }}
    >
      <View style={styles.title}>
        <ThemedText
          style={{
            fontSize: 32,
            padding: 15,
            fontFamily: "CoinyRegular",
          }}
        >
          {type === "watched" ? "Filmes assistidos" : "Filmes favoritos"}
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
      </View>
      <SafeAreaView style={styles.container}>
        {isMoviesLoading ? (
          <FlatList
            style={{ backgroundColor: Colors.dark.background }}
            ref={listRef}
            data={Array(6).fill({})}
            renderItem={renderLoader}
            keyExtractor={(_, index) => `loader-${index}`}
            numColumns={2}
          />
        ) : movies.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              {type === "watched"
                ? "Você ainda não marcou nenhum filme como assistido."
                : "Você ainda não favoritou nenhum filme."}
            </ThemedText>
          </View>
        ) : (
          <FlatList
            style={{ backgroundColor: Colors.dark.background }}
            ref={listRef}
            data={movies}
            renderItem={renderMovie}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            removeClippedSubviews={true}
            windowSize={5}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: Colors.dark.background,
  },
  backButton: {
    width: 55,
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 60,
    left: 0,
    backgroundColor: Colors.dark.tabIconSelected,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  container: {
    flex: 10,
    padding: 0,
    marginTop: 25,
    backgroundColor: Colors.dark.background,
    alignItems: "flex-start",
  },
  gridItem: {
    flex: 1,
    overflow: "hidden",
    alignItems: "center",
    zIndex: 9999,
  },
  poster: {
    width: Dimensions.get("window").width / 2,
    height: (Dimensions.get("window").width / 2) * 1.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: Dimensions.get("window").width - 90,
    backgroundColor: Colors.dark.background,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.dark.text,
    textAlign: "center",
    opacity: 0.5,
  },
});

export default UserListsScreen;
