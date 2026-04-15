import jwt from 'jsonwebtoken'

export function signToken(user) {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me'
  return jwt.sign({ sub: user.id }, secret, { expiresIn: '7d' })
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET || 'dev_secret_change_me'
  return jwt.verify(token, secret)
}

export function getBearerToken(req) {
  const h = req.headers.authorization || ''
  const [type, token] = h.split(' ')
  if (type?.toLowerCase() !== 'bearer') return null
  return token || null
}

