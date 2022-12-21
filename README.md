Welcome to TaskTopia!!

Before you being to use the service, please follow the following steps to set up the project.

1. Install 'imagemagick' on your device
    - EX (mac): brew install imagemagick

2. Install and start Docker Desktop (Requires WSL2)
    - Please navigate into the /CS554_TASKTOPIA folder and do the following commands.
        - docker compose up --build

3. Start redis server.
    - redis-server

4. Please navigate into the /server folder and do the following commands.
    - npm install
    - npm run seed
    - npm start

5. Please navigate into the /client folder and do the following commands.
    - npm install
    - npm start
