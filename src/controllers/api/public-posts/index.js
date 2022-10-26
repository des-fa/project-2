import prisma from '../../_helpers/prisma.js'
import handleErrors from '../../_helpers/handle-errors.js'

const controllersApiPublicPostsIndex = async (req, res) => {
  try {
    // Filters
    const search = req.query.search || ''
    const postTag = req.query.postTag || ''
    const orderByRaw = req.query.orderBy || 'id'
    const sortBy = req.query.sortBy || 'asc'
    const postTitle = orderByRaw === 'title' ? search : ''
    const postUsername = orderByRaw === 'username' ? search : ''

    // Pagination
    const take = 5
    const page = Number(req.query.page || '1')
    const skip = (page - 1) * take

    // Common Where Query
    const OR = []
    const where = {
      checked: true
    }

    if (postTitle) {
      OR.push({
        title: {
          contains: postTitle,
          mode: 'insensitive'
        }
      })
    }

    if (postTag) {
      OR.push({
        tags: {
          some: {
            name: {
              contains: postTag,
              mode: 'insensitive'
            }
          }
        }
      })
    }

    if (postUsername) {
      OR.push({
        user: {
          username: {
            contains: postUsername,
            mode: 'insensitive'
          }
        }
      })
    }

    if (OR.length > 0) {
      where.OR = OR
    }

    // Need to change orderBy based on request
    const getOrderByValue = () => {
      switch (orderByRaw) {
        case 'username': {
          const obj = {
            user: { username: sortBy }
          }
          return obj
        }
        default: {
          const obj = {
            [orderByRaw]: sortBy
          }
          return obj
        }
      }
    }

    const totalPosts = await prisma.post.count({ where })
    const foundPosts = await prisma.post.findMany({
      take,
      skip,
      where,
      orderBy: getOrderByValue(),
      include: {
        user: {
          select: {
            username: true,
            avatar: true
          }
        }
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
