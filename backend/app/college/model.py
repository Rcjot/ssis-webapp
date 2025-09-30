from app.database import get_db
import psycopg2.extras

class Colleges() : 
    def __init__(self, code, name):
        self.code = code
        self.name = name

    def add(self) :
        db = get_db()
        cursor = db.cursor()

        sql = "INSERT INTO colleges (code, name) VALUES (%s, %s)"
        cursor.execute(sql, (self.code, self.name))
        db.commit()
        cursor.close()

    @classmethod
    def all(cls, limit, offset, search, sortBy, direction) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        params = []
        search = "%" + search + "%"
        sql = "SELECT * FROM colleges "
        where = "WHERE code LIKE %s OR name LIKE %s "
        sql += where
        params.extend([search, search])
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
    def all_codes(cls) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT code FROM colleges"
        cursor.execute(sql)
        result = cursor.fetchall()
        cursor.close()

        return result

    @classmethod
    def get_count(cls) :
            db = get_db()
            cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

            sql = "SELECT COUNT(*) FROM colleges"
            cursor.execute(sql)
            result = cursor.fetchone()
            cursor.close()

            return result['count']
    
    @classmethod
    def update(cls, target_code, code, name) :
        try:
            db = get_db()
            cursor = db.cursor()
            sql = "UPDATE colleges SET code=%s, name=%s  WHERE code = %s"
            cursor.execute(sql,(code, name, target_code) )
            db.commit()
            cursor.close()

            return True
        except Exception as e:
            print(f"error updating college: {e}")
            return False
        
    @classmethod
    def delete(cls, target_code) :
        try:
            db = get_db()
            cursor= db.cursor()

            sql = "DELETE FROM colleges WHERE code = %s"
            cursor.execute(sql, (target_code,))
            db.commit()
            cursor.close()

            return True
        except Exception as e:
            print(f"error deleting college: {e}")

    @classmethod 
    def get_by_code(cls, code) :
        db = get_db()
        cursor = db.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        sql = "SELECT * FROM colleges WHERE code = %s"
        cursor.execute(sql, (code,))
        result = cursor.fetchone()
        cursor.close()
        if result :
            return cls(
                        code=result['code'],
                        name=result['name'],
                      )        
        return None
    
    @classmethod
    def check_code_exists(cls, code) :
        college = Colleges.get_by_code(code)
        return True if college else False