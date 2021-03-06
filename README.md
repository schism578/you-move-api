<img src='./images/favicon.jpg' alt='app icon' width='150'/>

# YouMove API  

### Use: Provides JWT auth for registering users, secure login, and protected endpoints. Provides database for user profile information and daily calorie logging history.  

## API Documentation:  
### Create User Endpoint
#### `POST /user`  
&nbsp;&nbsp;&nbsp;Creates user profile storing all profile info in Express database with hash encrypted password.
#### Sample Request:  
&nbsp;&nbsp;&nbsp;newUser: {  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first_name: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;last_name: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;email: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;password: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gender: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height: integer required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;weight: integer required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;age: integer required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bmr: integer required  
}  

#### Sample Response:  
&nbsp;&nbsp;&nbsp;newUser: {  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user_id: generated integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;first_name: text,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;last_name: text,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;email: text,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;password: text,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;gender: text,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;weight: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;age: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;bmr: integer  
}  
  
### Login Endpoint  
#### `POST /auth/login`  
&nbsp;&nbsp;&nbsp;Provides bcrypted secure login with JWT auth token protection.  
#### Sample Request:  
&nbsp;&nbsp;&nbsp;{  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;username: text required,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;password: text required  
&nbsp;&nbsp;&nbsp;}
#### Sample Response:  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;authToken: string  
&nbsp;&nbsp;&nbsp;Object: {  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;date: `date` format,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;calories: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user_id: integer  
&nbsp;&nbsp;&nbsp;}  
  
### Calorie Log Endpoints  
#### `GET /log/:user_id`  
&nbsp;&nbsp;&nbsp;Retrieves a collection of response objects of the user's calorie logs since their profile was created. Requires authentication.  
#### Sample Request:  
&nbsp;&nbsp;&nbsp;{  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user_id: integer required,  
&nbsp;&nbsp;&nbsp;}  
#### Sample Response:  
&nbsp;&nbsp;&nbsp;Object(s): {  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;date: `date` format,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;calories: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user_id: integer  
&nbsp;&nbsp;&nbsp;}  
#### `POST /log/:user_id`  
&nbsp;&nbsp;&nbsp;Saves daily calorie logs to the logged in user's profile. Requires authentication.  
#### Sample Request:  
&nbsp;&nbsp;&nbsp;{  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;calories: string required,  
&nbsp;&nbsp;&nbsp;}  
#### Sample Response:  
&nbsp;&nbsp;&nbsp;Object(s): {  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;date: `date` format,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;calories: integer,  
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;user_id: integer  
&nbsp;&nbsp;&nbsp;}  
  
### Technologies:  
&nbsp;&nbsp;&nbsp;**Express**  
&nbsp;&nbsp;&nbsp;**Node**  
&nbsp;&nbsp;&nbsp;**Knex**  
&nbsp;&nbsp;&nbsp;**Postgrator**  
&nbsp;&nbsp;&nbsp;**Mocha, Chai, Supertest**  
&nbsp;&nbsp;&nbsp;**JSON Web Token, bcryptjs**  