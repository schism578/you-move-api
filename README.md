<img src='./images/favicon.jpg' alt='app icon' width='150'/>

# YouMove API  

### Use: Provides JWT auth for registering users, secure login, and protected endpoints. Provides database for user profile information and daily calorie logging history.  

## API Documentation:  
### User Endpoint
#### `POST /user`  
&nbsp;&nbsp;&nbsp;Creates user profile storing all profile info in Express database.
#### Sample Query:  
&nbsp;&nbsp;&nbsp;newUser: {  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user_id: UUID,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first_name: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;last_name: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;email: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;password: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gender: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height: integer required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;weight: integer required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;age: integer required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bmr: integer required  
}