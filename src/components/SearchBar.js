import React, { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import debounce from 'lodash.debounce';

const SearchBar = ({ search, initialSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputElement, setInputElement] = useState();

  const searchDeals = searchPredicate => {
    search(searchPredicate);
    inputElement.blur();
  };

  const debouncedSearch = debounce(searchDeals, 300);

  const handleChange = predicate => {
    setSearchTerm(predicate);
    debouncedSearch(searchTerm);
  };

  return (
    <TextInput
      ref={input => setInputElement(input)}
      style={styles.input}
      placeholder="Search all deals"
      onChangeText={handleChange}
      value={searchTerm}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    marginHorizontal: 12,
  },
});

export default SearchBar;
