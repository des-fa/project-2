import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'
import checkOwnership from './_check-ownership.js'

const controllersApiMyEntriesShow = async (req, res) => {
  try {
    const { params: { id } } = req
    const foundEntry = await prisma.entry.findUnique({ where: { id: Number(id) },
      include: {
        activities: true,
        post: true
      },
      rejectOnNotFound: true })
    return res.status(200).json(foundEntry)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default [
  checkOwnership,
  controllersApiMyEntriesShow
]
