import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'
import checkOwnership from '../entries/_check-ownership.js'

const controllersApiMyPageShow = async (req, res) => {
  try {
    const { session: { user: { id: userId } } } = req
    const today = new Date()
    const currentDate = today.getDate()

    const foundEntry = await prisma.entry.findUnique({ where: {
      userId: Number(userId),
      createdAt:
    },
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
  controllersApiMyPageShow
]

// check if there is an entry created that matches today
// if not: generate form
// "Motivational quote (outside API)
// entryid,
// mood,
// activities,
// gratitude sentence,
// title,
// content,
// tags,
// posts[][checked],
// createdAt"
