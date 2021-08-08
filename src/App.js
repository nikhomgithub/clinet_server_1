
import React from 'react';

import {Route,Switch,Redirect} from 'react-router-dom';

import Navbar from './component/navbar/Navbar'

import Home from './page/home/Home'
import ShopWelcome from './page/shop/ShopWelcome'
import UserWelcome from './page/user/UserWelcome'
import BasicData from './page/basicdata/BasicData'
import Job from './page/job/Job'

//import Product from './page/product/Product'


import {MainContext} from './context/MainContext';

import './App2.css'

function App() {

const {username,setUsername,
   reloadCheckToken,setReloadCheckToken,
   haveShopToken,setHaveShopToken,
   haveUserToken,setHaveUserToken,
   userName,setUserName,
   basicData,myheader
}=React.useContext(MainContext)

let temp=window.location.href.split("/")
const home=`${temp[0]}//${temp[2]}/home`


return(
<div className="bgc-lightGray" style={{height:"100vh",width:"100vw"}}>
   <div className="h-5">
         <Navbar/>   
   </div>

   <div className="h-95">
      <Switch>
         <Route path="/home" component={() => window.location.href = home} />
         <Route exact path="/fp/shop" component={haveShopToken?UserWelcome:ShopWelcome}/>
         <Route exact path="/fp/user" component={haveShopToken?UserWelcome:ShopWelcome}/> 
         <Route exact path="/fp/basicdata" 
            component={haveShopToken?(haveUserToken?BasicData:UserWelcome):ShopWelcome} /> 
         <Route exact path="/fp/job" 
            component={haveShopToken?(haveUserToken?Job:UserWelcome):ShopWelcome} />    
      </Switch>
   </div>

</div>
)

}
export default App;
