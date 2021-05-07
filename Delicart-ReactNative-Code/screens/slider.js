import React, { Component } from "react";
import { Text, View, Dimensions, StyleSheet } from "react-native";

import Carousel, {
  Pagination,
  ParallaxImage,
} from "react-native-snap-carousel"; // Version can be specified in package.json
import { COLORS } from "../constants/Theme";

const screenWidth = Dimensions.get("window").width;

const DATA = [];
for (let i = 0; i < 10; i++) {
  DATA.push(i);
}
const ENTRIES1 = [
  {
    title: "Massive Discount",
    subtitle: "Upto 75% off",
    illustration: "https://i.imgur.com/UYiroysl.jpg",
    key: "1",
  },
  {
    title: "Big Million",
    subtitle: "Upto 60% off",
    illustration: "https://i.imgur.com/UPrs1EWl.jpg",
    key: "2",
  },
  {
    title: "Diwali Offer",
    subtitle: "Upto 40% off",
    illustration: "https://i.imgur.com/MABUbpDl.jpg",
    key: "3",
  },
  {
    title: "Special Offer",
    subtitle: "Upto 80% off",
    illustration: "https://i.imgur.com/KZsmUi2l.jpg",
    key: "4",
  },
  {
    title: "The Big Discount",
    subtitle: "Upto 55% off",
    illustration: "https://i.imgur.com/2nCt3Sbl.jpg",
    key: "5",
  },
];
export class MyCarousel extends Component {
  state = {
    index: 0,
    activeSlide: 0,
  };
  get pagination() {
    const { entries, activeSlide } = this.state;
    return (
      <View style={styles.pagination}>
        <Pagination
          dotsLength={ENTRIES1.length}
          activeDotIndex={activeSlide}
          dotStyle={{
            width: 40,
            height: 10,
            borderRadius: 10,
            marginHorizontal: -7,
            backgroundColor: "rgba(255, 255, 255, 0.92)",
          }}
          inactiveDotStyle={
            {
              // Define styles for inactive dots here
              //backgroundColor: "rgba(255, 255, 255, 0.7)",
            }
          }
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
    );
  }

  constructor(props) {
    super(props);
    this._renderItem = this._renderItem.bind(this);
  }

  _renderItem({ item, index }, parallaxProps) {
    return (
      <View style={styles.item}>
        <ParallaxImage
          source={{ uri: item.illustration }}
          containerStyle={styles.imageContainer}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {item.subtitle}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View>
        <Carousel
          sliderWidth={screenWidth}
          sliderHeight={screenWidth}
          itemWidth={screenWidth - 60}
          data={ENTRIES1}
          renderItem={this._renderItem}
          hasParallaxImages={true}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          enableMomentum={false}
          loop={true}
          lockScrollWhileSnapping={true}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
        />
        {this.pagination}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    width: screenWidth - 60,
    height: 188,
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
    height: 188,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    height: 188,
  },
  title: {
    fontSize: 28,
    color: COLORS.WHITE,
    position: "absolute",
    top: 55,
    textAlign: "center",
    width: "100%",
    fontFamily: "sf-black",
    paddingHorizontal: 15,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.WHITE,
    fontFamily: "sf-medium",
    position: "absolute",
    top: 95,
    width: "100%",
    textAlign: "center",
  },
  pagination: {
    position: "absolute",
    bottom: -10,
    width: "100%",
  },
});
