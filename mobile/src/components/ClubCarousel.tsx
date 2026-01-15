import React, { useState, useRef } from 'react';
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
} from 'react-native';

interface ClubCarouselProps {
  images: string[];
  clubName: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function ClubCarousel({ images, clubName }: ClubCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentIndex(index);
  };

  if (images.length === 1) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: images[0] }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Images ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={SCREEN_WIDTH}
        snapToAlignment="center"
      >
        {images.map((image, index) => (
          <View key={index} style={[styles.imageContainer, { width: SCREEN_WIDTH }]}>
            <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
          </View>
        ))}
      </ScrollView>

      {/* Dots Navigation */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
            style={[
              styles.dot,
              {
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: currentIndex === index ? 4 : 4,
                backgroundColor:
                  currentIndex === index
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.5)',
              },
            ]}
            activeOpacity={0.8}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 160,
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  dot: {
    padding: 0,
  },
});
