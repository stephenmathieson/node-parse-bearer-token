
/**
 * Expose `parseBearerToken`.
 */

module.exports = parseBearerToken;

/**
 * Parse the `token` from the given
 * `req`'s authorization header.
 *
 * @api public
 * @param {Request} req
 * @return {String|null}
 */

function parseBearerToken(req) {
  var auth;
  if (!req.headers || !(auth = req.headers.authorization)) {
    return null;
  }
  var parts = auth.split(' ');
  if (2 > parts.length) return null;
  var schema = parts.shift().toLowerCase();
  var token = parts.join(' ');
  if ('bearer' != schema) return null;
  return token;
}
