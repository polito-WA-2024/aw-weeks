# `qa-server2`

The `qa-server2` presents APIs accessible via a signed JWT token.

### Summary of the endpoints

`POST /api/suggestions`  


### Provide suggestions

* `POST /api/suggestions`
* Description: returns suggestions fo the given question. The details in the answer will depend on the access level of the request as described in the JWT token payload in the "access" field of the object. Two possible values: "basic" or "premium".
* Request body: An object representing the question (Content-Type: `application/json`).

```
{
    "question": "Best JS version?"
}
```

* Response: `200 OK` (success), or `401 Unauthorized` (error).
* Response body: An object containing the suggestion (Content-Type: `application/json`).

```
{
    "text": "I don't know"
}
```

