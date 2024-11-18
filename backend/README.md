### steps to setup backend:

1. ke folder `backend` di repo!!
2. bikin venv & install reqs
    
    ```
    python -m venv venv
    
    source venv/bin/activate
    
    pip install -r requirements.txt
    ```
    
3. setup database postgresql locally (based on this: https://postgresapp.com/):
    1. donlot [postgres.app](https://github.com/PostgresApp/PostgresApp/releases/download/v2.7.9/Postgres-2.7.9-17.dmg) dulu trus install, trus klik initiate/start (ini bakal ngestart server postgresql)
    2. ke terminal “backend”, and then:
        
        ```
        export PATH="/Applications/Postgres.app/Contents/Versions/latest/bin:$PATH"
        
        createdb kgv-ai-tutor
        ```
        
    - **OR** pake GUI buat db (cth: DBeaver, pgAdmin4, etc); pake pgadmin4 aja kalo mau khusus postgresql — ini kepake kalo udh ada data”
        1. donlot pgadmin4: https://www.pgadmin.org/download/
        2. ikutin tutor ini buat bikin db (namanya “kgv-ai-tutor”): https://www.youtube.com/watch?v=oWsAYx2R9RI&t=119s
