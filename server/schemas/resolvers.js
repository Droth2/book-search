const { User } = require('../models')
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({})
                    .select('-__v -password')
                    .populate('savedBooks')

                return userData
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);
            return { user, token };
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new AuthenticationError('invalid cedentials');
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenticationError('invalid credentials');
            }
            const token = signToken(user);
            return { user, token };
        },
        saveBook: async (parent, { body }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: body } },
                    { new: true, runValidators: true }
                );
                if(!updatedUser) {
                 return {message: 'couldnt find user'}   
                }
                return updatedUser
            }
            throw new AuthenticationError('you need to be logged in');
        },
        removeBook: async (parent, { body }, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: body.bookId } } },
                    { new: true }
                );
                if(!updatedUser) {
                    return { message: 'couldnt find user' }
                }
                return updatedUser
            }
            throw new AuthenticationError('you need to be signed in');
        }
    }
};

module.exports = resolvers;