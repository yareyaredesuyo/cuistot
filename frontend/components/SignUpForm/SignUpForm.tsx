import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { Theme, withStyles } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import { Field, Form, Formik } from "formik";
import { TextField } from "formik-material-ui";
import React from "react";
import { Subscribe } from "unstated";
import * as Yup from "yup";
import { AppContainer } from "../../components/App";
import { withRedirect } from "../../decorators/RedirectDecorator";
import { PASSWORD_TEXT_HELPER } from '../../shared/constants';
import { passwordConfirmationValidation, passwordValidation, phoneNumberValidation } from "../../shared/validations";

const styles = (theme: Theme) => ({
  grid: {
    margin: "0px auto",
    maxWidth: 540,
    padding: 24
  },
  textField: {
    width: "100%"
  }
});

const initialValues = {
  email: "",
  firstname: "",
  lastname: "",
  phoneNumber: "",
  password: "",
  passwordConfirmation: "",
  username: ""
};

interface ISignUpFormProps {
  classes?: any;
  redirectTo: any;
}

interface ISignUpFormValues {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  passwordConfirmation: string;
}

export class SignUpForm extends React.Component<ISignUpFormProps, {}> {
  public constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  public render() {
    const { classes } = this.props;

    const validationSchema = Yup.object().shape({
      email: Yup.string()
        .email("Veuillez saisir une adresse email valide")
        .required("Une adresse email est obligatoire"),
      firstname: Yup.string().required("Un prénom est obligatoire"),
      lastname: Yup.string().required("Un nom est obligatoire"),
      phoneNumber: phoneNumberValidation(),
      password: passwordValidation(),
      passwordConfirmation: passwordConfirmationValidation("password"),
      username: Yup.string().required("Un nom d'utilisateur est obligatoire")
    });

    const signUpFormComponent = () => (
      <Form autoComplete="off">
        <Grid container={true} className={classes.grid} spacing={16}>
          <Grid item={true} xs={12}>
            <Grid container={true} justify="center">
              <Button variant="outlined" color="secondary">
                S'inscrire avec Facebook
              </Button>
            </Grid>
          </Grid>
          <Grid item={true} xs={12}>
            <Divider />
          </Grid>
          <Grid item={true} xs={12}>
            <Grid container={true} spacing={16}>
              <Grid item={true} xs={6}>
                <Field
                  id="firstname"
                  name="firstname"
                  label="Prénom"
                  className={classes.textField}
                  margin="normal"
                  type="text"
                  component={TextField}
                />
              </Grid>
              <Grid item={true} xs={6}>
                <Field
                  id="lastname"
                  name="lastname"
                  label="Nom"
                  className={classes.textField}
                  margin="normal"
                  type="text"
                  component={TextField}
                />
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true}>
                <Field
                  type="text"
                  component={TextField}
                  id="username"
                  label="Nom d'utilisateur"
                  name="username"
                  className={classes.textField}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true}>
                <Field
                  type="text"
                  component={TextField}
                  id="email"
                  label="Email"
                  name="email"
                  className={classes.textField}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true}>
                <Field
                  type="text"
                  component={TextField}
                  id="phoneNumber"
                  label="Numéro de téléphone"
                  name="phoneNumber"
                  className={classes.textField}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true}>
                <Field
                  type="password"
                  component={TextField}
                  id="password"
                  label="Mot de passe"
                  helperText={PASSWORD_TEXT_HELPER}
                  name="password"
                  className={classes.textField}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true}>
                <Field
                  type="password"
                  component={TextField}
                  id="passwordConfirmation"
                  label="Confirmation du mot de passe"
                  name="passwordConfirmation"
                  className={classes.textField}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item={true} xs={12}>
            <Grid container={true} justify="center">
              <Button type="submit" variant="contained" color="secondary">
                S'inscrire
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Form>
    );

    return (
      <Subscribe to={[AppContainer]}>
        {(app: any) => (
          <Formik
            initialValues={initialValues}
            component={signUpFormComponent}
            onSubmit={this.onSubmit(app.openSnackbar)}
            validationSchema={validationSchema}
            validateOnBlur={false}
            validateOnChange={false}
          />
        )}
      </Subscribe>
    );
  }

  public onSubmit(openSnackbar) {
    return (
      values: ISignUpFormValues,
      { setSubmitting, setErrors, setStatus, resetForm }
    ) => {
      const { email, firstname, lastname, phoneNumber, password, username } = values;

      Auth.signUp({
        attributes: {
          email,
          family_name: lastname,
          name: firstname,
          phone_number: phoneNumber,
        },
        password,
        username
      })
        .then(data => {
          if (data.userSub) {
            setStatus({ success: true });
            resetForm(initialValues);
            openSnackbar(
              "Votre compte a bien été créé. Vous allez recevoir un code de sécurité qui vous permettra de le confirmer.",
              "success"
            );
            this.props.redirectTo(
              `/account/confirmation?username=${values.username}`
            );
          }
        })
        .catch(err => {
          let errorMessage;
          if (err.code === "UsernameExistsException") {
            errorMessage =
              "Ce nom d'utilisateur est déjà associé à un compte existant";
          }
          if (errorMessage) {
            openSnackbar(errorMessage, "warning");
          }
          setStatus({ success: false });
          setSubmitting(false);
          setErrors({ submit: err.message });
        });
    };
  }
}

export default withStyles(styles as any)(withRedirect(
  SignUpForm
) as any) as any;
