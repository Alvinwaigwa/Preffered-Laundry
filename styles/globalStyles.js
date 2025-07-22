import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center', // Align items at the start
  },
  imageContainer: {
    flex: 0.8, // Adjust this to control image height
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  textContainer: {
    alignItems: 'center', // Center horizontally
    marginTop: 20, // Add some margin for spacing
  },
  welcomeText: {
    color: 'white', // Change text color for better visibility
    fontSize: 55,
    textAlign: 'center', // Center text alignment
  },
  screenText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  createTransactionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  button: {
    backgroundColor: 'purple',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  cancelText: {
    fontSize: 14,
    color: 'white',
  },
  input: {
    width: '96%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#231942',
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginTop: 15,
  },

  // expense/income seg control tab
  sctContainer: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 15,
  },

  tabStyle: {
    backgroundColor: '#f0f0f0',
    borderColor: '#231942',
    padding: 3,
    height: 35,
  },

  // expense/income seg control tab
  activeTabStyle: {
    backgroundColor: '#231942',
    borderColor: 'purple',
  },

  // expense/income seg control tab
  tabTextStyle: {
    color: 'gray',
  },

  // set date
  dateContainer: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    paddingBottom: 30,
  },

  setDateText: {
    position: 'absolute',
    left: 15,
    fontSize: 18,
    marginTop: 5,
  },

  datePicker: {
    position: 'absolute',
    right: 15,
  },

  // header for transaction input
  transactionHeader: {
    width: '100%',
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 5,  // Ensure there's padding on the sides
    marginBottom: 10,
    paddingTop: 40,
  },

  transactionHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',  // Center the text within the header
  },

  categoryOption: {
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  categoryOptionText: {
    fontSize: 16,
    color: '#333',
  },
  categoryModalContainer: {
    backgroundColor: 'white',
    marginTop: '50%',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    // Android shadow
    elevation: 5,
  },
  categoryList: {
    maxHeight: 300,
  },
  closeCategoryModal: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#231942',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeCategoryText: {
    color: 'white',
    fontWeight: 'bold',
  },
});