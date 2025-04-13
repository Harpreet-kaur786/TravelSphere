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

borderColor: '#ddd',  

borderRadius: 8,  

paddingHorizontal: 10, 

paddingVertical: 5, 

width: '60%',  

marginBottom: 20, 

backgroundColor: '#FFF', 

}, 

inputContainer: { 

flex: 1, 

height: 40, // Increased height for better visibility 

paddingHorizontal: 8, 

fontWeight: '800', 

color: '#000', // Ensure text color is applied 

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

backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for a modern look 

padding: 20, 

}, 

modalContent: { 

width: '90%', 

backgroundColor: '#fff', 

borderRadius: 15, 

padding: 20, 

alignItems: 'center', 

elevation: 5, // Adds shadow for Android 

shadowColor: '#000', 

shadowOffset: { width: 0, height: 2 }, 

shadowOpacity: 0.2, 

shadowRadius: 5, 

}, 

profileImagePreviewContainer: { 

justifyContent: 'center', 

alignItems: 'center', 

marginBottom: 15, 

}, 

profileImageModal: { 

width: 120, 

height: 120, 

borderRadius: 60, 

borderWidth: 2, 

borderColor: '#ddd', 

}, 

editIcon: { 

position: 'absolute', 

bottom: 0, 

right: 5, 

backgroundColor: '#4CAF50', 

borderRadius: 20, 

padding: 6, 

elevation: 5, 

}, 

input: { 

width: '100%', 

borderWidth: 1, 

borderColor: '#ccc', 

borderRadius: 8, 

padding: 12, 

fontSize: 16, 

marginBottom: 15, 

textAlign: 'center', 

backgroundColor: '#f8f8f8', 

}, 

uploadButton: { 

backgroundColor: '#4CAF50', 

paddingVertical: 12, 

paddingHorizontal: 15, 

borderRadius: 8, 

marginBottom: 15, 

alignItems: 'center', 

}, 

uploadButtonText: { 

color: '#fff', 

fontSize: 16, 

fontWeight: '600', 

}, 

buttonsContainer: { 

flexDirection: 'row', 

justifyContent: 'space-between', 

width: '100%', 

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

TravelSection:{ 

fontSize: 20, fontWeight: "bold", marginLeft: 20, marginBottom: 10 

}, 

categoryContainer: { 

flexDirection: 'row', 

marginTop: 5, 

marginBottom: 0, 

}, 

categoryButton: { 

flexDirection: 'row', 

alignItems: 'center', 

padding: 10, 

marginRight: 20, 

backgroundColor: '#f0f0f0', 

borderRadius: 10, 

}, 

categoryImage: { 

width: 20, 

height: 20, 

marginRight: 10, 

}, 

categoryText: { 

fontSize: 16, 

fontWeight: 'bold', 

}, 

regionTabs: { 

flexDirection: 'row', 

paddingVertical: 10,  

paddingHorizontal: 5,  

}, 

regionButton: { 

backgroundColor: '#4CAF50',  

paddingVertical: 10,  

paddingHorizontal: 15,  

borderRadius: 10, // Reduce border radius for a more box-like appearance 

marginRight: 10,  

width: 100, // Set a fixed width to make it more box-like 

height: 50, // Reduce height 

justifyContent: 'center', // Center text vertically 

alignItems: 'center', // Center text horizontally 

}, 

regionText: { 

color: 'white', 

fontSize: 14,  

fontWeight: 'bold', 

}, 

sectionTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 }, 

destinationCard: { width: 150, backgroundColor: '#fff', borderRadius: 10, marginRight: 10, padding: 10 }, 

destinationImage: { width: '100%', height: 100, borderRadius: 10 }, 

destinationName: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 }, 

rating: { fontSize: 14, color: 'gold' },

tutorialCard: {
  backgroundColor: '#fff',
  borderRadius: 15,
  color: '#0e73c0',
  paddingVertical: 10,
  paddingHorizontal: 15,
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 20,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 5,
  elevation: 4,
},


}); 

export default styles; 