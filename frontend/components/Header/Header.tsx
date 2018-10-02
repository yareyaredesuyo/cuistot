import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import { Theme, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Link from "next/link";
import React from "react";
import AccountDropdown from "../../components/AccountDropdown";
import Logo from "../../components/Logo";

const styles = (theme: Theme) => ({
  appBar: {
    background: "linear-gradient(180deg,hsla(0,0%,100%,.9) 0,hsla(0,0%,100%,.8))",
    boxShadow: "none"
  },
  button: {
    margin: theme.spacing.unit
  },
  accountButton: {
    extend: "button",
    color: "white"
  },
  logo: {
    marginRight: 3 * theme.spacing.unit
  }
});

interface IHeaderProps {
  classes: any;
  static?: boolean;
  hideSignUpLogin?: boolean;
  hideCompanyIndividual?: boolean;
  isLoggedIn: boolean;
}

interface IHeaderState {
  up?: boolean;
}

export class Header extends React.Component<IHeaderProps, IHeaderState> {
  constructor(props: IHeaderProps) {
    super(props);

    this.state = {
      up: true
    };
  }

  public render() {
    const {
      classes,
      hideSignUpLogin,
      isLoggedIn,
      hideCompanyIndividual
    } = this.props;

    return (
      <AppBar
        position={this.props.static ? "static" : "sticky"}
        className={classes.appBar}
      >
        <Toolbar>
          <Grid container justify="flex-start" alignItems="center">
            <Logo className={classes.logo} />
            {!hideCompanyIndividual && (
              <Hidden smDown={true}>
                <Link href="/business" passHref={true}>
                  <Button className={classes.button} color="primary">
                    Entreprise
                  </Button>
                </Link>
                <Link href="/individual" passHref={true}>
                  <Button className={classes.button} color="primary">
                    Particulier
                  </Button>
                </Link>
              </Hidden>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles as any)(Header as any) as any;
