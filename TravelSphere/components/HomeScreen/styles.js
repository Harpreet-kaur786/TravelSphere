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
    fontSize: 16,
    color: '#333',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006A4E',
    marginBottom: 5,
    fontFamily: 'Georgia',
  },
  category: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2B65EC',
    marginTop: 5,
    marginBottom: 5,
    fontFamily: 'Palatino', // Add a beautiful font here
  },
  country: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2B65EC',
    marginTop: 5,
    marginBottom: 5,
    fontFamily: 'Palatino', // Add a beautiful font here
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
});

export default styles;
