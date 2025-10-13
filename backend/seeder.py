import random
import argparse
import psycopg2
from config import DATABASE_URL


colleges = [
    ("csm", "College of Math Sciences"),
    ("chs", "College of Health Sciences"),
    ("ccs", "College of Computer Studies"),
    ("ced", "College of Education"),
    ("ceba", "College of Business Administration"),
    ("coe", "College of Engineering"),
    ("cass", "College of Arts and Social Sciences")
]


programs = [
    ("bsca", "BS Computer Applications", "ccs"),
    ("bsit", "BS Information Technology", "ccs"),
    ("bsis", "BS Information Systems", "ccs"),
    ("bsee", "BS Electrical Engineering", "coe"),
    ("bsece", "BS Electronics and Communications Engineering", "coe"),
    ("bschem", "BS Chemistry", "csm"),
    ("bsmath", "BS Mathematics", "csm"),
    ("bsphysics", "BS Physics", "csm"),
    ("bsstat", "BS Statistics", "csm"),
    ("bsce", "BS Civil Engineering", "coe"),
    ("bae", "BA English", "cass"),
    ("bsp", "BS Psychology", "cass"),
    ("bafil", "BA Filipino", "cass"),
    ("bscera", "BS Ceramic Engineering", "coe"),
    ("bschemeng", "BS Chemical Engineering", "coe"),
    ("bscpe", "BS Computer Engineering", "coe"),
    ("bsmeng", "BS Mining Engineering", "coe"),
    ("bsenveng", "BS Environmental Engineering", "coe"),
    ("bsmecheng", "BS Mechanical Engineering", "coe"),
    ("bsmetaeng", "BS Metallurgical Engineering", "coe"),
    ("bsn", "BS Nursing", "chs"),
    ("bsbio", "BS Biology", "csm"),
    ("bsitnet", "BS Information Technology - Network Track", "ccs"),
    ("bscs", "BS Computer Science", "ccs"),
    ("bsa", "BS Accountancy", "ceba"),
    ("bsba", "BS Business Administration", "ceba"),
    ("bsed", "Bachelor of Secondary Education", "ced"),
    ("beed", "Bachelor of Elementary Education", "ced"),
    ("bspharma", "BS Pharmacy", "chs"),
    ("bsradtech", "BS Radiologic Technology", "chs"),
    ("bafinearts", "BA Fine Arts", "cass"),
    ("bssocio", "BS Sociology", "cass")
]


firstnames = [
    "John", "Mary", "Alex", "Sophia", "Daniel", "Emma", "Michael", "Olivia",
    "James", "Ava", "Ethan", "Isabella", "Lucas", "Mia", "Benjamin", "Amelia",
    "Liam", "Charlotte", "Elijah", "Harper", "Noah", "Evelyn", "Logan", "Abigail",
    "Caleb", "Zoe", "Nathan", "Chloe", "Samuel", "Aria", "Gabriel", "Layla",
    "Christian", "Scarlett", "David", "Victoria", "Anthony", "Grace", "Andrew",
    "Hannah", "Jacob", "Luna", "Julian", "Penelope", "Isaac", "Avery", "Levi",
    "Ella", "Adrian", "Bianca", "Carlo", "Daphne", "Elena", "Felix", "Genevieve", 
    "Iris", "Jasper", "Kendra", "Leon", "Monica", "Nolan", "Ophelia", "Paolo",
    "Quinn", "Rafael", "Selene", "Tobias", "Uma", "Vincent", "Willow", "Xavier",
    "Yuna", "Zachary", "Angelo", "Beatrice", "Cedric", "Delilah", "Eduardo",
    "Farrah", "Georgia", "Hugo", "Ivana", "Jonas", "Katrina", "Lucian", "Marisol",
    "Nadia", "Owen", "Phoebe", "Reuben", "Sienna", "Tristan", "Ulric", "Valeria",
    "Warren", "Xenia", "Yasir", "Zoey", "Harold",
]

