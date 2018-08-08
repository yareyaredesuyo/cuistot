import { FormControl } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { Theme, withStyles } from "@material-ui/core/styles";
import { Auth } from "aws-amplify";
import { AppContainer } from "components/App";
import { Field, Form, Formik } from "formik";
// @ts-ignore
import { TextField } from "formik-material-ui";
import React from "react";
import { Subscribe } from "unstated";
import * as Yup from "yup";

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

interface ILoginFormProps {
  classes?: any;
}

interface ILoginFormValues {
  username: string;
  password: string;
}

export class LoginForm extends React.Component<ILoginFormProps, {}> {
  public constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  public render() {
    const { classes } = this.props;

    const validationSchema = Yup.object().shape({
      username: Yup.string().required(
        "Vous devez indiquer votre nom d'utilisateur"
      ),
      password: Yup.string().required("Vous devez indiquer votre mot de passe")
    });

    const initialValues = {
      password: "",
      username: ""
    };

    const loginFormComponent = () => (
      <Form autoComplete="off">
        <FormControl>
          <Grid container={true} className={classes.grid} spacing={16}>
            <Grid item={true} xs={12}>
              <Grid container={true} justify="center">
                <Button variant="outlined" color="secondary">
                  Se connecter avec Facebook
                </Button>
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Divider />
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true}>
                <Field
                  type="text"
                  component={TextField}
                  id="username"
                  label="Nom d'utilisateur"
                  name="username"
                  placeholder="Votre nom d'utilisateur"
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
                  name="password"
                  placeholder="Votre mot de passe"
                  className={classes.textField}
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Grid item={true} xs={12}>
              <Grid container={true} justify="center">
                <Button type="submit" variant="contained" color="secondary">
                  Se connecter
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </FormControl>
      </Form>
    );

    return (
      <Subscribe to={[AppContainer]}>
        {(app: any) => (
          <Formik
            initialValues={initialValues}
            component={loginFormComponent}
            onSubmit={this.onSubmit(app.openSnackbar, app.logIn)}
            validationSchema={validationSchema}
          />
        )}
      </Subscribe>
    );
  }

  public onSubmit(openSnackbar, logIn) {
    return (
      values: ILoginFormValues,
      { setSubmitting, setErrors, setStatus }
    ) => {
      Auth.signIn(values.username, values.password)
        .then(user => {
          console.log(user);
          setStatus({ success: true });
          logIn();
        })
        .catch(err => {
          let errorMessage;
          let snackbarVariant = "error";
          if (
            err.code === "UserNotFoundException" ||
            err.code === "NotAuthorizedException"
          ) {
            errorMessage =
              "Le nom d'utilisateur et/ou le mot de passe sont incorrects";
          } else if (err.code === "UserNotConfirmedException") {
            errorMessage =
              "Vous devez confirmer votre compte avant de pouvoir vous connecter";
            snackbarVariant = "warning";
          }
          if (errorMessage) {
            openSnackbar(errorMessage, snackbarVariant);
          }
          setStatus({ success: false });
          setSubmitting(false);
          setErrors({ submit: err.message });
        });
    };
  }
}

export default withStyles(styles as any)(LoginForm as any) as any;
