const router = require('koa-router')()
const sellerController = require('../../controllers/seller')
const passport = require('../../middlewares/passport')

router.prefix('/api/seller')

router.post('/sregisterinfo',sellerController.sregisterinfo)

router.post('/spostlogin',sellerController.spostlogin)

router.post('/findgoods',sellerController.findgoods)

router.post('/uploadgoods',sellerController.uploadgoods)

router.post('/gettaken',sellerController.gettaken)

router.post('/gettaking',sellerController.gettaking)

router.post('/takeorder',sellerController.takeOrder)

router.post('/getCancel',sellerController.getCancel)

router.all('/*',
passport.authenticate('jwt', { session: false }), //不需要session    解析token
async(ctx,next) =>{
    console.log(ctx.request)
    await next()
})

module.exports = router