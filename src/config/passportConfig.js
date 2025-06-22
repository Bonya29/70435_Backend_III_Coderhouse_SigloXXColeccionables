import passport from "passport"
import jwt from "passport-jwt"
import { envConfig } from "./envConfig.js"

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

export const initializePassport = () => {
    const cookieExtractor = req => {
        let token = null
        if (req && req.cookies) {
            token = req.cookies['sigloXXColeccionablesToken']
        }
        return token
    }
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: envConfig.privateKey
    }, async (dataFromToken, done) => {
        try {
            return done(null, dataFromToken)
        } catch (error) {
            return done(error)
        }
    }))
}