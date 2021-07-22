

import {
    createStackNavigator,
  } from 'react-navigation-stack';
import Home from './Home';
import ProductList from './ProductList';
import { createAppContainer } from 'react-navigation';
import History from './History';
import Login from './Login';
import Dashboard from './Dashboard';
  
const HomeNavigator = createStackNavigator({
    Dashboard: Dashboard,   
    Login: Login,   
    Home: Home,   
    ProductList: ProductList,    
    History: History,  
},
{
    initialRouteName: 'Dashboard',
    defaultNavigationOptions: {
        headerStyle: {
          backgroundColor: '#4da6ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
      },
});


export default createAppContainer(HomeNavigator);
