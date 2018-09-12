import React from 'react';
import { connect } from 'react-redux';
import get from 'lodash.get';
import {
  Datagrid,
  List,
  Responsive,
  TextField,
  ShowButton,
  EditButton,
  Filter,
  TextInput,
  BooleanInput,
  downloadCSV,
} from 'react-admin';
import { unparse as convertToCSV } from 'papaparse/papaparse.min'; // eslint-disable-line
import { LocationField } from '../fields';

const exporter = (kitchens) => {
  const csv = convertToCSV({
    data: kitchens,
    fields: ['name', 'address', 'city', 'zip_code'],
  });
  downloadCSV(csv, 'kitchens');
};

const KitchenFilter = props => (
  <Filter {...props}>
    <TextInput label="pos.search" source="q" alwaysOn />
    <BooleanInput source="has_been_deleted" label="pos.has_been_deleted" />
  </Filter>
);

const KitchenList = ({ disableEdit, ...props }) => (
  <List
    {...props}
    exporter={exporter}
    filters={<KitchenFilter />}
    sort={{ field: 'created_at', order: 'DESC' }}
  >
    <Responsive
      medium={(
        <Datagrid>
          <TextField source="name" />
          <TextField source="address" />
          <TextField source="city" />
          <TextField source="zip_code" />
          <LocationField />
          <ShowButton />
          {!disableEdit && <EditButton />}
        </Datagrid>
      )}
    />
  </List>
);

const mapStateToProps = state => ({
  disableEdit: get(state, 'form.filterForm.values.has_been_deleted'),
});

export default connect(mapStateToProps)(KitchenList);
