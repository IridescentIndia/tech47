/* eslint-disable no-undef, react/prop-types */
import React from 'react';
import { css } from 'react-emotion';
import Img from 'gatsby-image';
import { Box } from '../components/Layout';
import colors from '../utils/colors';

const blogTheme = css`
  max-width: 900px;
  margin: 4.5rem auto 4.5rem auto;
  p {
    color: ${colors.sixth};
  }
  a {
    color: ${colors.primary};
  }
`;

const MenuPages = props => {
  const { data } = props;
  const { markdownRemark: remark } = data;
  return (
    <div className={blogTheme}>
      <Box css="margin: auto 16px auto 16px;">
        <h1>{remark.frontmatter.title}</h1>
        <Img sizes={data.imageSharp.sizes} />
        <div css="padding-bottom: 16px;" />
        <div
          css="text-align: left; a { color : #02a9f7;}"
          dangerouslySetInnerHTML={{ __html: remark.html }}
        />
      </Box>
    </div>
  );
};

export const menuPagesQuery = graphql`
  query menuPagesQuery($id: String!, $imageregex: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        imgdesc
      }
    }
    imageSharp(id: { regex: $imageregex }) {
      sizes {
        # Choose either the fragment including a small base64ed image, a traced placeholder SVG, or one without.
        ...GatsbyImageSharpSizes
      }
    }
  }
`;

export default MenuPages;
