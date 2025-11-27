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
    def all(cls, limit, offset, search, sortBy, direction) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        params = []
        search = "%" + search + "%"
        sql = "SELECT * FROM programs "
        where = "WHERE code ILIKE %s OR name ILIKE %s OR college_code ILIKE %s "
        sql += where
        params.extend([search, search, search])
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
    
    @classmethod 
    def view_program(cls, program_code) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql  = """
                SELECT 
                    p.code,
                    p.name,
                    p.college_code, 
                    CASE
                        WHEN p.college_code IS NULL THEN NULL
                        ELSE                         
                            JSON_BUILD_OBJECT (
                                'code', c.code,
                                'name', c.name
                            ) 
                    END AS college,
                    (
                        SELECT COUNT(*) FROM students s
                        WHERE s.program_code = %s
                    ) AS student_count
                FROM programs p
                LEFT JOIN colleges c
                    ON c.code = p.college_code
                WHERE p.code = %s
                """

        cursor.execute(sql, (program_code, program_code,))
        result = cursor.fetchone()
        cursor.close()

        return result        

    @classmethod 
    def all_codes(cls) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT code FROM programs"
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()

        return result

    @classmethod
    def get_count(cls, search) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        params = []
        search = "%" + search + "%"
        sql = "SELECT COUNT(*) FROM programs "
        where = "WHERE code ILIKE %s OR name ILIKE %s OR college_code ILIKE %s "
        sql += where
        params.extend([search, search, search])

        cursor.execute(sql, params)
        result = cursor.fetchone()
        cursor.close()

        return result['count']

    @classmethod
    def get_all_count(cls) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        sql = "SELECT COUNT(*) FROM programs "
        cursor.execute(sql)
        result = cursor.fetchone()

        return result['count']

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