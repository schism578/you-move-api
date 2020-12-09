<img src='./images/favicon.jpg' alt='app icon' width='150'/>

# YouMove API  

### Use: Provides JWT auth for registering users, secure login, and protected endpoints. Provides database for user profile information and daily calorie logging history.  

## API Documentation:  
### User Endpoints
#### `POST /user`  
&nbsp;&nbsp;&nbsp;Creates user profile storing all profile info in Express database.
#### Sample Query:  
&nbsp;&nbsp;&nbsp;`newUser: {
    user_id: UUID,
    first_name: text required,
    last_name: text required,
    email: text required,
    password: text required,
    gender: text required,
    height: integer required,
    weight: integer required,
    age: integer required,
    bmr: integer required,
}`