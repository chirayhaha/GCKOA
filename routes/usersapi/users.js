const router = require('koa-router')()
const userController = require('../../controllers/user')
const passport = require('../../middlewares/passport')

router.prefix('/api/users')

router.post('/postlogin',userController.postlogin)

router.post('/registerinfo',userController.registerinfo)

router.get('/logout',userController.logout)

router.get('/readcookbook',userController.readcookbook)

router.post('/sharebooks',userController.sharebooks)

router.post('/readdetail/',userController.readdetail)

router.post('/mybooks',userController.mybooks)

router.post('/goodlist',userController.goodlist)

router.post('/searchgood',userController.searchgood)

router.post('/getgoodinfo',userController.getgoodinfo)

router.post('/addaddress',userController.addaddress)

router.post('/addlist',userController.addlist)

router.post('/deladd',userController.deladd)

router.post('/addcarlist',userController.addcarlist)

router.post('/paybill',userController.paybill)

router.post('/getpayed',userController.getpayed)

router.post('/getpaying',userController.getpaying)

router.post('/updatecarlist',userController.updatecarlist)

router.post('/getcarinfo',userController.getcarinfo)

router.post('/setbookgoods',userController.setbookgoods)

router.post('/getbookgoods',userController.getbookgoods)

router.post('/clearcarlist',userController.clearcarlist)

router.post('/selected',userController.selected)

router.post('/allunselected',userController.allunselected)

router.post('/unselected',userController.unselected)

router.post('/getorder',userController.getorder)

router.post('/getaddress',userController.getAdress)

router.post('/delcart',userController.delcart)

router.post('/createbill',userController.createbill)

router.post('/cancelorder',userController.cancelorder)

router.post('/gettakenorder',userController.gettakenorder)

router.post('/getsellerinfo',userController.getsellerinfo)

router.post('/getallgoods',userController.getallgoods)

router.get('/searchbook',userController.searchbook)

router.post('/getallorders',userController.getallorders)

router.post('/getCancelorders',userController.getCancelorders)

router.post('/orderdetail',userController.orderdetail)

router.all('/*',
passport.authenticate('jwt', { session: false }), //不需要session    解析token
async(ctx,next) =>{
  console.log(ctx.request)
  await next()
})

router.get('/userinfo',userController.userinfo)

module.exports = router