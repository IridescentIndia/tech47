const parseFilepath = require('parse-filepath');
const path = require('path');
const slash = require('slash');
const createPaginatedPages = require('gatsby-paginate');

exports.modifyWebpackConfig = ({ config, stage }) => {
  switch (stage) {
    case 'develop':
      config.preLoader('eslint-loader', {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
      });

      break;
  }
  return config;
};

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators;
  //We check for fileAbsolutePath to skip contentful nodes only nodes on filesystem.
  if (node.internal.type === 'MarkdownRemark' && node.fileAbsolutePath != null) {
    const fileNode = getNode(node.parent);
    try {
      const parsedFilePath = parseFilepath(fileNode.relativePath);
      if (parsedFilePath !== 'undefined') {
        const slug = `/${parsedFilePath.dir}`;
        createNodeField({ node, name: 'slug', value: slug });
      }
    } catch(error) {
      console.log("caught an Error!!!", error);
    }
    //Below check is needed for contentful. else it errors.
  }
};

const createTagPages = (createPage, edges) => {
  const tagTemplate = path.resolve(`src/templates/tags.js`);
  const posts = {};

  edges
    .forEach(({ node }) => {
      if (node.frontmatter.tags) {
        node.frontmatter.tags
          .forEach(tag => {
            if (!posts[tag]) {
              posts[tag] = [];
            }
            posts[tag].push(node);
          });
      }
    });

  createPage({
    path: '/tags',
    component: tagTemplate,
    context: {
      posts
    }
  });

  Object.keys(posts)
    .forEach(tagName => {
      const post = posts[tagName];
      createPage({
        path: `/tags/${tagName}`,
        component: tagTemplate,
        context: {
          posts,
          post,
          tag: tagName
        }
      })
    });
}

const createMenuPages = (createPage, graphql) => {
  return new Promise((resolve, reject) => {

    const menuPageTemplate = path.resolve(
      'src/templates/menu-pages.js'
    );
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, filter: {fields: {slug: {eq: "/" }}}) {
              edges {
                 node {
                   fileAbsolutePath
                   id
                   frontmatter {
                    imagepath
                   }
                   fields {
                     slug
                   }
                 }
               }
            }
          }
        `
      ).then(result => {
        if (result.errors) {
          reject(result.errors);
        }
        const posts = result.data.allMarkdownRemark ? result.data.allMarkdownRemark.edges : [];
        posts.forEach((post, index) => {
          //extract the filename and remove the extension.
          let filename = post.node.fileAbsolutePath.replace(/^.*(\\|\/|\:)/, '').slice(0, -3);
          let imageregex = '';
          if (post.node.frontmatter.imagepath) {
             imageregex = post.node.frontmatter.imagepath.replace(/^.*(\\|\/|\:)/, '');
          }
          createPage({
            path: `${post.node.fields.slug}${filename}`,
            component: slash(menuPageTemplate),
            context: {
              id: post.node.id,
              imageregex: `/${imageregex}/`
            }
          });
        });
      })
   );
  });
}

const createBlogPages = (createPage, graphql) => {
  return new Promise((resolve, reject) => {

    const blogPostTemplate = path.resolve(
      'src/templates/blog-post-template.js'
    );
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, filter: {fields: {slug: {regex: "/blog/" }}}) {
              edges {
                node {
                  id
                  excerpt(pruneLength: 200)
                  timeToRead
                  frontmatter {
                    title
                    tags
                    date(formatString: "MMMM DD, YYYY")
                    imgdesc
                    image {
                     childImageSharp {
                        resize(width: 300, height: 200, cropFocus: ENTROPY) {
                          src
                        }
                      }
                    }
                  }
                  fields {
                    slug
                  }
                }
              }
	           }
          }
        `
      ).then(result => {
        if (result.error) {
          reject(result.error);
        }
        console.log("The result is ", result);
        const posts = result.data.allMarkdownRemark.edges;
        createTagPages(createPage, posts);

        posts.forEach((post, index) => {

          createPaginatedPages({
            edges: posts,
            createPage: createPage,
            pageTemplate: "src/templates/blog.js",
            pageLength: 10,
            pathPrefix: "blog"
          });

          const prev = index === 0 ? false : posts[index - 1].node;
          const next = index === posts.length - 1 ? false : posts[index + 1].node;
          createPage({
            path: `${post.node.fields.slug}`,
            component: slash(blogPostTemplate),
            context: {
              slug: post.node.fields.slug,
              prev: prev,
              next: next
            }
          });
        });
      })
   );
  });
}
// image dimensions 268 * 0.75 = 201
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  createBlogPages(createPage, graphql);
  createMenuPages(createPage, graphql);
};


// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = ({ page, boundActionCreators }) => {
  const { createPage } = boundActionCreators;

  return new Promise((resolve, reject) => {
    if (page.path.match(/^\//)) {
      // It's assumed that `landingPage.js` exists in the `/layouts/` directory
      page.layout = "landingPage";

      // Update the page.
      createPage(page);
    }

    resolve();
  });
};
