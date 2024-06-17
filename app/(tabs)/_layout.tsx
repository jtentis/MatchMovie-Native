import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {xml} from '@/assets/images/logo';
import { SvgXml } from 'react-native-svg';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tabIconSelected,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'dark'].tabIconDefault,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
            title: 'Catálogo',
            tabBarIcon: ({ color }) => <FontAwesome size={22} name="film" color={color} />,
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
            title: 'Match',
            tabBarIcon: ({ color }) => <FontAwesome size={28} name="slideshare" color={color} />,
        }}
      />
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Perfil',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
            }}
        />
        <Tabs.Screen
            name="login"
            options={{
                title: 'Login',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} />
            }}
        />
    </Tabs>

  );
}
