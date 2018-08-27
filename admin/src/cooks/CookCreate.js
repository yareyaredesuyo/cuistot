import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  ReferenceInput,
  SelectInput,
  required,
  email,
  DateInput,
} from 'react-admin';
import { parse } from 'query-string';
import { GourmetNameField } from '../fields';

const CookCreate = (props) => {
  const { gourmet_id: gourmetId } = parse(props.location.search);

  return (
    <Create {...props}>
      <SimpleForm>
        <BooleanInput source="is_pro" />
        <ReferenceInput source="gourmet.id" reference="gourmets" validate={required()} defaultValue={gourmetId}>
          <SelectInput optionText={<GourmetNameField />} />
        </ReferenceInput>
        <TextInput source="business_name" />
        <TextInput source="siren" />
        <TextInput source="pro_email" validate={email()} />
        <TextInput source="legal_first_name" />
        <TextInput source="legal_last_name" />
        <DateInput source="legal_birthdate" />
      </SimpleForm>
    </Create>
  );
};

export default CookCreate;
