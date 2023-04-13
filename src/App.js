
import './App.css';
import { Routes, Route } from 'react-router';
import NavBar from './pages/navbarpage/navBar';
import GroupChatPage from './pages/groupchats/groupChat';
import Dms from './pages/directmsgs/dms'
import LoginPage from './pages/loginpage/loginPage';
import Channel from './components/channelComp/channel';
import HomePage from './pages/homepage/homePage';
import FriendsPage from './pages/friendspage/friendsPage';
import ProfilePage from './pages/profilepage/profilePage';
import SearchPage from './pages/searchpage/searchPage';
import MOON1 from './images/moon2.png'
import SUN from './images/sun.png'
import { useContext } from 'react';
import Docs from './pages/docspage/docsPage';
import DocsStart from './pages/docspage/docsStart';
import { DarkContext } from '../src/context/socketContext';
import ProtectedRoute from './protectedroute/protectedRoute';

function App() {
  const {dark, dispatch} = useContext(DarkContext)

 const toggeleMode = () => {
    if(dark){
      dispatch({type:"setDark", payload:false})
    }else{
      dispatch({type:"setDark", payload:true})
    }

 }
  
  return (
    <div className="App">
    <div className={dark ? 'dark' : 'light'}>
    <label>
      <span id={dark ? 'check' : 'check2'} onClick={toggeleMode}>
        {
          dark ? (<img alt='' id='sun' src={SUN}></img>) : (<img alt='' id='moon' src={MOON1}></img>)
        }
      </span>
    </label>
      <div id="dot"></div>
      <div id="dot1"></div>
      <div id="dot2"></div>
      <div id="pageWrapper">
      <Routes>
        <Route path='/' element={<NavBar></NavBar>}>
          <Route index element={<HomePage></HomePage>}></Route>
          <Route element={<ProtectedRoute></ProtectedRoute>}>
            <Route path='/startDocs' element={<DocsStart></DocsStart>}></Route>
            <Route path='/docs/*' element={<Docs></Docs>}></Route>
            <Route path="/group" element={<GroupChatPage></GroupChatPage>}></Route>
            <Route path='/channel/*' element={<Channel></Channel>}></Route>
            <Route path='/dms/*' element={<Dms></Dms>}></Route>
            <Route path='/friends/*' element={<FriendsPage></FriendsPage>}></Route>
            <Route path='/profile' element={<ProfilePage></ProfilePage>}></Route>
            <Route path="/search" element={<SearchPage></SearchPage>}></Route>
          </Route>
          <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        </Route>
      </Routes>
      </div>
    </div>

    </div>
  );
}

export default App;
