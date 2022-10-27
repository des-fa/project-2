import prisma from '../../_helpers/prisma.js'
import handleErrors from '../../_helpers/handle-errors.js'

const checkPublicOrPrivate = async (req, res, next) => {
  try {
    const { params: { id } } = req
    await prisma.post.findFirst({ where: { id: Number(id), checked: true }, rejectOnNotFound: true })
    return next()
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default checkPublicOrPrivate
