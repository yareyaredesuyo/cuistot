import { After, ensureReady } from "@jaredpalmer/after";
import { MuiThemeProvider } from "@material-ui/core/styles";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "typeface-roboto";
import createApolloClient from "./createApolloClient";
import routes from "./routes";
import theme from "./theme";

const client = createApolloClient({ ssrMode: false });

ensureReady(routes).then(data =>
  hydrate(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <MuiThemeProvider theme={theme}>
          <After data={data} routes={routes} />
        </MuiThemeProvider>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById("root")
  )
);

if (module.hot) {
  module.hot.accept();
}
