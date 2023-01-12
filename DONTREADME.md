# storm

## user manage
user authed, create a MVT
`user1.instance1`
`uff@lm.com.afb2k1mco03`

```json
{
  "user1": [
    "instance1",
    "instance2"
  ],
  "user2": [
    "instance1"
  ]
}
```

## permission control
when user logged in, server use the beacon and a generated instance ID to make a JWT and send it back to the client, and
this is the only token that the client communicate with the server

`payload structure`

```json
{
  "beacon": "example_beacon",
  "instance": "generated_instance_id"
}
```

## something about the base
data base, reading and converting different kind of data into one unified form
existing form: yaml, db(sql), json, memory(JS object)
### physical

