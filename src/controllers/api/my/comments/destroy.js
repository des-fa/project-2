import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'
import checkOwnership from '../entries/_check-ownership.js'

const controllersApiMyCommentsDestroy = async (req, res) => {
  try {
    const { params: { id } } = req
    const deletedComment = await prisma.comment.delete({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    })
    return res.status(200).json(deletedComment)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default [
  checkOwnership,
  controllersApiMyCommentsDestroy
]
