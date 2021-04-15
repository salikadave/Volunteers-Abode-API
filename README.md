# Volunteers-Abode-API

## Using this API:
1. **Available Routes**
- `/signUp`: METHOD: **POST** --> Returns a token
```
body: {
  userType: Boolean // 0 for Social Worker, 1 for NGO Admin, 2 for System Admin
  username || ngoName: String,
  email: String,
  password: String
}
```
- `/login` : METHOD: **POST** --> Returns a token
```
body: {
  userType: Boolean // 0 for Social Worker, 1 for NGO Admin, 2 for System Admin
  username || email: String,
  password: String
}
```
Sample Response:
**For User Type 0** SW:
```
data: {
  accessToken: '',
  links: {
    update: /socialWorker/update/{id},
    details: /socialWorker/details/{id},
    delete: /socialWorker/delete/{id}
  }
}
```
**For User Type 1** NGO Admin:
```
data: {
  accessToken: '',
  links: {
    update: /ngoAdmin/update/{id},
    details: /ngoAdmin/{id},
    delete: /ngoAdmin/delete/{id}
  }
}
```
**For User Type 2** System Admin:
```
data: {
  accessToken: '',
  links: {
    socialWorker: {
      update: /socialWorker/update/{id},
      details: /socialWorker/details/{id},
      detailsAll: /socialWorker/details/all,
      delete: /socialWorker/delete/{id}
    },
    ngoAdmin: {
       update: /ngoAdmin/update/{id},
      details: /ngoAdmin/{id},
      detailsAll: /ngoAdmin/details/all,
      delete: /ngoAdmin/delete/{id}
      }
    
  }
}
```
3. **User: Social Worker** `/socialWorker`
Hereafter, all routes require token before accessing any data.
- `/update/{id}`: METHOD **PUT** --> Update any of the values in the user schema.
- `/details/{id}`: METHOD **GET** --> View details of a particular user.
- `/details/all`: METHOD **GET** --> Fetch details of all users.
- `/delete/{id}`: METHOD **DELETE** --> Delete an account of the user.

3. **User: NGO Admin** `/ngoAdmin`
Hereafter, all routes require token before accessing any data.
- `/update/{id}`: METHOD **PUT** --> Update any of the values in the user schema.
- `/details/{id}`: METHOD **GET** --> View details of a particular user.
- `/details/all`: METHOD **GET** --> Fetch details of all users.
- `/delete/{id}`: METHOD **DELETE** --> Delete an account of the user.
Hereafter, all routes require token before accessing any data.

## To run this project:
1. Create a folder `.env` and place all the keys (as per previous code files)
```
MONGO_ATLAS_URI=<url>
JWT_SECRET=<string_without_quotes>
```
2. Run `npm install`
