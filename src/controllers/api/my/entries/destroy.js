import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'
import checkOwnership from './_check-ownership.js'

const controllersApiMyEntriesDestroy = async (req, res) => {
  try {
    const { params: { id } } = req
    const deletedEntry = await prisma.entry.delete({
      where: { id: Number(id) },
      include: {
        activities: true,
        post: true
      }
    })
    return res.status(200).json(deletedEntry)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default [
  checkOwnership,
  controllersApiMyEntriesDestroy
]
