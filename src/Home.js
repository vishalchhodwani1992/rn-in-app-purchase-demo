import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';


export default class Home extends React.Component {

  static navigationOptions = {
    title: 'HOME',
  };

  constructor(props) {
    super(props);

    this.state = {
      currentPlan: {title: 'Weekly'},
    }
  }

  componentDidMount() {
    this.getCurrentPlan();
  }

  getCurrentPlan(){

  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity style={{elevation: 10,  backgroundColor: '#4da6ff', justifyContent: 'center', alignItems: 'center', paddingLeft: 40, paddingRight: 40, paddingTop: 15, paddingBottom: 15, borderRadius: 10}} 
          onPress={() => this.props.navigation.navigate('ProductList')}>
            <Text style={{color: 'white', fontSize: 20}}> Get All Products</Text>
          </TouchableOpacity>
      </View>
    );
  }
}