lastnames = [
    "Garcia", "Smith", "Johnson", "Lopez", "Brown", "Davis", "Miller", "Wilson",
    "Martinez", "Anderson", "Taylor", "Thomas", "Hernandez", "Moore", "Martin",
    "Jackson", "Thompson", "White", "Lee", "Walker", "Hall", "Allen", "Young",
    "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green",
    "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez",
    "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards",
    "Collins", "Stewart", "Sanchez", "Morris", "Ramirez", "Reyes", "Cruz", "Santos", 
    "Dominguez", "Valdez", "Aquino", "Fernandez", "De Leon", "Navarro", "Rosales",
    "Villanueva", "Cortez", "Salazar", "Mendoza", "Rivera", "Santiago", "Velasco",
    "Abraham", "Chan", "Sy", "Lim", "Go", "Tan", "Yu", "Chua", "Tiu", "Ocampo",
    "Soriano", "Corpuz", "Manalo", "Bautista", "Guzman", "Padilla", "Villamor",
    "Vergara", "Samson", "Palma", "Esquivel", "Duque", "Franco", "Valencia",
    "Quijano", "Benitez", "Galvez", "Pascual","Delgado", "Silva", "Castillo", "Ibarra",  
    "Quinn",
    "Reyes", "Ramirez", "Rivera", "Roberts",
    "Smith", "Santos", "Silva", "Salazar", "Scott",
    "Taylor", "Torres", "Tan", "Turner",
    "Umali", "Underwood",
    "Villanueva", "Vargas", "Valdez", "Valencia",
    "Wilson", "Wright", "Walker",
    "Xenos", "Xiang",
    "Young", "Yu", "Yap",
    "Zimmerman", "Zamora",    "Acosta", "Arias", "Allison", "Atkinson", "Ayala",
    "Barrett", "Becker", "Benson", "Bond", "Booker", "Browning",
    "Calderon", "Carson", "Chavez", "Clarke", "Caldwell", "Conrad",
    "Daniels", "Decker", "Drake", "Dawson", "Delaney", "Diaz",
    "Ellis", "Eaton", "Everett", "Enriquez",
    "Fowler", "Floyd", "Ferrell", "Fry", "Foley",
    "Gallagher", "Gibson", "Glover", "Grady", "Gaines",
    "Hanson", "Hicks", "Hart", "Henderson", "Holden",
    "Irwin", "Inoue", "Isaacs",
    "Jacobs", "Jensen", "Jordan", "Jamison",
    "Keller", "Kaiser", "Kirkland", "Knox",
    "Landry", "Lloyd", "Logan", "Lambert", "Livingston",
    "Manning", "McKinney", "Medina", "Moss", "Maxwell", "Montgomery",
    "Nixon", "Newman", "Navarro", "Nichols",
    "Osborne", "Ochoa", "O'Neill",
    "Patel", "Payne", "Ponce", "Pratt", "Petersen",
    "Quintanilla", "Quick",
    "Riggs", "Roth", "Reeves", "Rowe", "Rangel",
    "Spencer", "Schmidt", "Serrano", "Saunders", "Shaw", "Snyder",
    "Trevino", "Thornton", "Tapia", "Tyler",
    "Urbano", "Ulloa",
    "Valentine", "Vasquez", "Vega", "Velez",
    "Webb", "Whitaker", "Wilkins", "Woods", "Wolfe",
    "Xavier",
    "Yeager", "York",
    "Zapata", "Zephyr", "Zeller"
]

genders = ["m", "f"]

def seed_students(num_students) :
    db = psycopg2.connect(DATABASE_URL)
    cursor = db.cursor()

    for _ in range(num_students):
        year = random.randint(2020, 2025)
        number = f"{random.randint(1, 9999):04d}"
        id_number = f"{year}-{number}"

        firstname = random.choice(firstnames)
        lastname = random.choice(lastnames)
        gender = random.choice(genders)
        program = random.choice(programs)[0]
        yearlevel = random.randint(1,5)

        insert_query = """
            INSERT INTO students (id, first_name, last_name, gender, year_level, program_code)
            VALUES (%s, %s, %s, %s, %s, %s)
        """

        cursor.execute(insert_query, (id_number, firstname, lastname, gender, yearlevel, program))

    db.commit()
    cursor.close()
    db.close()


def seed_colleges() :
    db = psycopg2.connect(DATABASE_URL)
    cursor = db.cursor()
    for college in colleges :
        insert_query = """
            INSERT INTO colleges (code, name)
            VALUES (%s, %s)
        """    
        cursor.execute(insert_query, college)
    
    db.commit()
    cursor.close()
    db.close()

def seed_programs() :
    db = psycopg2.connect(DATABASE_URL)
    cursor = db.cursor()
    for program in programs :
        insert_query = """
            INSERT INTO programs (code, name, college_code)
            VALUES (%s, %s, %s)
        """    
        cursor.execute(insert_query, program)
    
    db.commit()
    cursor.close()
    db.close()

def main() :
    parser = argparse.ArgumentParser(description="Database Seeder")
    parser.add_argument(
        "--table",
        type=str,
        required=True,
        choices=["students","programs","colleges"],
        help="which table to seed"
    )

    parser.add_argument(
        "--count",
        type=int,
        default = 100,
        help="number of students"
    )
    
    args = parser.parse_args()
    if args.table == "students" :
        seed_students(args.count)
    elif args.table == "programs" :
        seed_programs()
    elif args.table == "colleges" :
        seed_colleges()


if __name__ == "__main__" :
    main()