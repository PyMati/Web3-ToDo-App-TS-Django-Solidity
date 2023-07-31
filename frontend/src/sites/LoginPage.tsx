import React from "react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/loginpage.css'
import detectEthereumProvider from '@metamask/detect-provider';
import { Task } from "../intsandtypes/Task";
import { Smartcontract_ABI } from "../abi";
import * as ethers from 'ethers';

interface UserAddressSetter {
  setter: (add: string) => void,
  connectionsetter: (bl: boolean) => void,
  taskList: Task[],
  taskHandler: (newTaskList: any) => void,
  smartContractSetter: (smrtContr: ethers.Contract) => void,
  smrtContract: ethers.Contract | undefined,
};

export const LoginPage: React.FC<UserAddressSetter> = props => {
    const [hasProvider, setHasProvider] = useState<boolean | null>(null)
    const initialState = { accounts: [] }
    const [wallet, setWallet] = useState(initialState)
    const isMounted = useRef(false);
    const [displayRegisterMsg, setRegisterMsg] = useState(false);
    const [firstTime, setFirstTime] = useState(false);

    useEffect(() => {
      const getProvider = async () => {
        const provider = await detectEthereumProvider({ silent: true })
        setHasProvider(Boolean(provider))
      }
      getProvider()
    }, [])

    useEffect(() => {
      // Set smart contract and show connected wallet
      const setSmartContract = async () => {
        const provider = new ethers.BrowserProvider(window.ethereum, 'sepolia');
        const erc20 = new ethers.Contract('0x86c5158e9FD90F67c6038448E6f42F39472d51AB', Smartcontract_ABI, await provider.getSigner());
        props.smartContractSetter(erc20);
      };
      if(isMounted.current){
        setSmartContract();
      }
    }, [wallet.accounts[0]]);

    useEffect(() => {
      const checkRegistration = async () => {
        if(!await props.smrtContract!.isRegistered()){
          setRegisterMsg(true);
          await props.smrtContract!.registerUser();
          setFirstTime(true);
        }
        else {
          fetchData();
        }
      };
      if(isMounted.current){
        checkRegistration();
      }
    }, [props.smrtContract]);

    useEffect(() => {
      if(wallet.accounts.length > 0 && isMounted.current){
        props.connectionsetter(true);
      }
    }, [props.taskList]);

    useEffect(() => {
      if(firstTime && isMounted.current){
        props.connectionsetter(true);
      }
    }, [firstTime])

    const fetchData = async () => {
      await axios.get("http://127.0.0.1:8000/api", {
        headers: {
          "Content-Type": 'application/json'
        },
        params: {
          wallet: JSON.stringify(wallet.accounts[0])
        }
      }).then(resp => {
        props.taskHandler(resp.data.data as Task[])
      })
    }

    const updateWallet = async (accounts:any) => {
      setWallet({ accounts })
    }

    const handleConnect = async () => {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })
      await updateWallet(accounts)
      props.setter(accounts[0]);
      isMounted.current = true;
    }   

    return(
        <>
        <div className="d-flex align-items-center justify-content-center full-site">
          <div className="container-fluid">
            <div className="row justify-content-center">
              <div className="col-xl-3 col-sm-4 login-holder">
                <h5>Enter your decentralized ToDo App.</h5>
                { displayRegisterMsg ? <div className="errormsg"> You have to register on smart contract. Please accept transaction after clicking connect metamask.</div> : null }
                { hasProvider ? null : <div className="errormsg"> If you see this message it means that you don't have metamask installed. You have to do it in order to use this app.</div>}
                { hasProvider ? <button onClick={handleConnect} className="btn-padding btn btn-dark">Connect MetaMask</button>: null}
              </div>
            </div>
          </div>
        </div>
        </>
    );
};