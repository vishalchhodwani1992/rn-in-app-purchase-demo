import React from 'react';
import {View, Text, FlatList, TouchableOpacity, ActivityIndicator} from 'react-native';
import RNIap, {
  InAppPurchase,
  PurchaseError,
  SubscriptionPurchase,
  consumePurchaseAndroid,
  finishTransaction,
  finishTransactionIOS,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

export default class History extends React.Component {
  
  static navigationOptions = {
    title: 'RECENT TRANSACTIONS',
  };

  constructor(props) {
    super(props);

    this.state = {
      productList: [],
      isLoading: false,
      refreshing: false,
    }
  }

  componentDidMount() {
    this.setState({isLoading: true}, ()=>{
        this.getPurchaseHistory();
    })
  }


  async getPurchaseHistory(){
    try {
      // const purchases = await RNIap.getAvailablePurchases();
      let purchases = await RNIap.getPurchaseHistory();

      if (purchases && purchases.length > 0) {
        // console.log('getAvailablePurchases==', purchases);
        purchases = purchases.filter((item)=> {
          return item.developerPayload && JSON.parse(item.developerPayload) && JSON.parse(item.developerPayload).type === 'inapp';
        })

        purchases.map((item)=>{
          item.developerPayload = JSON.parse(item.developerPayload);
        })
        console.log('getPurchaseHistory==', purchases);
        this.setState({productList: purchases, isLoading: false, refreshing: !this.state.refreshing})
      }
    } catch (err) {
      console.log('getAvailablePurchases: error==', err.message);
      alert(err.message);
    }
  };

  millisToTime(millisec) {
    // millisec = millisec+"";
    const date = new Date(millisec)
    return date.toLocaleString();
}

  componentWillUnmount() {
  }


  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
          
          {
            this.state.isLoading ?
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color="#4da6ff" />
            </View>
            :
              <FlatList 
                style={{flex: 1, backgroundColor: 'white', marginLeft: 15, marginRight: 15, marginTop: 10}}
                data={this.state.productList}
                refreshing={this.state.refreshing}
                renderItem={({item, index})=> {
                  return (<View key={index+""} >
                    <View style={{width: '96%', backgroundColor: 'lightgray', padding: 10, marginLeft: '2%', marginRight: '2%', marginTop: 5, marginTop: 5, marginBottom: 5, borderRadius: 10}}>
                      <Text style={{color: '#333', fontSize: 20, fontWeight: 'bold'}}>{item.developerPayload.title}</Text>
                      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                        <Text style={{color: '#000', fontSize: 12, paddingRight: 10}}>{item.developerPayload.localizedPrice}</Text>
                        <Text style={{color: '#000', fontSize: 12, paddingRight: 10}}>{this.millisToTime(item.transactionDate)}</Text>
                      </View>
                      
                    </View>
                  </View>)
                }}
                keyExtractor={(item, index)=> index+""}
                />
          }
      </View>
    );
  }
}