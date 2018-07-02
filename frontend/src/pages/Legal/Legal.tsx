import * as content from "!raw-loader!content/legal.md";
import Grid from "@material-ui/core/Grid";
import { Theme, withStyles } from "@material-ui/core/styles";
// @ts-ignore
import MarkdownElement from "@material-ui/docs/MarkdownElement";
import Footer from "components/Footer";
import Header from "components/Header";
import Hero from "components/Hero";
import React, { Component } from "react";
import { Link } from "react-router-dom";

const styles = (theme: Theme) => ({
  grid: {
    margin: "0px auto",
    maxWidth: 1080,
    padding: 24
  }
});

interface ILegalProps {
  classes?: any;
}

export class Legal extends React.Component<ILegalProps, {}> {
  public render() {
    const { classes } = this.props;

    return (
      <>
        <Header />
        <Hero
          imageURL="https://picsum.photos/100/50/?random"
          videoURL="video/landing-video.mp4"
          valueProposition="Conditions légales"
        />
        <Grid
          container={true}
          justify="space-around"
          alignItems="center"
          spacing={16}
          className={classes.grid}
        >
          <MarkdownElement text={content} />
        </Grid>
        <Footer />
      </>
    );
  }
}

export default withStyles(styles as any)(Legal as any) as any;
