import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import classes from './App.module.css';
import TestToken from '../src/abis/TestToken.json';
import TokenStaking from '../src/abis/TokenStaking.json';
import Staking from './components/Staking';
import AdminTesting from './components/AdminTesting';
import Navigation from './components/Navigation';
import Sidebar from './Sidebar';

const App = () => {
  const [account, setAccount] = useState('Connecting to Metamask..');
  const [network, setNetwork] = useState({ id: '0', name: 'none' });
  const [testTokenContract, setTestTokenContract] = useState('');
  const [tokenStakingContract, setTokenStakingContract] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [totalStaked, setTotalStaked] = useState([0, 0]);
  const [myStake, setMyStake] = useState([0, 0]);
  const [appStatus, setAppStatus] = useState(true);
  const [loader, setLoader] = useState(false);
  const [userBalance, setUserBalance] = useState('0');
  const [apy, setApy] = useState([0, 0]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    //connecting to ethereum blockchain
    const ethEnabled = async () => {
      fetchDataFromBlockchain();
    };

    ethEnabled();
  }, []);

  const fetchDataFromBlockchain = async () => {
    if (window.ethereum) {
      // await window.ethereum.send('eth_requestAccounts');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      window.web3 = new Web3(window.ethereum);

      //connecting to metamask
      let web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(accounts);

      //loading users network ID and name
      const networkId = await web3.eth.net.getId();
      const networkType = await web3.eth.net.getNetworkType();
      setNetwork({ ...network, name: networkType });

      //loading TestToken contract data
    const testTokenData = TestToken;
      if (testTokenData) {
        let web3 = window.web3;
        const testToken = new web3.eth.Contract(
          TestToken,
          '0xd4eb79a193e7e1a7b998202a9407e5ce3ff02b4f'
        );
        setTestTokenContract(testToken);
        //  fetching balance of Testtoken and storing in state
        let testTokenBalance = await testToken.methods
          .balanceOf(accounts[0])
          .call();
        let convertedBalance = window.web3.utils.fromWei(
          testTokenBalance.toString(),
          'Gwei'
        );
        setUserBalance(convertedBalance);

       /* //fetching contract balance
        //updating total staked balance
        const tempBalance = TokenStaking.networks[networkId];
        let totalStaked = await testToken.methods
          .balanceOf(tempBalance.address)
          .call();

        convertedBalance = window.web3.utils.fromWei(
          totalStaked.toString(),
          'Ether'
        );
        //removing initial balance
        setContractBalance(convertedBalance);
      } else {
        setAppStatus(false);
        window.alert(
          'TestToken contract is not deployed on this network, please change to testnet'
        );*/
      } 

      //loading TokenStaking contract data
      const tokenStakingData = TokenStaking;

      if (tokenStakingData) {
        let web3 = window.web3;
        const tokenStaking = new web3.eth.Contract(
          TokenStaking,
          '0x6D983c97175122ca8D757147Ee5dcEf32d2549Bd'
        );
        setTokenStakingContract(tokenStaking);
        //  fetching total staked TokenStaking  and storing in state
        let myStake = await tokenStaking.methods
          .balanceOf(accounts[0])
          .call();

        let convertedBalance = window.web3.utils.fromWei(
          myStake.toString(),
          'Gwei'
        );

        let myCustomStake = await tokenStaking.methods
          .stake(accounts[0])
          .call();

        let tempCustomdBalance = window.web3.utils.fromWei(
          myCustomStake.toString(),
          'Gwei'
        );

        setMyStake([convertedBalance, tempCustomdBalance]);

        //checking totalStaked
        let tempTotalStaked = await tokenStaking.methods.totalStaked().call();
        convertedBalance = window.web3.utils.fromWei(
          tempTotalStaked.toString(),
          'Gwei'
        );
        let tempcustomTotalStaked = await tokenStaking.methods
          .customTotalStaked()
          .call();
        let tempconvertedBalance = window.web3.utils.fromWei(
          tempcustomTotalStaked.toString(),
          'Gwei'
        );
        setTotalStaked([convertedBalance, tempconvertedBalance]);

        //fetching APY values from contract
        let tempApy =
          ((await tokenStaking.methods.defaultAPY().call()) / 1000) * 365;
        let tempcustomApy =
          ((await tokenStaking.methods.customAPY().call()) / 1000) * 365;
        setApy([tempApy, tempcustomApy]);
      } else {
        setAppStatus(false);
        window.alert(
          'TokenStaking contract is not deployed on this network, please change to testnet'
        );
      }

      //removing loader
      setLoader(false);
    } else if (!window.web3) {
      setAppStatus(false);
      setAccount('Metamask is not detected');
      setLoader(false);
    }
  };

  const inputHandler = (received) => {
    setInputValue(received);
  };

  const changePage = () => {
    if (page === 1) {
      setPage(2);
    } else if (page === 2) {
      setPage(1);
    }
  };

  const stakeHandler = () => {
    if (!appStatus) {
    } else {
      if (!inputValue || inputValue === '0' || inputValue < 0) {
        setInputValue('');
      } else {
        setLoader(true);
        let convertToWei = window.web3.utils.toWei(inputValue, 'Gwei');

        //aproving tokens for spending
        tokenStakingContract.methods
          .stake(convertToWei)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            if (page === 1) {
              tokenStakingContract.methods
                .stake(convertToWei)
                .send({ from: account })
                .on('transactionHash', (hash) => {
                  setLoader(false);
                  fetchDataFromBlockchain();
                })
                .on('receipt', (receipt) => {
                  setLoader(false);
                  fetchDataFromBlockchain();
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                  setLoader(false);
                  fetchDataFromBlockchain();
                });
            } else if (page === 2) {
              tokenStakingContract.methods
                .stake(convertToWei)
                .send({ from: account })
                .on('transactionHash', (hash) => {
                  setLoader(false);
                  fetchDataFromBlockchain();
                })
                .on('receipt', (receipt) => {
                  setLoader(false);
                  fetchDataFromBlockchain();
                })
                .on('confirmation', (confirmationNumber, receipt) => {
                  setLoader(false);
                  fetchDataFromBlockchain();
                });
            }
          })
          .on('error', function(error) {
            setLoader(false);
            console.log('Error Code:', error.code);
            console.log(error.message);
          });
        setInputValue('');
      }
    }
  };

  const unStakeHandler = () => {
    if (!appStatus) {
    } else {
      setLoader(true);

      let convertToWei = window.web3.utils.toWei(inputValue, 'Gwei')
      if (page === 1) {
        tokenStakingContract.methods
          .withdraw(convertToWei)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('receipt', (receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('error', function(error) {
            console.log('Error Code:', error.code);
            console.log(error.message);
            setLoader(false);
          });

        setInputValue('');
      } else if (page === 2) {
        tokenStakingContract.methods
          .withdraw(convertToWei)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('receipt', (receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            setLoader(false);
            fetchDataFromBlockchain();
          })

          .on('error', function(error) {
            console.log('Error Code:', error.code);
            console.log(error.message);
            setLoader(false);
          });
        setInputValue('');
      }
    }
  };

  const redistributeRewards = async () => {
    if (!appStatus) {
    } else {
      setLoader(true);
      tokenStakingContract.methods
        .redistributeRewards()
        .send({ from: account })
        .on('transactionHash', (hash) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('receipt', (receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('error', function(error) {
          console.log('Error Code:', error.code);
          console.log(error.code);
          setLoader(false);
        });
    }
  };

  const redistributeCustomRewards = async () => {
    if (!appStatus) {
    } else {
      setLoader(true);
      tokenStakingContract.methods
        .customRewards()
        .send({ from: account })
        .on('transactionHash', (hash) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('receipt', (receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('error', function(error) {
          console.log('Error Code:', error.code);
          console.log(error.code);
          setLoader(false);
        });
    }
  };

  const claimTst = async () => {
    if (!appStatus) {
    } else {
      setLoader(true);
      tokenStakingContract.methods
        .claimTst()
        .send({ from: account })
        .on('transactionHash', (hash) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('receipt', (receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('error', function(error) {
          console.log('Error Code:', error.code);
          console.log(error.code);
          setLoader(false);
        });
    }
  };

  return (
    <div className={classes.Grid}>
       <Sidebar pageWrapId={'page-wrap'} outerContainerId={'outer-container'} />
      {loader ? <div className={classes.curtain}></div> : null}
      <div className={classes.loader}></div>
      <div className={classes.Child}>
        <Navigation apy={apy} changePage={changePage} />
        <div>
          <Staking
            account={account}
            totalStaked={page === 1 ? totalStaked[0] : totalStaked[1]}
            myStake={page === 1 ? myStake[0] : myStake[1]}
            userBalance={userBalance}
            unStakeHandler={unStakeHandler}
            stakeHandler={stakeHandler}
            inputHandler={inputHandler}
            apy={page === 1 ? apy[0] : apy[1]}
            page={page}
          />
        </div>
        <div className={classes.for_testing}>
          <AdminTesting
            network={network}
            tokenStakingContract={tokenStakingContract}
            contractBalance={contractBalance}
            redistributeRewards={
              page === 1 ? redistributeRewards : redistributeCustomRewards
            }
            claimTst={claimTst}
            page={page}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
