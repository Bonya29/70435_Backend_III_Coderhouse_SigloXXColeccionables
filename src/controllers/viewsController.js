export class viewsController {
    home = async (req, res) => { res.render('home') }
    productsManagement = async (req,res) => { res.render('productsManagement') }
    usersManagement = async (req, res) => { res.render('usersManagement') }
    register = async (req, res) => { res.render('register') }
    login = async (req, res) => { res.render('login') }
    cart = async (req, res) => { res.render('cart') }
    profile = async (req, res) => { res.render('profile') }
}