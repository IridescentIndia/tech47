/* eslint-disable no-undef, react/prop-types */
import React from 'react';
import styled, { css } from 'react-emotion';
import Img from 'gatsby-image';
import Helmet from 'react-helmet';
import colors from '../utils/colors';
import media from '../utils/media';

const H1 = styled.h1`
  color: #fff;
  line-height: 1em;
  letter-spacing: 0.1em;
  font-size: 2em;
  ${media.mid`
    color: #fff;
    line-height: 1.3em;
    letter-spacing: 0.1em;
    font-size: 3em;
  `};
`;

// Refer this post for the structure of gatsby-image https://github.com/gatsbyjs/gatsby/issues/2470
// based on this the css maps the div/img
const bgImageDiv = css`
  position: absolute;
  width: 100%;
  & div {
    height: 100vh;
    & div {
      & img {
        object-fit: cover !important;
        object-position: 50% 80% !important;
      }
    }
  }
`;

export default ({ data }) => {
  const { imageOne } = data;
  const myData = data.allContentJson.edges[0].node.index;
  const tagimage = `${myData.url}${data.tagImage.resize.src}`;
  return (
    <div css={`background-color: ${colors.accent};`}>
      <Helmet>
        <title> {`${myData.title} - ${myData.subtitle}`} </title>
        <meta name="description" content={` ${myData.description} `} />
        <meta name="Keywords" content={` ${myData.keywords} `} />
        <meta
          property="og:title"
          content={`${myData.title} - ${myData.subtitle}`}
        />
        <meta property="og:description" content={` ${myData.description} `} />
        <meta property="og:url" content={`${myData.url}`} />
        <meta property="og:image" content={tagimage} />
        <meta property="og:site_name" content={`${myData.title}`} />
        <meta property="og:type" content="article" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={`${myData.title} - ${myData.subtitle}`}
        />
        <meta name="twitter:url" content={`${myData.url}`} />
        <meta name="twitter:description" content={` ${myData.description} `} />
        <meta name="twitter:image" content={tagimage} />
      </Helmet>
      <div className={bgImageDiv}>
        <Img sizes={imageOne.sizes} alt="Background Image" />
      </div>
      <div css="display: flex; width: 100%; height: 100%; align-items: center; justify-content: center;">
        <H1 css="align-items: center; justify-content: center;">
          {myData.heading}
        </H1>
      </div>
    </div>
  );
};

export const pageQuery = graphql`
  query contentQuery {
    allContentJson {
      edges {
        node {
          index {
            url
            title
            subtitle
            heading
            description
            keywords
          }
        }
      }
    }
    imageOne: imageSharp(id: { regex: "/background/" }) {
      sizes {
        # Choose either the fragment including a small base64ed image, a traced placeholder SVG, or one without.
        ...GatsbyImageSharpSizes
      }
    }
    tagImage: imageSharp(id: { regex: "/ogtech47/" }) {
      resize(width: 1200, height: 630, cropFocus: CENTER) {
        # Choose either the fragment including a small base64ed image, a traced placeholder SVG, or one without.
        src
      }
    }
  }
`;
