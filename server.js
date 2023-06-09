import { ApolloServer, gql } from "apollo-server"
import fetch from "node-fetch"

const typeDefs = gql`
    type User{
        id: ID!
        firstName: String!
        lastName: String!
        """
        fullName is the sum of firstName + lastName as a string.
        """
        fullName: String!
    }
    type Tweet{
        id: ID!
        text: String!
        author: User
    }
    type Query {
        """
        This is how you write description about allTweets field.
        """
        allTweets: [Tweet!]!
        allUsers:[User!]!
        allMovies:[Movie!]!
        tweet(id: ID!): Tweet
        ping: String!
        movie(id: String!): Movie
    }    
    type Mutation{
        postTweet(text: String!, userId: ID!): Tweet!
        deleteTweet(id: ID!): Boolean!
    }
    type Movie {
        id: Int!
        url: String!
        imdb_code: String!
        title: String!
        title_english: String!
        title_long: String!
        slug: String!
        year: Int!
        rating: Float!
        runtime: Float!
        genres: [String]!
        summary: String
        description_full: String!
        synopsis: String
        yt_trailer_code: String!
        language: String!
        background_image: String!
        background_image_original: String!
        small_cover_image: String!
        medium_cover_image: String!
        large_cover_image: String!
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
        text:"first Tweet",
        userID:"921009"
    },
    {
        id:"2",
        text:"second Tweet",
        userID:"891206"
    }
]
let userDatabase = [
    {
        id:"891206",
        firstName:"nico",
        lastName:"las",
    },
    {
        id:"921009",
        firstName:"hw",
        lastName:"b",
    },
]
let count = 0
const resolvers = {
    Query:{
        allTweets(){
            return tweetDatabase
            //return을 하는 tweetDatabase는 typeDefs에서 allTweets의 shape를 정의한 것과 동일한 shape이어야 한다.
            //
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
        allMovies() {
            return fetch("https://yts.mx/api/v2/list_movies.json")
                .then((r) => r.json())
                .then((json) => json.data.movies);
        },
        movie(_, { id }) {
            console.log("movie is called.")
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`)
                .then((r) => r.json())
                .then((json) => json.data.movie);
        },
        //rest api를 graphql api로 바꾸는 방법
    },
    Mutation:{
        postTweet(_,argument){
                const newTweet = {
                id: tweetDatabase.length+1,
                text:argument.text,
                userId:argument.userID,
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
    User:{
        firstName(root){
            return root.firstName
        },
        fullName(root,argument){
            console.log("fullName's resolver is called")
            console.log(root)
            //fullName resolver를 호출한 User query가 root로 전달된다.
            return `${root.firstName} ${root.lastName}`
        }
    },
    Tweet:{
        author(root){
            console.log(root)
            //authoer resolver를 호출한 Tweet query가 root로 전달된다.
            const userID = root.userID
            return userDatabase.find((user)=>user.id === userID)
        }
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
//listen() 안에 아무것도 주지 않으면 default로 4000포트에 연결함. url == http://localhost:4000/
//내가 원하는 포트를 입력하면 됨.