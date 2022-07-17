import {EthProvider} from "./contexts/EthContext";
import Intro from "./components/Intro/";
import Footer from "./components/Footer";
import "./App.css";
import WhiteList from "./components/WhiteList";
import useEth from "./contexts/EthContext/useEth";
import Workflow from "./components/Workflow";
import Proposal from "./components/Proposal";
import Vote from "./components/Vote";
import Tally from "./components/Tally";

function App() {



  return (
    <EthProvider>
      <div id="App" >
        <div className="container">

          <Intro />
          <hr />
          <WhiteList />
          <hr />
          <Workflow />
          <hr />
          <Proposal/>
          <hr />
          <Vote/>
          <hr />
          <Tally/>
          <hr />
          <Footer />
        </div>
      </div>
    </EthProvider>
  );
}

export default App;
