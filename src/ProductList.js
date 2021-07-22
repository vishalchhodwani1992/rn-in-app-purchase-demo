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

const itemSkus = Platform.select({
  ios: [
    'com.edge.mobile.inapppurchasedemo'
  ],
  android: [
    'com.edge.mobile.inapppurchasedemo', '105', '106', '107'
  ]
});


let purchaseUpdateSubscription;
let purchaseErrorSubscription;

export default class ProductList extends React.Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
    title: 'PLANS',
    headerRight: () => (
      <TouchableOpacity style={{paddingRight: 15}}
        onPress={() => navigation.navigate('History')}
      >
        <Text style={{color: 'white', fontSize: 16}}>History</Text>
      </TouchableOpacity>
    )
  }};

  constructor(props) {
    super(props);

    this.state = {
      productList: [],
      isLoading: false,
    }
  }

  componentDidMount() {
    this.initiateIAP();
  }

  initiateIAP(){
    this.getProducts().then((products)=> {
      if(products){
        this.setPurchaseListener();
      }
    })
  }

  async getProducts(){
    this.setState({isLoading: true})
    try{
      const result = await RNIap.initConnection();
      if(result){
        let products = await RNIap.getProducts(itemSkus);
        console.log('products==', products);
        await this.setState({isLoading: false, productList: products});

        return products;
      }
      else{
        return result;
      }

    }
    catch(error){
      this.setState({isLoading: false})   
    }
  }
  
  setPurchaseListener(){
    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase) => {
        let receipt = purchase.transactionReceipt;
        receipt = JSON.parse(receipt);
        console.log('purchase==', purchase);
        if (receipt) {
          try {         
            // switch(purchase.purchaseStateAndroid){
            //   case 1:
            //       let ackResult = await finishTransaction(purchase, true, this.getPayload(purchase.productId));
            //       console.log('ackResult==', ackResult);
            //       this.setState({ receipt }, () => {
            //         alert('You have successfully purchased\norderId: '+receipt.orderId+"\npurchaseToken: "+receipt.purchaseToken)
            //       });
            //     break;
            //   case 2:
            //       alert('Your last order, orderId: '+receipt.orderId+" is pending from bank and will updated soon");
            //     break;
            // }
              const ackResult = await finishTransaction(purchase, true, this.getPayload(purchase.productId));
              console.log('ackResult==', ackResult);
              this.setState({ receipt }, () => {
                alert('You have successfully purchased\norderId: '+receipt.orderId)
              });
          } catch (ackErr) {
            console.log('ackErr==', ackErr);
            if(ackErr === 'Error: Purchase failed with code: 8'){
              alert('Your last order, orderId: '+receipt.orderId+" is falled due payment declined");
            }
          }
        }
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error) => {
        console.log('purchaseErrorListener==', error.message);
        alert(error.message);
      },
    );
  }

  getPayload(productId){

    let payloadData = undefined;
    for(let i=0 ; i<this.state.productList.length ; i++){
      if(this.state.productList[i].productId == productId){
        payloadData = JSON.stringify(this.state.productList[i]);
        break;
      }
    }
    return payloadData;
  }


  componentWillUnmount() {
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }
    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }
  }

  requestSubscription = (item) => {
    try {
      console.log('requestSubscription==', item);
      
      RNIap.requestPurchase(item.productId);
    } catch (err) {
      alert(err.message);
    }
  };

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
                renderItem={({item, index})=> {
                  return (<View key={index+""} >
                    <TouchableOpacity onPress={()=> this.requestSubscription(item) } style={{width: '96%', backgroundColor: item.isPurchased ? 'lightgray' : '#ffeba8', padding: 10, marginLeft: '2%', marginRight: '2%', marginTop: 5, marginTop: 5, marginBottom: 5, borderRadius: 10}}>
                      <Text style={{color: '#333', fontSize: 20, fontWeight: 'bold'}}>{item.title}</Text>
                      <Text style={{color: '#000', fontSize: 16}}>{item.description}</Text>
                      <Text style={{color: '#000', fontSize: 20, textAlign: 'right', paddingRight: 10}}>{item.localizedPrice}</Text>
                    </TouchableOpacity>
                  </View>)
                }}
                keyExtractor={(item, index)=> index+""}
                />
          }
      </View>
    );
  }
}

const list = [
  {
    productId:'android.test.purchased',
    title: 'Test success',
    description: 'Success purchase of test plan',
    localizedPrice: 'Free'
  },
  {
    productId:'android.test.canceled',
    title: 'Test canceled',
    description: 'Canceled purchase of test plan',
    localizedPrice: 'Free'
  },  
]