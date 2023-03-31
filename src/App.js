import { Router, Route, Switch } from 'react-router-dom';
import { store, persistedStore } from './store';
import { Provider } from 'react-redux';
import { CCategoriesList, CCategoryTree, CEditableCategory, CEditableGood, CGood, CGoodsList, CLoginForm, CMainAppBar, COrder, COrdersList, CRegisterForm, CUser, CUsersList } from "./Components";
import { CLogout } from './Components';
import { CSidebar } from './Components/Sidebar';
import { CRootCats } from './Components';
import './App.css';
import { CCategory } from './Components/Category';
import { CCart } from './Components/Cart';
import { createBrowserHistory } from "history";
import { PersistGate } from 'redux-persist/integration/react';
import { Box, Typography } from '@mui/material';
import backImage from "./images/theme_main.png"

export const history = createBrowserHistory();


const NotFound = () =>
  <div>
    <h1>404 not found</h1>
  </div>


const Main = () =>
  <Box height="100vh" sx={{ backgroundImage: `url(${backImage})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center", marginTop: "-2.5vh" }}>
    <h1>Main page</h1>
  </Box>

function App() {
  return (
    <>
      <Router history={history}>
        <Provider store={store}>
          <PersistGate loading={<Typography>Loading...</Typography>} persistor={persistedStore}>
            <div className="App">
              <CMainAppBar />
              <CSidebar id="sidBar" menuComponent={() => <CRootCats />} />
              <Switch>
                <Route path="/" component={Main} exact />
                <Route path="/orders" component={COrdersList} />
                <Route path="/users" component={CUsersList} />
                <Route path="/goods" component={CGoodsList} />
                <Route path="/good/:_id" component={CGood} />
                <Route path="/editgood/:_id" component={CEditableGood} />
                <Route path="/editgood" component={CEditableGood} />
                <Route path="/category/:_id" component={CCategory} />
                <Route path="/editcategory/:_id" component={CEditableCategory} />
                <Route path="/editcategory" component={CEditableCategory} />
                <Route path="/order/:_id" component={COrder} />
                <Route path="/cart" component={CCart} />
                <Route path="/login" component={CLoginForm} />
                <Route path="/register" component={CRegisterForm} />
                <Route path="/user/:_id" component={CUser} />
                <Route path="/user" component={CUser} />
                <Route path="/logout" component={CLogout} />
                <Route path="/catree" component={CCategoryTree} />
                <Route path="/categories" component={CCategoriesList} />
                <Route path="*" component={NotFound} />
              </Switch>
            </div>
          </PersistGate>
        </Provider>
      </Router>
    </>

  );
}

export default App;
