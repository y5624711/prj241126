rm -rf src/main/resources/static

cd ../frontend
npm run build

mv dist ../backend/src/main/resources/static

cd ../backend
./gradlew bootJar

scp -i src/main/resources/secret/key1226.pem build/libs/backend-0.0.1-SNAPSHOT.jar ubuntu@43.201.71.147:./prj.jar
ssh -i src/main/resources/secret/key1226.pem ubuntu@43.201.71.147 'docker stop prj'
ssh -i src/main/resources/secret/key1226.pem ubuntu@43.201.71.147 'docker rm prj'
ssh -i src/main/resources/secret/key1226.pem ubuntu@43.201.71.147 'docker build -t prj .'
ssh -i src/main/resources/secret/key1226.pem ubuntu@43.201.71.147 'docker run -d -p 8080:8080 --restart always --name prj prj'
ssh -i src/main/resources/secret/key1226.pem ubuntu@43.201.71.147 'docker image prune -f'

