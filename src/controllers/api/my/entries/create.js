import yup from 'yup'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'

const createSchema = yup.object({
  mood: yup.string().required(),
  gratitude: yup.string().required(),
  // using array of objects
  activities: yup.array().of(yup.object({
    activity: yup.string().required()
  })).required(),
  // using array of strings
  // activities: yup.array().of(yup.string().required()),
  post: yup.object({
    title: yup.string().required(),
    content: yup.string().required(),
    tag: yup.string().required(),
    checked: yup.boolean().transform((value) => (!!value))
  }).default(undefined)
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
        // what they expect
        // activities: {
        //   create: [
        //     { activity: 'act1' },
        //     { activity: 'act2' },
        //   ]
        // }
        // what you did
        // activities: {
        //   create: ['act1', 'act2']
        // }
        // using array of objects
        activities: {
          create: verifiedData.activities
        },
        // using array of strings
        // activities: {
        //   create: verifiedData.activities.map((activity) => ({
        //     activity
        //   }))
        // },
        post: {
          create: verifiedData.post
        }
      },
      include: {
        activities: true,
        post: true
      }
    })
    return res.status(201).json(newEntry)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default controllersApiMyEntriesCreate
