import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  searchIcon: {
    padding: 10,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    marginTop: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  detailsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  detailsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
  

    filterContainer: {
      marginBottom: 20,
    },
    filterTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    filterToggle: {
      padding: 5,
    },
    picker: {
      height: 50,
      width: '100%',
      marginBottom: 10,
    },
    resetButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 8,
      marginBottom: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    applyButton: {
      backgroundColor: '#4CAF50',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    applyText: {
      color: '#fff',
      fontSize: 16,
    },
    detailsLink: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailsText: {
      color: '#4CAF50',
    },
    card: {
      backgroundColor: '#FFF',
      borderRadius: 8,
      marginBottom: 10,
      flexDirection: 'row',
      padding: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
    },
    image: {
      width: 100,
      height: 100,
      borderRadius: 8,
      marginRight: 10,
    },
    cardContent: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    description: {
      fontSize: 14,
      color: '#555',
    },
});

export default styles;
