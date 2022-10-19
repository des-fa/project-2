import prisma from '../../_helpers/prisma.js'
import handleErrors from '../../_helpers/handle-errors.js'

const controllersApiPublicPostsIndex = async (req, res) => {
  try {
    // Filters
    const q = req.query.q || ''
    const orderBy = req.query.orderBy || 'id'
    const sortBy = req.query.sortBy || 'asc'

    // Pagination
    const take = 10
    const page = Number(req.query.page || '1')
    const skip = (page - 1) * take

    // Common Where Query
    const where = {
      checked: true,
      OR: [
        {
          title: {
            contains: q,
            mode: 'insensitive'
          }
        }, {
          tag: {
            contains: q,
            mode: 'insensitive'
          }
        }, {
          user: {
            username: {
              contains: q
            }
          }
        }
      ]
    }

    const totalPosts = await prisma.post.count({ where })
    const foundPosts = await prisma.post.findMany({
      take,
      skip,
      where,
      orderBy: {
        [orderBy]: sortBy
      }
    })

    return res.status(200).json({
      posts: foundPosts,
      meta: { currentPage: page, totalPages: Math.ceil(totalPosts / take) }
    })
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default controllersApiPublicPostsIndex
