export const authorization = (role) => {
    return async (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(401).send({ status: "error", error: "No estas autorizado a ingresar a este sitio." })
        }
        next()
    }
}