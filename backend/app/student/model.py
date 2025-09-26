from app.database import get_db
import psycopg2.extras


class Students() : 
    def __init__(self, id=None, first_name=None, last_name=None, gender=None, year_level=None, program_code=None):
        self.id =id
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.year_level = year_level
        self.program_code = program_code


    def add(self) :
        db = get_db()
        cursor = db.cursor()

        sql = "INSERT INTO students(id, first_name, last_name, gender, year_level, program_code) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (self.id, self.first_name, self.last_name, self.gender, self.year_level, self.program_code))
        db.commit()
        cursor.close()

    @classmethod
    def all(cls) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM students"
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()

        return result
    
    @classmethod
    def update(cls, target_id, id, first_name, last_name, gender, year_level, program_code) :
        try:
            db = get_db()
            cursor = db.cursor()

            sql = "UPDATE students SET id =%s, first_name = %s, last_name = %s, gender = %s, year_level = %s, program_code = %s WHERE id = %s"
            cursor.execute(sql, (id, first_name, last_name, gender, year_level, program_code, target_id))
            db.commit()
            cursor.close()

            return True
        except Exception as e:
            print(f"error updating student: {e}")
            return False

    @classmethod
    def delete(cls, target_id) :
        try:
            db = get_db()
            cursor= db.cursor()
            sql = "DELETE FROM students WHERE id = %s"
            cursor.execute(sql, (target_id,))
            db.commit()
            cursor.close()

            return True
        except Exception as e:
            print(f"error deleting student: {e}")

    @classmethod 
    def get_by_id(cls, id) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM students WHERE id = %s"
        cursor.execute(sql, (id,))
        result = cursor.fetchone()
        cursor.close()
        # print(result)
        if result :
            return cls(
                        id=result["id"],
                        first_name=result['first_name'],
                        last_name=result['last_name'],
                        gender=result['gender'],
                        year_level=result['year_level'],
                        program_code=result['program_code']

                      )        
        return None
    
    @classmethod
    def check_id_exists(cls, code) :
        student = Students.get_by_id(code)
        return True if student else False