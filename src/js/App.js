App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  TokenPrice: 6389183492737200,
  TokensSold: 0,
  TokensAvailable: 555555,
  init: () => {
    console.log("Page loaded");
    App.initWeb3();
  },
  initWeb3: () => {
    if (typeof web3 !== 'undefined') {
     
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider("http://localhost:8545");
      web3 = new Web3(App.web3Provider);
    }
    console.log(App.web3Provider);
    return App.initContracts();
  },
  initContracts:() => {
    $.getJSON("DoroSale.json",(doroSale) => {
      console.log("doroSale1 ",doroSale);
      App.contracts.DoroSale = TruffleContract(doroSale);
      App.contracts.DoroSale.setProvider(App.web3Provider);
      App.contracts.DoroSale.deployed().then((doroSale) => {
        // console.log("doroSale ",doroSale);
        console.log("doroSale.address ",doroSale.address);
      })
    }).done(() => {
      $.getJSON("DoroToken.json",(doroToken) => {
        App.contracts.DoroToken = TruffleContract(doroToken);
        App.contracts.DoroToken.setProvider(App.web3Provider);
        App.contracts.DoroToken.deployed().then((doroToken) => {
          // console.log("doroToken ",doroToken);
          console.log("doroToken.address ",doroToken.address);
        })
      }).done(() => {

    return App.render();
      });
    });

  },
  render: () => {
    web3.eth.getCoinbase((err, account) => {
      console.log(err, account);
      App.account = account; 
      document.getElementById("myAcount").innerHTML = "My Account " + account;
      
    });
    // console.log(App.contracts);
    App.contracts.DoroSale.deployed().then((instance) => {
      doroTokenInstance = instance;
      console.log(doroTokenInstance);
      return doroTokenInstance.tokenPrice();
    }).then((tokenPrice) => {
      App.TokenPrice = tokenPrice;
      document.getElementById("token-price").innerHTML = web3.fromWei(App.TokenPrice, "ether").toNumber();
      console.log(App.TokenPrice); 
      return doroTokenInstance.tokensSold();
    }).then((TokensSold) => {
      App.TokensSold = TokensSold;
      document.getElementById("tokens-sold").innerHTML = App.TokensSold.toNumber();
      document.getElementById("tokens-available").innerHTML = App.TokensAvailable;
      console.log(App.TokensSold); 


      App.contracts.DoroToken.deployed().then((instance) => {
        doroTokenInstance  = instance;
        return doroTokenInstance.balanceOf(App.account);
      }).then((balance) => {
        document.getElementById("doro-balance").innerHTML = balance.toNumber();

      })
    })
  }
}


function onLoad(){
  App.init();
}