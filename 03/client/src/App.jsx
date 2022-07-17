import {EthProvider} from "./contexts/EthContext";
import "./App.css";
import 'antd/dist/antd.css';
import AppMenu from "./Menu";
import Address from "./components/Address";

function App() {
    return (
        <EthProvider>
            <div id="App">
                <Address/>
                <div className="container">
                    <AppMenu/>
                </div>
            </div>
        </EthProvider>
    );
}

export default App;
