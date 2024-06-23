import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Signin from './components/Signup';
import AdminPage from './components/AdminPage';
import InvoiceList from './components/InvoiceList';
import Userpage from './components/Userpage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/user" component={Userpage} />
          <Route path="/admin/register" component={AdminPage} />
          <Route path="/notify/invoices" component={InvoiceList} />
          <Route path="/" component={Signin} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
