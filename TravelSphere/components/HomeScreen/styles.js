import { Button, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  topContainer: {
    flexDirection: 'row',  
    alignItems: 'center',  
    justifyContent: 'space-between',  
    marginBottom: 10,      
  },
  
  profileSection: {
    alignItems: 'flex-start',
    flexDirection: 'column', 
    maxWidth: '80%', 
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap', 
    justifyContent: 'center',
  },
  
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    paddingHorizontal: 5,
    paddingVertical: 5,
    width: '60%', 
    marginBottom:35,
    borderWidth: 2,
  },
  
  inputContainer: {
    flex: 1,
    height: 20,
    paddingHorizontal: 8,
    color: '#000',
    fontWeight: '800'

  },
  
  searchIcon: {
    padding: 5,
  },
  editButton: {
    marginLeft: 10,
    },
    line: {
      height: 3, 
      backgroundColor: '#ccc', 
      width: '100%', 
      position: 'absolute', 
    
     
    }
,  
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
    height: 55,
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


modalContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  padding: 20,
},





profileImageContainer: {
  position: 'relative',
  marginBottom: 15,
},

profileImageModal: {
  width: 120,
  height: 120,
  borderRadius: 60,
  borderWidth: 2,
  borderColor: '#ccc',
},

editIcon: {
  position: 'absolute',
  bottom: 5,
  right: 5,
  backgroundColor: '#4CAF50',
  borderRadius: 15,
  padding: 6,
},

input: {
  width: '100%',
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  padding: 10,
  fontSize: 16,
  marginBottom: 15,
  textAlign: 'center',
},

buttonsContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginTop: 10,
},

saveButton: {
  backgroundColor: '#2196F3',
  paddingVertical: 12,
  borderRadius: 8,
  flex: 1,
  marginRight: 10,
  alignItems: 'center',
},

cancelButton: {
  backgroundColor: '#f44336',
  paddingVertical: 12,
  borderRadius: 8,
  flex: 1,
  alignItems: 'center',
},

buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '500',
},


   profileImagePreviewContainer: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default styles;
