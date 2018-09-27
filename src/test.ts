import test from 'ava'
import * as http from 'http'
import { Socket } from 'net'
import parseBearerToken from '.'

test('missing headers', t => {
  const req = new http.IncomingMessage(new Socket())
  delete req.headers
  const token = parseBearerToken(req)
  t.is(token, null)
})

test('missing auth header', t => {
  const req = new http.IncomingMessage(new Socket())
  req.headers.authorization = ''
  const token = parseBearerToken(req)
  t.is(token, null)
})

test('malformed auth header', t => {
  const req = new http.IncomingMessage(new Socket())
  req.headers.authorization = 'bearer'
  const token = parseBearerToken(req)
  t.is(token, null)
})

test('non-bearer token', t => {
  const req = new http.IncomingMessage(new Socket())
  req.headers.authorization = 'basic Zm9vOmJhcg=='
  const token = parseBearerToken(req)
  t.is(token, null)
})

test('mYSpAcEcASe schema', t => {
  const req = new http.IncomingMessage(new Socket())
  req.headers.authorization = 'bEaRER token'
  const token = parseBearerToken(req)
  t.is(token, 'token')
})

test('valid token', t => {
  const req = new http.IncomingMessage(new Socket())
  req.headers.authorization = 'Bearer token'
  const token = parseBearerToken(req)
  t.is(token, 'token')
})

test('token with spaces', t => {
  const req = new http.IncomingMessage(new Socket())
  req.headers.authorization = 'Bearer i am a token!'
  const token = parseBearerToken(req)
  t.is(token, 'i am a token!')
})
