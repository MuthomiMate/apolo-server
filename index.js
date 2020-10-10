const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");
const baseURL = "https://api.chucknorris.io/jokes/";

const typeDefs = gql`
  type Category {
    name: String
  }
  type Random {
    created_at: String
    icon_url: String
    id: String
    updated_at: String
    url: String
    value: String
  }
  type Query {
    categories: [Category]
    random(category: String): Random
  }
`;

const resolvers = {
  Query: {
    categories: async () => {
      const allCategories = await axios.get(`${baseURL}categories`);
      return allCategories.data.map((name) => ({ name }));
    },
    random: async (parent, args) => {
      const { category } = args;
      const query = category ? `?category=${category}` : "";
      const joke = await axios.get(`${baseURL}random${query}`);
      return joke.data;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
