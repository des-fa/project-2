import checkPublicOrPrivate from './_check-ownership.js'
import prisma from '../../_helpers/prisma.js'
import handleErrors from '../../_helpers/handle-errors.js'

const controllersApiPublicPostsShow = async (req, res) => {
  try {
    const { params: { id }, session: { user: { id: userId } = {} } = {} } = req
    const foundPublicPost = await prisma.post.findUnique({
      where: { id: Number(id) },
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        },
        tags: true,
        comments: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true
              }
            }
          }
        }
      },
      rejectOnNotFound: true
    })
    const addedField = {
      ...foundPublicPost,
      comments: foundPublicPost.comments.map((comment) => ({
        ...comment,
        isOwner: comment.userId === userId
      }))
    }

    return res.status(200).json(addedField)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default [
  checkPublicOrPrivate,
  controllersApiPublicPostsShow
]
