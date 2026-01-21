const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLFloat, GraphQLBoolean } = require('graphql');

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        price: { type: GraphQLFloat },
        image_url: { type: GraphQLString },
        category: { type: GraphQLString },
        is_available: { type: GraphQLBoolean }
    })
});

module.exports = ProductType;