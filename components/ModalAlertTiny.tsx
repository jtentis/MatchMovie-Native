import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import Icon from './MatchLogo'; // Adjust the path to the SVG logo

interface TinyModalProps {
  text: string;
  onClose?: () => void;
}

const TinyModal: React.FC<TinyModalProps> = ({ text, onClose }) => {
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(50);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate out after 1 second
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onClose) {
          onClose();
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [opacity, translateY, onClose]);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Icon fill="#D46162" width={20} height={20} style={styles.icon} />
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: 60,
    right: 60,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    color: Colors.dark.tabIconSelected,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: 'white',
  },
});

export default TinyModal;
