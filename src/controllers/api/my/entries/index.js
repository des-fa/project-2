import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'

const controllersApiMyEntriesIndex = async (req, res) => {
  try {
    const { session: { user: { id: userId } } } = req

    // Filters
    const q = req.query.q || ''
    const orderBy = req.query.orderBy || 'id'
    const sortBy = req.query.sortBy || 'asc'

    // Pagination
    const take = 5
    const page = Number(req.query.page || '1')
    const skip = (page - 1) * take

    // Common Where Query
    const where = {
      userId,
      OR: [
        {
          post: {
            entry: {
              mood: {
                contains: q
              }
            }
          }
        }, {
          post: {
            title: {
              contains: q,
              mode: 'insensitive'
            }
          }
        }, {
          post: {
            tag: {
              contains: q,
              mode: 'insensitive'
            }
          }
        }, {
          post: {
            checked: true
          }
        }, {
          post: {
            checked: false
          }
        }
      ]
    }

    const totalMyEntries = await prisma.entry.count({ where })
    const foundMyEntries = await prisma.entry.findMany({
      take,
      skip,
      where,
      orderBy: {
        [orderBy]: sortBy
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
