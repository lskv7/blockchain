import {useEffect, useState} from "react";
import useEth from "../../contexts/EthContext/useEth";

function AddVoter( ) {
  const { state: { contract, accounts } } = useEth();
  const [newVoter, setNewVoter]=useState()
  useEffect(() => {

  }, []);

  const add=async ()=>{
    if (newVoter === "") {
      alert("Please enter a value to write.");
      return;
    }
    await contract.methods.addVoter(newVoter).send({ from: accounts[0] });
  }

  return (<><input onChange={(value)=>setNewVoter(value.target.value)}/> <button onClick={async ()=>await add()}>Add Voter</button></>);
}

export default AddVoter;
