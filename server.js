import { ApolloServer, gql } from "apollo-server"

const typeDefs = gql`
    type User{
        id: ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    type Tweet{
        id: ID!
        text: String!
        author: User
    }
    type Query {
        allTweets: [Tweet!]!
        allUsers:[User!]!
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

const resolvers1 = {
    Query:{
        tweet(){
            console.log("I'm called.")
            return null
        },
        ping(){
            console.log("ping is called.")
            return "pong"
        }
    }
}
let tweetDatabase = [
    {
        id:"1",
        text:"first Tweet"
    },
    {
        id:"2",
        text:"second Tweet"
    }
]
let userDatabase = [
    {
        id:"1",
        firstName:"nico",
        lastName:"las",
    },
    {
        id:"2",
        firstName:"hw",
        lastName:"b",
    },
]
let count = 0
const resolvers = {
    Query:{
        allTweets(){
            return tweetDatabase
        },
        allUsers(){
            console.log("allUsers' resolver is called")
            return userDatabase
            //이 userDatabase에 query에서는 id, firstName, lastName, fullName을 요청했지만
            //fullName의 값이 null이면 resolver가 있는지 찾으러 간다.
        },
        tweet(root, argument){
            const id = argument.id
            console.log(argument, id)
            return tweetDatabase.find((tweet)=>tweet.id === id)
            //자바스크립트 배열 find 함수
        },
    },
    User:{
        fullName(root,argument){
            console.log("fullName's resolver is called")
            console.log(root)
            //fullName resolver를 호출한 User query가 root로 전달된다.
            return `${root.firstName} ${root.lastName}`
        }
    },
    Mutation:{
        postTweet(_,argument){
            const id = argument.id
            const text = argument.text
            const newTweet = {
                id: tweetDatabase.length+1,
                text:text
            }
            count = count+1
            tweetDatabase.push(newTweet)
            return tweetDatabase[count]
        },
        deleteTweet(_,argument){
            const id = argument.id
            const tweet = tweetDatabase.find(tweet => tweet.id === id)
            if(!tweet) return false
            tweetDatabase= tweetDatabase.filter(tweet => tweet.id!==id)
            //자바스크립트 배열 filter 함수
            return true
        },
    },
}
//이렇게 Query와 Mutation으로 나누는 이유는 그냥 코딩하기 편하려고.
//구분을 지어줌으로써 개발자가 database를 mutate하는 기능은 Mutation에 넣고, database에서 fetching하는 기능은 Query에서 찾고.
//따라서 Mutation에 있는 postTweet, deleteTweet을 Query에 넣어도 아무 문제 없음. 진짜 그냥 개발하는데 편하려고 구분을 해두는 것.

const server = new ApolloServer({typeDefs, resolvers})
//resolvers 자리에 다른 이름을 넣으면 오류가 난다. 왜 그럴까?

server.listen().then(({url})=>{
    console.log(`Running on ${url}`)
})