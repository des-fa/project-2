import yup from 'yup'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'
import checkOwnership from '../entries/_check-ownership.js'

const updateSchema = yup.object({
  comment: yup.string().required()
})

const controllersApiMyCommentsUpdate = async (req, res) => {
  try {
    const { params: { id }, body, session: { user: { id: userId } } } = req
    const verifiedData = await updateSchema.validate(body, { abortEarly: false, stripUnknown: true })
    const updatedComment = await prisma.comment.update({
      where: { id: Number(id) },
      data: {
        ...verifiedData,
        user: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
      }
    })
    return res.status(200).json(updatedComment)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default [
  checkOwnership,
  controllersApiMyCommentsUpdate
]
