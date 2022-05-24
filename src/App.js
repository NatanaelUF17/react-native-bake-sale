import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { getDeals, searchDealsResults } from './api/data';
import DealList from './components/DealList';
import DealDetail from './components/DealDetail';
import SearchBar from './components/SearchBar';

const App = () => {
  const [deals, setDeals] = useState([]);
  const [deal, setDeal] = useState(null);
  const [dealsSearchResults, setDealsSearchResults] = useState([]);
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  let titleXPosition = new Animated.Value(0);

  const animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width - 150;

    Animated.timing(titleXPosition, {
      toValue: direction * (width / 2),
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        animateTitle(-1 * direction);
      }
    });
  };

  useEffect(() => {
    animateTitle();
    (async () => {
      const dealsData = await getDeals();
      setDeals(dealsData);
    })();
  });

  const setDealState = id => {
    if (id) {
      const dealFound = deals.find(x => x.key === id);
      if (dealFound) {
        setDeal(dealFound);
      }
    }
  };

  const setSearchResults = async searchTerm => {
    let results = [];
    if (searchTerm) {
      results = await searchDealsResults(searchTerm);
      setDealsSearchResults(results);
    }
    setDealsSearchResults(results);
    setActiveSearchTerm(searchTerm);
  };

  const resetDeal = () => {
    setDeal(null);
  };

  const dealsToDisplay =
    dealsSearchResults.length > 0 ? dealsSearchResults : deals;

  if (deal) {
    return (
      <SafeAreaView style={styles.main}>
        <DealDetail initialDealData={deal} resetDeal={resetDeal} />
      </SafeAreaView>
    );
  }

  if (dealsToDisplay.length > 0) {
    return (
      <SafeAreaView style={styles.main}>
        <SearchBar
          search={setSearchResults}
          initialSearchTerm={activeSearchTerm}
        />
        <DealList items={dealsToDisplay} onDealPress={setDealState} />
      </SafeAreaView>
    );
  }

  return (
    <Animated.View style={[{ left: titleXPosition }, styles.container]}>
      <Text style={styles.header}>BakeSale</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 40,
  },
  main: {
    marginTop: 30,
  },
});

export default App;
