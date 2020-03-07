import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//admin routes
import homeScreen from '../screens/home';


const stackNavigator = createStackNavigator({
  home: homeScreen,
},
  {
    headerMode: 'none'
  });


export default createAppContainer(stackNavigator);
