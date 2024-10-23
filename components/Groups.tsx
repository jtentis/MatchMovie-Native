import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Pressable } from "expo-router/build/views/Pressable";
import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  View
} from "react-native";
import { ThemedText } from "./ThemedText";

export const GroupsScreen: React.FC = () => {
    
    return (
      <>
      <View style={{ flex: 2, backgroundColor: Colors.dark.background }}>
        <ImageBackground
          style={styles.image}
          source={require('@/assets/images/random 4.jpg')}
        ></ImageBackground>
        <ThemedText type="defaultSemiBold" style={styles.title}>
            Escola
        </ThemedText>
        <View style={styles.backButton}><FontAwesome size={25}name="chevron-left"color="white"/></View>
        <FontAwesome style={{position: "absolute",right: 30,top: 70,opacity: 0.7,color:'white',elevation:10}}size={25}name="pencil"/>
      </View>
      <View style={styles.mainContainer}>
          <View style={{ flex: 2, backgroundColor: Colors.dark.background, alignItems:'center', justifyContent:'flex-start'}}>
            <ThemedText type="defaultSemiBold" style={styles.subtitle}>
              Filmes de Referência
            </ThemedText>
            <View style={{backgroundColor: Colors.dark.background, alignItems:'center', justifyContent:'flex-start', padding: 20, flexDirection:'row', gap:5}}>
              <View style={styles.poster}><Image source={require("@/assets/images/movie-poster.jpg")} style={styles.poster}></Image></View>
              <View style={styles.poster}><Image source={require("@/assets/images/movie-poster.jpg")} style={styles.poster}></Image></View>
              <View style={styles.posterAdd}><View style={styles.add}><FontAwesome name={"plus"} size={10}></FontAwesome></View></View>
            </View>
          </View>
          <View style={{ flex: 2, backgroundColor: Colors.dark.background, alignItems:'center', justifyContent:'flex-start', borderTopWidth:1, borderColor: Colors.dark.light}}>
            <ThemedText type="defaultSemiBold" style={styles.subtitleFiltros}>
              Filtros da sessão
            </ThemedText>
            <View style={{width:360, backgroundColor: Colors.dark.background, alignItems:'center', justifyContent:'center', padding: 20, flexDirection:'row', gap:8, flexWrap:'wrap'}}>
              <Pressable style={styles.button}><ThemedText type="default" style={styles.buttonText}>Gênero</ThemedText></Pressable>
              <Pressable style={styles.button}><ThemedText type="default" style={styles.buttonText}>Ano</ThemedText></Pressable>
              <Pressable style={styles.button}><ThemedText type="default" style={styles.buttonText}>Nacionalidade</ThemedText></Pressable>
              <Pressable style={styles.button}><ThemedText type="default" style={styles.buttonText}>Em cartaz</ThemedText></Pressable>
              <Pressable style={styles.button}><ThemedText type="default" style={styles.buttonText}>Populares</ThemedText></Pressable>
              <Pressable style={styles.button}><ThemedText type="default" style={styles.buttonText}>Melhor Avaliados</ThemedText></Pressable>
              <Pressable style={styles.button}><ThemedText type="default" style={styles.buttonText}>Em Breve</ThemedText></Pressable>
            </View>
          </View>
          <View style={{ flex: 2/3, backgroundColor: Colors.dark.background, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:5}}>
            <Pressable style={styles.buttonMatch}><ThemedText type="title" style={{fontSize: 18}}>Iniciar Match</ThemedText></Pressable>
            <Pressable style={styles.buttonHistory}><ThemedText type="title" style={{fontSize: 18}}>Histórico</ThemedText></Pressable>
          </View>
        </View></>  
    );
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:3/1,
        alignContent: 'center',
        justifyContent: 'center',
        padding: 27,
        backgroundColor: Colors.dark.background,
        gap:15,
        borderTopWidth:1,
        borderColor: Colors.dark.tabIconSelected
    },
    image:{
      width: "100%",
      height: "100%",
      resizeMode: "center",
    },
    title: {
      fontSize: 24,
      color: "white",
      position: "absolute",
      marginTop: 230,
      padding: 14,
      backgroundColor: Colors.dark.background,
      borderBottomRightRadius: 5,
      borderTopRightRadius: 5,
      shadowOpacity: 4,
      elevation: 1
    },
    subtitle:{
      fontSize: 24,
      color: "white",
      marginTop:10
    },
    subtitleFiltros:{
      fontSize: 24,
      color: "white",
      marginTop:20,
    },
    poster:{
      width: 80,
      height: 120,
      borderRadius:5,
      elevation: 10,
    },
    posterAdd:{
      alignItems:'center',
      justifyContent:'center',
      width: 80,
      height: 120,
    },
    add:{
      alignItems:'center',
      justifyContent:'center',
      width:30,
      height:30,
      backgroundColor:Colors.dark.input,
      borderRadius:10990,
      opacity: 0.8
    },
    button:{
      padding: 10,
      backgroundColor: Colors.dark.input,
      borderRadius: 5,
      elevation: 5
    },
    buttonText:{
      fontSize: 16,
      color: "white",
    },
    buttonMatch:{
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: Colors.dark.tabIconSelected,
      padding: 12,
      borderRadius: 8,
      elevation: 10,
    },
    buttonHistory:{
      justifyContent:'center',
      alignItems:'center',
      backgroundColor: Colors.dark.light,
      padding: 12,
      borderRadius: 8,
      elevation: 10,
    },
    backButton:{
      width: 50,
      height: 50,
      alignItems:'center',
      justifyContent:'center',
      position: "absolute",
      left: 20,
      top: 60,
      borderRadius: 10000,
      backgroundColor: "#D46162",
      opacity: 0.8,
    }
});
