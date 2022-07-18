import "./App.css";
import {Tabs} from "antd";
import 'antd/dist/antd.css';
import {useOwner} from "./contexts/EthContext/useOwner";
import {useVoter} from "./contexts/EthContext/useVoter";
import Intro from "./components/Home";
import Dapp from "./components/Dapp";

function AppMenu() {

    return (
        <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Home" key="1">
                <Intro/>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Proposals"  key="2">
                <Dapp/>
            </Tabs.TabPane>
        </Tabs>

    );
}

export default AppMenu;
