import * as React from "react";
import { List, Datagrid, TextField, EmailField, UrlField } from 'react-admin';

function UserList(props) {
  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <EmailField source="email" />
        <TextField source="phone" />
        <UrlField source="website" />
        <TextField source="company.name" />
      </Datagrid>
    </List>
  );
}

export default UserList;
