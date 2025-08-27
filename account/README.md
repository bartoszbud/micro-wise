
### Create user
```bash
curl -X POST http://localhost:8080/employee/add \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Jan", "lastName": "Kowalski"}'
```
```bash
curl -X PUT http://localhost:8080/employee/ \
  -H "Content-Type: application/json" \
  -d '{"id": {id}, "firstName": "Jan", "lastName": "Kowalski", "age":""}'
```
### Get user with Id
```bash
curl -X GET http://localhost:8080/employee/{Id}
```