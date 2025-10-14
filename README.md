### ssis webapp - webapp version of my students-data-app

setup :

backend

1. cd backend
2. pipenv install
3. pipenv shell
4. put DATABASE_URL and SECRET_KEY in .env <br>
   run with :
5. flask run<br>
   seed db with :
6. python seeder.py --table colleges
7. python seeder.py --table programs
8. python seeder.py --table students [--count <count'>]

frontend

1. cd frontend
2. npm install <br>
   run with
3. npm run dev
