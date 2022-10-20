import prisma from '../../_helpers/prisma.js'
import handleErrors from '../../_helpers/handle-errors.js'

const controllersApiPublicPostsShow = async (req, res) => {
  try {
    const { params: { id } } = req
    const foundPublicPost = await prisma.post.findUnique({ where: { id: Number(id) },
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        },
        tags: {
          select: {
            name: true
          }
        },
        comments: {
          select: {
            id: true,
            comment: true
          }
        }
      },
      rejectOnNotFound: true })
    return res.status(200).json(foundPublicPost)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default controllersApiPublicPostsShow
