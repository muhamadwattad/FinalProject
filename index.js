import App from './App';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { React } from 'react'
import { Root } from 'native-base'
import { name as appName } from './app.json';

const FinalApp = () => {

    <Root>
        <App />
    </Root>
}
AppRegistry.registerComponent(appName, () => FinalApp);