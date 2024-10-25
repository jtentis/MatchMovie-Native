import { Tabs } from 'expo-router';
import * as React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Icon } from '../../components/MatchLogo';


export default function TabLayout() {

  const colorScheme = useColorScheme();

  return (
    <Tabs 
      screenOptions={{
        tabBarItemStyle:{padding: 10},
        tabBarStyle:{backgroundColor:Colors.dark.background, height: 60},
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
            tabBarIcon: ({ color }) => <Icon fill={color}/>,
        }}
      />
        <Tabs.Screen
            name="profile"
            options={{
                title: 'Perfil',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />,
            }}
        />
    </Tabs>

  );
}
