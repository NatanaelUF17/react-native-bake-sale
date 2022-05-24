import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  PanResponder,
  Animated,
  Dimensions,
  Button,
  Linking,
  ScrollView,
} from 'react-native';
import { priceDisplay } from '../util/util';
import { getDeal } from '../api/data';

const DealItem = ({ initialDealData, resetDeal }) => {
  const [deal, setDeal] = useState(initialDealData);
  const [imageIndex, setImageIndex] = useState(0);

  const imageXPos = new Animated.Value(0);
  const width = Dimensions.get('window').width;

  const imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      imageXPos.setValue(gesture.dx);
    },
    onPanResponderRelease: (event, gesture) => {
      if (Math.abs(gesture.dx) > width * 0.4) {
        const direction = Math.sign(gesture.dx);
        // -1 for left, 1 for right
        Animated.timing(imageXPos, {
          toValue: direction * width,
          duration: 250,
          useNativeDriver: false,
        }).start(() => handleSwipe(-1 * direction));
      } else {
        Animated.spring(imageXPos, {
          toValue: 0,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const handleSwipe = indexDirection => {
    if (!deal.media[imageIndex + indexDirection]) {
      Animated.spring(imageXPos, {
        toValue: 0,
        useNativeDriver: false,
      }).start();
      return;
    }
    setImageIndex(imageIndex + indexDirection);
    imageXPos.setValue(indexDirection * width);
    Animated.spring(imageXPos, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  const openDealUrl = () => {
    Linking.openURL(deal.url);
  };

  useEffect(() => {
    (async () => {
      const dealFound = await getDeal(deal.key);
      setDeal(dealFound);
    })();
  }, [deal.key]);

  return (
    <View style={styles.deal}>
      <TouchableOpacity onPress={() => resetDeal()}>
        <Text style={styles.backLink}>Back</Text>
      </TouchableOpacity>
      <Animated.Image
        {...imagePanResponder.panHandlers}
        source={{ uri: deal.media[imageIndex] }}
        style={[{ left: imageXPos }, styles.image]}
      />
      <ScrollView>
        <View style={styles.detail}>
          <View>
            <Text style={styles.title}>{deal.title}</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.info}>
              <Text style={styles.cause}>{deal.cause.name}</Text>
              <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
            </View>
          </View>
        </View>
        {deal.user && (
          <View style={styles.user}>
            <Image source={{ uri: deal.user.avatar }} style={styles.avatar} />
            <Text>{deal.user.name}</Text>
          </View>
        )}
        <View style={styles.description}>
          <Text>{deal.description}</Text>
        </View>
        <Button title="Buy this deal" onPress={openDealUrl} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  deal: {
    marginBottom: 20,
  },
  backLink: {
    marginBottom: 5,
    color: '#22f',
    marginLeft: 10,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    marginBottom: 5,
    backgroundColor: 'rgba(237, 149, 45, 0.4)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  cause: {
    flex: 2,
  },
  price: {
    flex: 1,
    textAlign: 'right',
  },
  info: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  user: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 25,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
  description: {
    marginHorizontal: 20,
  },
});

export default DealItem;
