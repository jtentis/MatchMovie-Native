import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    View
} from "react-native";
import { ThemedText } from "../components/ThemedText";

type RootStackParamList = {
  history: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'history'>;

const GroupsScreen = ({navigation}:{navigation: any}) => {
  navigation = useNavigation();
  const buttonNames = ["Em Cartaz", "Populares", "Melhor Avaliados", "Em Breve"];
  const dropdownNames = ["Gênero", "Ano", "Nacionalidade"];
  
  const [selectedButtons, setSelectedButtons] = useState(
    Array(buttonNames.length).fill(false)
  );

  const handlePress = (index: any) => {
      const newSelectedButtons = [...selectedButtons];
      newSelectedButtons[index] = !newSelectedButtons[index];
      setSelectedButtons(newSelectedButtons);
    }
    
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
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <View >
          <FontAwesome size={30} name="chevron-left" color={Colors.dark.text} />
        </View>
      </Pressable>
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
        <View style={{ flex: 2, backgroundColor: Colors.dark.background, alignItems:'center', justifyContent:'flex-start', borderTopWidth:1, borderColor: Colors.dark.light, gap:10}}>
          <ThemedText type="defaultSemiBold" style={styles.subtitleFiltros}>
            Filtros da sessão
          </ThemedText>
          <View style={{width:360, backgroundColor: Colors.dark.background, alignItems:'center', justifyContent:'center', flexDirection:'row', gap:5, flexWrap:'nowrap'}}>
            {dropdownNames.map((name, index) => (
              <Pressable key={index}
              style={[styles.button, styles.default]}>
              <ThemedText type="default" style={styles.buttonText}>{name} <FontAwesome size={12} name="caret-down"/></ThemedText>
              </Pressable>
            ))}
          </View>
          <View style={{width:360, backgroundColor: Colors.dark.background, alignItems:'center', justifyContent:'center', flexDirection:'row', gap:5, flexWrap:'nowrap'}}>
            {buttonNames.map((name, index) => (
              <Pressable key={index}
              style={[styles.button, selectedButtons[index] ? styles.selected : styles.default]}
              onPress={() => handlePress(index)}>
              <ThemedText type="default" style={styles.buttonText}>{name}</ThemedText>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={{ flex: 2/3, backgroundColor: Colors.dark.background, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:5}}>
          <Pressable style={styles.buttonMatch}><ThemedText type="title" style={{fontSize: 18}}>Iniciar Match</ThemedText></Pressable>
          <Pressable onPress={() => navigation.navigate('history')} style={styles.buttonHistory}><ThemedText type="title" style={{fontSize: 18}}>Histórico</ThemedText></Pressable>
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
      marginTop:15,
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
      borderRadius: 5,
      elevation: 5
    },
    selected:{
      backgroundColor: Colors.dark.tabIconSelected,
    },
    default:{
      backgroundColor: Colors.dark.input,
    },
    buttonText:{
      fontSize: 14,
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
    backButton: {
      width: 55,
      height: 55,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      top: 60,
      backgroundColor: Colors.dark.background,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8
    },
});

export default GroupsScreen;