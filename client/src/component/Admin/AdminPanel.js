import React, { useEffect } from 'react';
import AdminNavbar from './AdminNavbar.js';
import CardDB from './CardDB';
import { useHistory } from 'react-router-dom';

function AdminPanel (props) {
  const history = useHistory();
  const setPageName = props.setPageName;

  useEffect(() => {
    setPageName("Admin Dashboard");
    if (props.loaded) {
      if (props.userDetails["role"] !== "admin")
        history.push('/');
    }
    return;
  },[props.loaded, props.userDetails, history, setPageName]);

  return (
    <div>
      <AdminNavbar service={props.service}/>
      <CardDB {...props} service={props.service}/>
    </div>
  );
}

export default AdminPanel;
