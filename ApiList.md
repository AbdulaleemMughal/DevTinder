# DevTinder APIs

## authRouter

- POST /signup
- POST /login
- POST /logout

## ProfileRouter

- GET /profile/veiw
- GET /profile/edit
- GET /profile/password

## ConnectionRequestRouter

- POST /request/send/:status/:userId <!-- // status should be interested or ignored -->
<!-- - POST /request/send/interested/:userId
- POST /request/send/ignored/:userId -->

- POST /request/reveiw/:status/:requestId <!-- // status should be accepted or rejected -->
<!-- - POST /request/reveiw/accepted/:requestId
- POST /request/reveiw/rejected/:requestId -->

## UserRouter

GET /user/connections
GET /user/request/recieved
GET /user/feed - Get all the user that are login in our plateform
