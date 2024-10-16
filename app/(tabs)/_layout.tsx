import { Tabs } from 'expo-router';
import * as React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Svg, { G, Path } from 'react-native-svg';


export default function TabLayout() {
  const Icon = (props:any) => (
    <Svg
      viewBox="0 0 38 35"
      width={32}
      height={28}
      {...props}
    >
      <G filter="url(#a)">
        <Path
          fillRule="evenodd"
          d="m24.408 1.453-.533 1.382-2.98-.114-2.98-.113V4.9l2.228.136c1.226.074 2.321.224 2.434.332.114.108-.038.754-.336 1.436-.298.681-.493 1.286-.433 1.343.161.154 8.544-1.105 8.766-1.316.168-.16-4.827-6.282-5.404-6.623-.126-.075-.47.486-.762 1.246Zm-11.096.502c-.503.531-.57 1.732-.57 10.212 0 6.187-.123 9.61-.346 9.61-.208 0-.344-1.404-.344-3.55 0-4.07-.393-5.016-2.081-5.016-1.884 0-2.146.912-2.007 7.002.12 5.298.136 5.395 1.257 7.57 1.235 2.394 3 4.068 5.563 5.274 1.303.614 2.151.743 4.855.743 2.939 0 3.482-.1 5.273-.966 2.336-1.13 4.487-3.23 5.53-5.4.67-1.39.742-2.109.746-7.374.005-6.418-.15-6.93-2.093-6.93-1.31 0-1.868.88-1.868 2.944 0 .962-.156 1.75-.345 1.75-.2 0-.345-1.074-.345-2.563 0-2.985-.527-4.026-2.036-4.026-1.582 0-2.103.883-2.103 3.567 0 1.355-.147 2.363-.345 2.363-.201 0-.345-1.106-.345-2.658 0-2.888-.327-3.821-1.488-4.24-.768-.277-1.912.092-2.386.77-.14.2-.256 1.511-.26 2.916-.002 1.479-.15 2.553-.35 2.553-.218 0-.344-2.501-.344-6.845 0-5.661-.093-6.97-.537-7.576-.663-.905-2.233-.972-3.03-.13ZM9.2 5.034l-2.335 1.04-.99-.906c-.544-.497-1.069-.782-1.166-.63-.377.585-2.013 6.764-1.836 6.933.167.16 2.141-.243 6.203-1.264l1.335-.336-.904-.9c-.497-.496-.903-.992-.903-1.103 0-.111.698-.457 1.552-.768 1.469-.536 1.552-.634 1.552-1.84 0-.7-.039-1.271-.087-1.27-.047.002-1.137.472-2.421 1.044Z"
          clipRule="evenodd"
        />
      </G>
    </Svg>
  )

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
        <Tabs.Screen
            name="login"
            options={{
                title: 'Login',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} />
            }}
        />
        <Tabs.Screen
            name="details"
            options={{
                title: 'Detalhes de filmes',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} />
            }}
        />
        <Tabs.Screen
            name="register"
            options={{
                title: 'Registro',
                tabBarIcon: ({ color }) => <FontAwesome size={28} name="gear" color={color} />,
            }}
        />
    </Tabs>

  );
}
