import yup from 'yup'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'

const createSchema = yup.object({
  mood: yup.string().required(),
  gratitude: yup.string().required(),
  activities: yup.array().of(yup.string().required()).required(),
  post: yup.object({
    title: yup.string().required(),
    content: yup.string().required(),
    tag: yup.string().required(),
    checked: yup.boolean().transform((value) => (!!value))
  }).default({})
})

const controllersApiMyEntriesCreate = async (req, res) => {
  try {
    const { body, session: { user: { id: userId } } } = req
    // const userId = req.session.user.id

    const verifiedData = await createSchema.validate(body, { abortEarly: false, stripUnknown: true })
    const newEntry = await prisma.entry.create({
      data: {
        // title: verifiedData.title,
        // description: verifiedData.description,
        ...verifiedData,
        user: {
          connect: {
            id: userId
          }
        },
        activities: {
          create: verifiedData.activities
        },
        post: {
          create: verifiedData.post
        }
      }
    })
    return res.status(201).json(newEntry)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default controllersApiMyEntriesCreate
