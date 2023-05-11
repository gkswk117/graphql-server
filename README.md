# nomadcoders.co
# GraphQL로 영화 API 만들기
# graphql 첫 번째 강의

여기서 만든 Apoller Server는 이후 graphql 두 번째 강의 [GraphQL로 영화 웹 앱 만들기]에서 만드는 Apollo Client와 결합됨.
폴더명 및 깃헙 repository는 노마드코더-graphql-client.
Client에서 Server에 요청을 보내 코드에서만 존재하는 데이터베이스(tweetDatabase, userDatabase) 또는 외부 API(영화 데이터, "https://yts.mx/api/v2/list_movies.json")의 데이터를 가져오는 작업을 할 것.

여기서 만든 Apoller Server는 http://localhost:4000/ 에서 실행되고(server.js에 가서 변경 가능),
graphql 두 번째 강의 [GraphQL로 영화 웹 앱 만들기]에서 만드는 Apollo Client는 CRA로 만들었기 때문에 자동으로 http://localhost:3000/ 에서 실행됨.
해당 Client에서 client.js의 url에 서버 실행 url주소(http://localhost:4000/)를 넣음으로써 Server와 Client를 연결.

Back-end, Server: 노마드코더-graphql-server
Front-end, Client: 노마드코더-graphql-client