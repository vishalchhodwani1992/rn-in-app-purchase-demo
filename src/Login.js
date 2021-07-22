import React from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import WebView from 'react-native-webview';
import CookieManager from 'react-native-cookies';



const LOGIN_URL = 'https://labs.developer.ibm.com/labs/learn.html';
// const LOGIN_URL = 'https://identity-1.us-south.iam.cloud.ibm.com/oidc/authorize?client_id=digital-nation-africa&redirect_uri=https://labs.developer.ibm.com/labs/learn.html&response_type=code';

// const SIGNUP_URL = LOGIN_URL;

export default class Login extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('title', ''),
        };
        };

  constructor(props) {
    super(props);

    this.state = {
      currentUrl: LOGIN_URL,
    }
  }

  componentDidMount() {

    // if(this.props.navigation.getParam('type', '') === 'signup'){
    //     this.setState({currentUrl: SIGNUP_URL})
    // }

  }

  disableZoom() {
    return `const meta = document.createElement('meta');
    meta.setAttribute('content', 'content="width=device-width, initial-scale=1.0, maximum-scale=0.99, user-scalable=0"');
    meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `
  }

  
  _onMessage = (event) => {
    const { data } = event.nativeEvent;
    // console.log('event==', event);
    // console.log('data==', data);
    
    try{

      if(data && data.includes('"type":"cookie"')){

        let myData = JSON.parse(data);
        let cookieString = myData.cookies;
  
        let cookieArr = cookieString.split(";");
        // console.log('cookieArr==', cookieArr);
        
        let cookieData = {};
        for (let i=0 ; i<cookieArr.length ; i++) {
          let item = cookieArr[i].split("=");
          cookieData[item[0].trim()] = item[1];
        }
  
        // console.log('cookieData==', JSON.stringify(cookieData));
        
      }
    }
    catch(error){
      console.log('_onMessage==', error);
      
    }
  }

  render() {
    let jsCode = `let data = {type: 'cookie', cookies: document.cookie};
     data = JSON.stringify(data)
     window.ReactNativeWebView.postMessage(data);`;
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
          <WebView 
            source={{uri: this.state.currentUrl}}
            onMessage={this._onMessage}
            startInLoadingState={true}
            incognito={true}
            onLoadEnd={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.log('nativeEvent.url==', nativeEvent.url);
                // if (nativeEvent.url == SUCCESS_URL) {
                    // console.log('onLoadEnd:nativeEvent==', nativeEvent);                    
                    this.webref.injectJavaScript(jsCode);
                // }
            }}
            onHttpError={(error)=> {
              console.log('onHttpError==', error);
            }}
            onError={(error)=> {
              console.log('onError==', error);
            }}
            originWhitelist={['*']}
            javaScriptEnabled={true}

            ref={r => (this.webref = r)}
            injectedJavaScript = {this.disableZoom()}
          />
      </View>
    );
  }
}
