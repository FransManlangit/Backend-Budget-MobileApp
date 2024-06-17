const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;

  return jwt({
    secret,
    algorithms: ["HS256"],
  }).unless({
    path: [
      {
        url: /^\/api\/v1\/atmsRoute/,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      },
      { url: /\/api\/v1\/usersRoute(.*)/ , methods: ['GET','POST','PUT','OPTIONS'] },

      `${api}/usersRoute`,
      `${api}/usersRoute/login`,
      `${api}/usersRoute/register`,
    ],
  });
}

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
}

module.exports = authJwt
