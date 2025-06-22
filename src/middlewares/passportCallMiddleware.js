import passport from "passport"

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (error, user, info) {
            if (error) {
                return res.status(400).json({ error: error.message })
            }
            if (!user) {
                return res.status(401).json({ error: info.message })
            }
            req.user = user
            next()
        }) (req, res, next)
    }
}