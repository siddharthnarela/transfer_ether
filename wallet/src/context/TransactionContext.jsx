import React, {useState, useEffect, createContext} from 'react';
import {ethers} from 'ethers';


const ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "keyword",
          "type": "string"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "receiver",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "message",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "keyword",
          "type": "string"
        }
      ],
      "name": "addToBlockchain",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllTransactions",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "sender",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "receiver",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "message",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "keyword",
              "type": "string"
            }
          ],
          "internalType": "struct Transactions.TransferStruct[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllTransactionCount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]

const contractAddress = "0xF3eF537234a9e7DD47dE6678A354be216C6571Fe";

export const TransactionContext = createContext();

const {ethereum} = window;

const getEthereumContract =  () => {
    // const provider = new ethers.providers.Web3Provider(ethereum);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, ABI, signer);

    console.log( 
        provider,
        signer,
        contract
    )
}


export const TransactionProvider = ({children}) => {

  const [connectedAccount, setConnectedAccount] = useState()
  const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''})
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));

  const handleChange = (e, name) => {
    setFormData((prevState) => ({...prevState, [name]: e.target.value}));
  }

  const checkIfwalletIsConnected = async () => {

    try {
      if(!ethereum) return alert("Please install MetaMask");
    
    const accounts = await ethereum.request({ method:'eth_accounts'})

    if(accounts.length){
      setConnectedAccount(accounts[0]);
    } else {
      console.log("No accounts found");
    }

    console.log(accounts[0]);

    } catch (error) {
      console.log(error);

      throw new Error("No Ethereum Object")
    }
    
  }

  const connectWallet = async () => {
    try {
    if(!ethereum) return alert("Please install MetaMask");

    const accounts = await ethereum.request({ method:'eth_requestAccounts'})
    setConnectedAccount(accounts[0]);

    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object");
    }
  }

  const sendTrasaction = async () => {
    try {
      if(!ethereum) return alert("Please install MetaMask");

      const { addressTo, amount, keyword, message } = formData;

      const transactionContract = getEthereumContract();
      // const parsedAmount = ethers.utils.parseEther(amount);
      const parsedAmount = ethers.utils.parseUnits(amount.toString(), 'ether');

      await ethereum.request({
        method: 'eth_sendTransaction',
        params:[{
          from: connectedAccount,
          to: addressTo,
          gas: '0x5208', // 21000 GWEI
          value: parsedAmount._hex,
        }]
      })

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber());

    } catch (error) {
      console.log(error);
      throw new Error("No Ethereum Object");
    }
  }

  useEffect(()=> {
    checkIfwalletIsConnected();
  },[])

  return (
    <TransactionContext.Provider value={{ connectWallet, connectedAccount, formData, setFormData, handleChange, sendTrasaction }}>
        {children}
    </TransactionContext.Provider>
  )
}
