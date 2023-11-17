const { 
    GraphQLObjectType, 
    GraphQLSchema, 
    GraphQLString, 
    GraphQLNonNull, 
    GraphQLList,
    GraphQLID 
} = require('graphql');
const User = require('./models/User');

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString } // Consider omitting for security
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) }},
            resolve(parent, args) {
                return User.findById(args.id);
            }
        },
        allUsers: {
            type: new GraphQLList(UserType), // Import GraphQLList
            resolve(parent, args) {
                return User.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                email: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    email: args.email,
                    password: args.password // Remember to hash in a real-world app
                });
                return user.save();
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                password: { type: GraphQLString }
            },
            resolve(parent, args) {
                return User.findByIdAndUpdate(args.id, args, { new: true });
            }
        },
        deleteUser: {
            type: UserType,
            args: { id: { type: new GraphQLNonNull(GraphQLID) } },
            resolve(parent, args) {
                return User.findByIdAndDelete(args.id);
            }
        },
    }
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
