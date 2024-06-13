'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const cors = require('cors');

const { body, validationResult } = require("express-validator");

const { expressjwt: jwt } = require('express-jwt');

const jwtSecret = '47e5edcecab2e23c8545f66fca6f3aec8796aee5d830567cc362bb7fb31adafc';

// THIS IS FOR DEBUGGING ONLY: when you start the server, generate a valid token to do tests, and print it to the console
//This is used to create the token
const jsonwebtoken = require('jsonwebtoken');
const expireTime = 60; //seconds
//const token = jsonwebtoken.sign( { access: 'premium', authId: 1234 }, jwtSecret, {expiresIn: expireTime});
//console.log(token);

// init express
const app = express();
const port = 3002;

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // To automatically decode incoming json

// Check token validity
app.use(jwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
  // token from HTTP Authorization: header
})
);


// To return a better object in case of errors
app.use( function (err, req, res, next) {
  console.log("err: ",err);
  if (err.name === 'UnauthorizedError') {
    // Example of err content:  {"code":"invalid_token","status":401,"name":"UnauthorizedError","inner":{"name":"TokenExpiredError","message":"jwt expired","expiredAt":"2024-05-23T19:23:58.000Z"}}
    res.status(401).json({ errors: [{  'param': 'Server', 'msg': 'Authorization error', 'path': err.code }] });
  } else {
    next();
  }
} );


/** Static data **************************** */
// First value is full-time, second is part-time
const percentage = {
'02GOLOV': [70.0,30.0],
'02LSEOV': [70.0,30.0],
'01SQJOV': [70.0,30.0],
'01SQMOV': [70.0,30.0],
'01SQLOV': [70.0,30.0],
'01OTWOV': [70.0,30.0],
'02KPNOV': [70.0,30.0],
'01TYMOV': [70.0,30.0],
'01UDUOV': [70.0,30.0],
'05BIDOV': [70.0,30.0],
'04GSPOV': [70.0,30.0],
'01UDFOV': [70.0,30.0],
'01TXYOV': [70.0,30.0],
'01TXSOV': [70.0,30.0],
'02GRSOV': [70.0,30.0],
'01NYHOV': [70.0,30.0],
'01SQOOV': [70.0,30.0],
'01TYDOV': [70.0,30.0],
'03UEWOV': [70.0,30.0],
'01URROV': [70.0,30.0],
'01OUZPD': [70.0,30.0],
'01URSPD': [70.0,30.0],
}
// Create some random data before starting the server. But the value is fixed once the server is started
for (const key of Object.keys(percentage)) {
  percentage[key][0] += (-20 + parseFloat(Math.random(40).toFixed(2)));
  percentage[key][1] += (-20 + parseFloat(Math.random(40).toFixed(2)));
}


/*** APIs ***/

// POST /api/stats
app.post('/api/stats',
   body('courses', 'Invalid array of courses').isArray({min: 1}),
   (req, res) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map(e => e.msg));
      return res.status(400).json({errors: errList});
    }

  const fullTime = req.auth.fullTime;
  const courseCodes = req.body.courses;
  let percent = 0;

  if (fullTime!==undefined && courseCodes !== undefined) {
    let cnt = 0;
    for (const c of courseCodes) {
      if (percentage[c]) {
        percent += (fullTime ? percentage[c][0] : percentage[c][1]);
        cnt++;
      }
    }
    if (cnt > 0)
      percent /= cnt;
  }
  res.json({successRate: percent});
});


/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`qa-server listening at http://localhost:${port}`);
});
