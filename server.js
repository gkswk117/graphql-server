import { ApolloServer, gql } from "apollo-server"

const fakeDatabase = [
    {
        id:"1",
        text:"first Tweet"
    },
    {
        id:"2",
        text:"second Tweet"
    }
]

const typeDefs = gql`
    type User{
        id: ID!
        username: String!
        firstName: String!
        lastName: String
    }
    type Tweet{
        id: ID!
        text: String!
        author: User
    }
    type Query {
        allTweets: [Tweet!]!
        tweet(id: ID!): Tweet
        ping: String!
    }    
    type Mutation{
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
`
//sdl(schema definition language)
//다른건 몰라도 graphql에서 Query type은 꼭 정해줘야 한다. 필수적이다.
//rest api로 치면 .../text이란 Get request url을 사용자가 사용할 수 있도록 열어준 것.
//따라서, 사용자가 request 할 수 있도록 하고 싶은 모든 건 type Query 안에 있어야 한다.

//Mutation type은 Post request url을 열어주는 것이다.
//

// const resolvers = {
//     Query:{
//         tweet(){
//             console.log("I'm called.")
//             return null
//         },
//         ping(){
//             console.log("ping is called.")
//             return "pong"
//         }
//     }
// }

const resolvers = {
    Query:{
        allTweets(){
            return fakeDatabase
        },
        tweet(root, argument){
            const id = argument.id
            console.log(argument, id)
            return fakeDatabase.find((tweet)=>tweet.id === id)
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers})
//resolvers 자리에 다른 이름을 넣으면 오류가 난다. 왜 그럴까?

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})