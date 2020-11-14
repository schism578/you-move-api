ALTER TABLE calories 
ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_profile(user_id);