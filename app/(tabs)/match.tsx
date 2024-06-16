import React from 'react';
import {Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ThemedText} from "@/components/ThemedText";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {Colors} from "@/constants/Colors";

export default function MatchScreen() {
  return (
      <View
          style={[
            styles.container,
            {
              // Try setting `flexDirection` to `"row"`.
              flexDirection: 'column',
            },
          ]}>
        <View style={{
          flex: 1,
          backgroundColor: Colors.dark.background,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          gap: 10,
        }} >
          <FontAwesome size={22} name="arrow-left" color={'#FFFFFF'} style={{
            marginTop:'10%',
            backgroundColor:Colors.dark.tabIconSelected,
            padding:15,
            borderRadius:100,
          }}/>
          <ThemedText type="title" style={{marginTop:'10%'}}>Minhas Sessões</ThemedText>
        </View>
        <View style={{
          flex: 3/2,
          backgroundColor: Colors.dark.background,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }} >
          <ScrollView horizontal={true} style={{
            flex: 1,
            marginTop: 24,
            marginLeft: 20,
          }}>

            <Image style={styles.images} source={require('@/assets/images/movie-poster.jpg')} resizeMode={'center'}/>
            <Image style={styles.images} source={require('@/assets/images/movie-poster.jpg')} resizeMode={'center'}/>
            <Image style={styles.images} source={require('@/assets/images/movie-poster.jpg')} resizeMode={'center'}/>
            <Image style={styles.images} source={require('@/assets/images/movie-poster.jpg')} resizeMode={'center'}/>
            <Image style={styles.images} source={require('@/assets/images/movie-poster.jpg')} resizeMode={'center'}/>

          </ScrollView>
        </View>
        <View style={{flex: 2, backgroundColor: 'green'}} />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  images:{
    borderRadius: 10,
    width: 150,
    height: 200,
  }
});
