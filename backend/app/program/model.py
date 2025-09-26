from app.database import get_db
import psycopg2.extras

class Programs() : 
    def __init__(self, code, name, college_code):
        self.code = code
        self.name = name
        self.college_code = college_code

    def add(self) :
        db = get_db()
        cursor = db.cursor()

        sql = "INSERT INTO programs (code, name, college_code) VALUES (%s, %s, %s)"
        cursor.execute(sql, (self.code, self.name, self.college_code))
        db.commit()
        cursor.close()

    @classmethod
    def all(cls) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM programs"
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()

        return result
    
    @classmethod
    def update(cls, target_code, code, name, college_code) :
        try:
            db = get_db()
            cursor = db.cursor()

            sql = "UPDATE programs SET code=%s, name=%s, college_code=%s WHERE code = %s"
            cursor.execute(sql,(code, name, college_code, target_code) )
            db.commit()
            cursor.close()

            return True
        except Exception as e:
            print(f"error updating program: {e}")
            return False
        
    @classmethod
    def delete(cls, target_code) :
        try:
            db = get_db()
            cursor= db.cursor()

            sql = "DELETE FROM programs WHERE code = %s"
            cursor.execute(sql, (target_code,))
            db.commit()
            cursor.close()

            return True
        except Exception as e:
            print(f"error deleting program: {e}")

    @classmethod 
    def get_by_code(cls, code) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM programs WHERE code = %s"
        cursor.execute(sql, (code,))
        result = cursor.fetchone()
        cursor.close()
        # print(result)
        if result :
            return cls(
                        code=result['code'],
                        name=result['name'],
                        college_code = result['college_code']
                      )        
        return None    
    @classmethod
    def check_code_exists(cls, code) :
        college = Programs.get_by_code(code)
        return True if college else False