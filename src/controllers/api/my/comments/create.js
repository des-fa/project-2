import yup from 'yup'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'

const createSchema = yup.object({
  comment: yup.string().required()
})

const controllersApiMyCommentsCreate = async (req, res) => {
  try {
    const { body, session: { user: { id: userId } } } = req
    // const userId = req.session.user.id
    console.log(body)

    const verifiedData = await createSchema.validate(body, { abortEarly: false, stripUnknown: true })
    const newComment = await prisma.comment.create({
      data: {
        ...verifiedData,
        user: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: Number(body.postId)
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
        // post: true
      }
    })
    return res.status(201).json(newComment)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default controllersApiMyCommentsCreate
