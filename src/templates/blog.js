/* eslint-disable */
import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import { Box, Flex, Tags, BlogCard } from '../components/Layout';
import Img from 'gatsby-image';
import colors from '../utils/colors';
import styled, { css } from 'react-emotion';

const listStyle = css`
  list-style-type: none;
  margin: 0;
  margin-top: 1.5em;
  padding: 0;
`;

const blogTheme = css`
  h1, h2, h3, h4, h5, h6 {
    color: ${colors.secondary}
  };
  p {
    color: ${colors.sixth}
  };
`;

const tagStyle = css`
  margin: 8px;
  bottom: 0;
`;

const excerptStyle = css`
  & :after {
    content: "";
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 70%;
    height: 1.5em;
    background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%);
  }
`;

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>;
  } else {
    return null;
  }
};
const StyledSpan = styled.span`
  color: ${colors.light};
  font-size: 0.65em;
`;

const BlogIndex = (props) => {
// The below objects are coming from gatsby-paginate
  console.log("The props in blog.js are ", props);
  const { data, pathContext } = props
  const { group, index, first, last, pathPrefix } = pathContext;
  const { edges : images } = data.allImageSharp
  const previousUrl = index - 1 == 1 ? pathPrefix : pathPrefix + "/" + (index - 1).toString();
  const nextUrl = pathPrefix + "/" + (index + 1).toString();
  const tagurl = first ? `https://www.iridescentindia.com/${pathPrefix}` :
    `https://www.iridescentindia.com/${pathPrefix}/${index.toString}`;
  const tagimage = `https://www.iridescentindia.com/${data.bgImage.resize.src}`;
  return (
    <div>
      <Box className={blogTheme}>
        <Helmet>
          <title> {`Iridescent India - Blogs`} </title>
          <meta
            name="description"
            content="Iridescent India Blogs, covering a varied topics
             on waste management"
          />
        <meta name="Keywords" content={"Waste Management, Recycling, Upcycling"} />
          <meta property="og:title" content="Iridescent India - Blogs" />
          <meta
            property="og:description"
            content="Iridescent India Blogs, covering a varied topics
             on waste management."
          />
          <meta property="og:url" content={tagurl} />
          <meta property="og:image" content={tagimage} />
          <meta
            property="og:site_name"
            content="Waste Management"
          />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Iridescent India - Blogs" />
          <meta name="twitter:url" content={tagurl} />
          <meta
            name="twitter:description"
            content="Iridescent India Blogs, covering a varied topics
             on waste management"
          />
          <meta name="twitter:image" content={tagimage} />
        </Helmet>
        <ul className={listStyle}>
          <Box>
            <h2> Waste Management Articles and Blogs </h2>
            <Flex>
              {group
                .filter(post => post.node.frontmatter.title.length > 0)
                .map(({ node: post }, index) => {
                  return (
                    <BlogCard post={post} images={images}/>
                  );
                })}
              </Flex>
          </Box>
        </ul>
        <div css="display: flex; justify-content: center;">
          <div css="flex-grow: 1; display: flex; font-size: 0.8em; margin: 16px; max-width: 900px;">
            <div css="flex-grow: 1; display: flex; justify-content: left;">
              <NavLink test={first} url={previousUrl} text="Previous Page" />
            </div>
            <div css="display: flex; justify-content: right;">
              <NavLink test={last} url={nextUrl} text="Next Page" />
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export const blogQuery = graphql`
  query BlogQuery {
    bgImage: imageSharp(id: { regex: "/background/" }) {
      resize(width: 1200, height: 630, cropFocus: CENTER) {
        # Choose either the fragment including a small base64ed image, a traced placeholder SVG, or one without.
        src
      }
    }
    ...blogCard
  }
`;
/* eslint-enable */

export default BlogIndex;
