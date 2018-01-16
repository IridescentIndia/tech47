import React from 'react';
import styled from 'react-emotion';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Navigation from '../components/Navigation';
import favicon from '../assets/images/tech47-favicon2.png';

/* eslint-enable */
const MainDiv = styled.div`
  width: 100%;
`;

const Landing = ({ children, data }) => {
  console.log('children props are:', children);
  return (
    <MainDiv>
      <Helmet>
        <link rel="shortcut icon" href={favicon} type="image/x-icon" />
        <link rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      <Navigation
        title={data.site.siteMetadata.title}
        logo={data.logoImage.sizes.src}
      />
      {children()}
    </MainDiv>
  );
};

Landing.propTypes = {
  children: PropTypes.func.isRequired,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    logoImage: PropTypes.shape({
      resize: PropTypes.shape({
        src: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }).isRequired
};

export default Landing;

export const query = graphql`
  query LandingPageQuery {
    site {
      siteMetadata {
        title
      }
    }
    logoImage: imageSharp(id: { regex: "/Iris/" }) {
      sizes {
        # Choose either the fragment including a small base64ed image, a traced placeholder SVG, or one without.
        src
      }
    }
  }
`;
