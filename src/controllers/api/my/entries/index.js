import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'

const getCheckedValue = (value) => {
  // option1 = 'all'
  // option2 = 'private'
  // option3 = 'public'

  switch (value) {
    case 'private': {
      return false
    }
    case 'public': {
      return true
    }
    default: {
      return undefined
    }
  }
}

const controllersApiMyEntriesIndex = async (req, res) => {
  try {
    const { session: { user: { id: userId } } } = req

    // Filters
    const mood = req.query.mood || ''
    const postTitle = req.query.postTitle || ''
    const postTag = req.query.postTag || ''
    const orderBy = req.query.orderBy || 'id'
    const sortBy = req.query.sortBy || 'asc'
    const checked = getCheckedValue(req.query.checked)

    // Pagination
    const take = 5
    const page = Number(req.query.page || '1')
    const skip = (page - 1) * take

    // Common Where Query
    const OR = []
    const where = {
      userId,
      post: { checked }
    }

    if (mood) {
      OR.push({
        mood: {
          contains: mood,
          mode: 'insensitive'
        }
      })
    }

    if (postTitle) {
      OR.push({
        post: {
          title: {
            contains: postTitle,
            mode: 'insensitive'
          }
        }
      })
    }

    if (postTag) {
      OR.push({
        post: {
          tags: {
            some: {
              name: {
                contains: postTag,
                mode: 'insensitive'
              }
            }
          }
        }
      })
    }

    if (OR.length > 0) {
      where.OR = OR
    }

    const totalMyEntries = await prisma.entry.count({ where })
    const foundMyEntries = await prisma.entry.findMany({
      take,
      skip,
      where,
      orderBy: {
        [orderBy]: sortBy
      },
      include: {
        post: {
          select: {
            checked: true
          }
        }
      }
    })

    return res.status(200).json({
      entries: foundMyEntries,
      meta: { currentPage: page, totalPages: Math.ceil(totalMyEntries / take) }
    })
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default controllersApiMyEntriesIndex
