const router = require('koa-router')()
const adminController = require('../controllers/admin')

router.prefix('/users')

router.get('/all',adminController.all)
router.get('/alls',adminController.alls)

router.get('/delete/:userid',adminController.delete)

router.get('/setadmin/:userid',adminController.setadmin)

router.post('/uploadbook/:userid',adminController.uploadbook)
router.get('/openupload',adminController.openupload)

router.get('/ordersmanage',adminController.ordersmanage)

router.get('/cookbooks',adminController.Allbooks)

router.get('/delbooks/:id',adminController.delbooks)

router.all('/*', async (ctx, next) => {
  if(!ctx.isAuthenticated()) {  //http request操作，检查用户是否存在session中
      ctx.status = 401
  }
  await next()
})

module.exports = router
