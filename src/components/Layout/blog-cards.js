/* eslint-disable */
import React from 'react';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';
import Img from 'gatsby-image';
import styled, { css } from 'react-emotion';
const _ = require(`lodash`);
import { Box, Flex, Tags } from './';
import colors from '../../utils/colors';


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

const BlCard = styled.div`
  position: relative;
  width: 300px;
  height: 440px;
  margin: 16px;
  padding 16px;
  overflow: hidden;
  text-align: left;
  border-style: solid;
  border-width: thin;
  border-color: ${colors.light}

  img,
  h4 {
    margin: auto;
  }

  .${excerptStyle} {
    position: relative;
    height: ${props => props.image ? '4.5em' : 'auto' }; // Sets the div to
    overflow: hidden;
  }

  .${tagStyle} {
    position: absolute;
    height: auto;
  }
`;

const StyledSpan = styled.span`
  color: ${colors.light};
  font-size: 0.65em;
`;

const PostImage = ({post, frontmatterimage, netlifyImage, images }) => {
  if (netlifyImage) {
    return (
      <Img resolutions={images[netlifyImage].node.resolutions}/>
    )
  }
  if (frontmatterimage) {
    return (
        <img
          alt={post.frontmatter.imgdesc}
          src={frontmatterimage}
        />
    )
  }
  return null;
}


const BlogCard = (props) => {
  const { post, images } = props;
  const frontmatterimage = post.frontmatter.image
    ? post.frontmatter.image.childImageSharp.resize.src
    : null;

  let netlifyImage;
  if (post.frontmatter.imagepath) {
    netlifyImage =  _.findIndex(images, function(o) {return _.includes(o.node.id, post.frontmatter.imagepath)});
  }

  return (
    <div>
      <li key={post.id}>
      <BlCard image={post.frontmatter.image ? true : netlifyImage}>
        <Link to={post.fields.slug}>
          <PostImage frontmatterimage={frontmatterimage} post={post} netlifyImage={netlifyImage} images={images}/>
          <h4>
            {post.frontmatter.title}
          </h4>
          <StyledSpan>{post.timeToRead} min read &middot;</StyledSpan>
          <div className={excerptStyle}>
            <span>{post.excerpt}</span>
          </div>
        </Link>
        <div className={tagStyle}>
          <Tags list={post.frontmatter.tags || []} />
        </div>
      </BlCard>
      </li>
    </div>
  );
};

export const blogCardFragment = graphql`
  fragment blogCard on RootQueryType {
    allImageSharp {
      edges {
        node {
          id
          resolutions(width: 268, height: 201, cropFocus: CENTER) {
            ...GatsbyImageSharpResolutions
          }
        }
      }
    }
  }
`;

export default BlogCard;
