from app.database import get_db
import psycopg2.extras


class Students() : 
    def __init__(self, id=None, first_name=None, last_name=None, gender=None, year_level=None, program_code=None, student_pfp_path=None):
        self.id =id
        self.first_name = first_name
        self.last_name = last_name
        self.gender = gender
        self.year_level = year_level
        self.program_code = program_code
        self.student_pfp_path = student_pfp_path

    def add(self) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql ="""INSERT INTO 
        students(id, first_name, last_name, gender, year_level, program_code)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING uuid
        """
        cursor.execute(sql, (self.id, self.first_name, self.last_name, self.gender, self.year_level, self.program_code))
        uuid_res = cursor.fetchone()
        db.commit()
        cursor.close()

        return uuid_res
    
    @classmethod
    def patch_student_pfp(cls, student_pfp_path, student_uuid) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql ="""
        UPDATE students 
        SET student_pfp_path = %s
        WHERE uuid = %s
        """
        cursor.execute(sql, (student_pfp_path, student_uuid))
        db.commit()
        cursor.close()


    @classmethod
    def all(cls, limit, offset, search, sortBy, direction) :
        try : 
            db = get_db()
            cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)


            params = []
            search = "%" + search + "%"
            sql = "SELECT * FROM students "
            where = """
                    WHERE id ILIKE %s 
                    OR first_name ILIKE %s 
                    OR last_name ILIKE %s 
                    OR gender ILIKE %s 
                    OR CAST(year_level AS TEXT) ILIKE %s 
                    OR program_code ILIKE %s 
                    """
            sql += where
            params.extend([search] * 6)
            orderby = f"ORDER BY {sortBy} {direction} "
            if sortBy != 'none' :
                sql += orderby

            limitoffset = "LIMIT %s OFFSET %s"
            sql+= limitoffset
            params.extend([limit, offset])

            cursor.execute(sql, params)
            result = cursor.fetchall()
            cursor.close()

            return result
        except Exception as e:
            print(f"error getting students: {e}")

    @classmethod
    def get_all_count(cls) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "SELECT COUNT(*) FROM students"
        cursor.execute(sql)
        result = cursor.fetchone()

        return result['count']

    @classmethod
    def get_count(cls, search) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        params = []
        search = "%" + search + "%"
        sql = "SELECT COUNT(*) FROM students "
        where = """
                WHERE id ILIKE %s 
                OR first_name ILIKE %s 
                OR last_name ILIKE %s 
                OR gender ILIKE %s 
                OR CAST(year_level AS TEXT) ILIKE %s 
                OR program_code ILIKE %s 
                """
        sql += where
        params.extend([search] * 6) 
        
        cursor.execute(sql, params)
        result = cursor.fetchone()
        cursor.close()

        return result['count']
    
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
