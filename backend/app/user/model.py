from app.database import get_db
import psycopg2.extras
from flask import jsonify
from flask_login import UserMixin
import hashlib

class Users(UserMixin) :

    def __init__(self, id=None, username=None, password=None, email=None) :
        self.id = id
        self.username = username
        self.password = password
        self.email = email
    
    def add(self) :
        db = get_db()
        cursor = db.cursor()

        password_hash = hashlib.md5(self.password.encode()).hexdigest()

        sql = "INSERT INTO users(username, user_password, email) VALUES (%s, %s, %s)"
        cursor.execute(sql, (self.username, password_hash, self.email))
        db.commit()
        cursor.close()

    @classmethod 
    def all(cls) :
        pass
    
    @classmethod
    def update(cls) :
        pass

    @classmethod
    def delete(cls) :
        pass

    @classmethod 
    def get_by_id(cls, user_id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM users WHERE id = %s"
        cursor.execute(sql, (user_id,))
        result = cursor.fetchone()

        cursor.close()

        if result :
            return cls(
                        id=result['id'],
                        username=result['username'],
                        email=result['email'],
                        password=result['user_password']
                      )

        return None

    @classmethod 
    def get_by_username(cls, user_name) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM users WHERE username = %s"
        cursor.execute(sql, (user_name,))
        result = cursor.fetchone()
        cursor.close()
        print(result)
        if result :
            return cls(
                        id=result['id'],
                        username=result['username'],
                        email=result['email'],
                        password=result['user_password']
                      )        
        return None
        

    def get_id(self) :
        return str(self.id)    
    
    def check_password(self, password) :
        password_hash = hashlib.md5(password.encode()).hexdigest()
        return self.password == password_hash

    def get_json(self) :
        return {
            'id':self.id,
            'username':self.username,
            'email':self.email
        }
    