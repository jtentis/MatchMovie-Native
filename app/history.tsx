import { Colors } from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "expo-router";
import { Pressable } from "expo-router/build/views/Pressable";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { ThemedText } from "../components/ThemedText";

const HistoryScreen = ({navigation}:{navigation: any}) => {
    navigation = useNavigation();
    return (
      <View style={styles.mainContainer}>
        <View style={{flex:1/2, flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:Colors.dark.background, marginTop:30}}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <View >
              <FontAwesome size={30} name="chevron-left" color={Colors.dark.text} />
            </View>
          </Pressable>
          <ThemedText type="subtitle" style={{marginLeft:'50%'}}>Escola</ThemedText>
          <View style={styles.groupImage}><Image source={require('@/assets/images/random 4.jpg')} style={styles.groupImage}></Image></View>
        </View>
        <View style={{flex:3, alignItems:'center',backgroundColor: Colors.dark.background, marginTop:10}}>
          <ThemedText type="title" style={{marginBottom: 20}}>Histórico</ThemedText>
          <ScrollView style={{width:'100%', height:'100%', gap:5, padding: 0}} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
              <View style={styles.poster}>
                <Image source={require('@/assets/images/movie-poster.jpg')} style={styles.poster}></Image>
              </View>
              <View style={{flex: 1}}>
                <ThemedText type="default" style={styles.text}>Filme: Nada de Novo no Front</ThemedText>
                <ThemedText type="default" style={styles.text}>Grupo: Escola</ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.endText}>Data do Match: 16/04/2024</ThemedText>
                <FontAwesome size={20} name="trash" style={styles.trash}/>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.poster}>
                <Image source={require('@/assets/images/movie-poster.jpg')} style={styles.poster}></Image>
              </View>
              <View style={{flex: 1}}>
                <ThemedText type="default" style={styles.text}>Filme: Nada de Novo no Front</ThemedText>
                <ThemedText type="default" style={styles.text}>Grupo: Escola</ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.endText}>Data do Match: 16/04/2024</ThemedText>
                <FontAwesome size={20} name="trash" style={styles.trash}/>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.poster}>
                <Image source={require('@/assets/images/movie-poster.jpg')} style={styles.poster}></Image>
              </View>
              <View style={{flex: 1}}>
                <ThemedText type="default" style={styles.text}>Filme: Nada de Novo no Front</ThemedText>
                <ThemedText type="default" style={styles.text}>Grupo: Escola</ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.endText}>Data do Match: 16/04/2024</ThemedText>
                <FontAwesome size={20} name="trash" style={styles.trash}/>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.poster}>
                <Image source={require('@/assets/images/movie-poster.jpg')} style={styles.poster}></Image>
              </View>
              <View style={{flex: 1}}>
                <ThemedText type="default" style={styles.text}>Filme: Nada de Novo no Front</ThemedText>
                <ThemedText type="default" style={styles.text}>Grupo: Escola</ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.endText}>Data do Match: 16/04/2024</ThemedText>
                <FontAwesome size={20} name="trash" style={styles.trash}/>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.poster}>
                <Image source={require('@/assets/images/movie-poster.jpg')} style={styles.poster}></Image>
              </View>
              <View style={{flex: 1}}>
                <ThemedText type="default" style={styles.text}>Filme: Nada de Novo no Front</ThemedText>
                <ThemedText type="default" style={styles.text}>Grupo: Escola</ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.endText}>Data do Match: 16/04/2024</ThemedText>
                <FontAwesome size={20} name="trash" style={styles.trash}/>
              </View>
            </View>
            <View style={styles.card}>
              <View style={styles.poster}>
                <Image source={require('@/assets/images/movie-poster.jpg')} style={styles.poster}></Image>
              </View>
              <View style={{flex: 1}}>
                <ThemedText type="default" style={styles.text}>Filme: Nada de Novo no Front</ThemedText>
                <ThemedText type="default" style={styles.text}>Grupo: Escola</ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.text}></ThemedText>
                <ThemedText type="default" style={styles.endText}>Data do Match: 16/04/2024</ThemedText>
                <FontAwesome size={20} name="trash" style={styles.trash}/>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    )
      
}

const styles = StyleSheet.create({
  mainContainer:{
    flex: 1,
    padding: 10,
    backgroundColor: Colors.dark.background,
    gap:10
  },
  backButton:{
    width: 55,
    height: 55,
    alignItems:'center',
    justifyContent:'center',
    opacity: 0.8,
  },
  groupImage:{
    width: 50,
    height: 50,
    borderRadius: 1000,
    elevation: 2
  },
  poster:{
    width: 70,
    height:100,
    borderRadius:5,
    elevation: 2
  },
  card:{
    flexDirection:'row',
    width:'100%',
    backgroundColor: '#414344',
    marginTop:5,
    padding: 5,
    elevation: 5,
    borderRadius: 5
  },
  text:{
    marginLeft: 10
  },
  endText:{
    marginRight: 5,
    marginTop: 5,
    textAlign:'right',
    opacity:.5,
    fontSize:10
  },
  trash:{
    position:'absolute',
    right:5,
    top:5,
    color: Colors.dark.tabIconSelected,
    opacity:.6
  }
});

export default HistoryScreen;