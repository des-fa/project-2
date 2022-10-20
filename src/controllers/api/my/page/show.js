import moment from 'moment'
import fetch from 'node-fetch'

import prisma from '../../../_helpers/prisma.js'
import handleErrors from '../../../_helpers/handle-errors.js'

// const generateQuote = async () => {
//   const url = 'https://type.fit/api/quotes'

//   const response = await fetch(url)
//   const allQuotes = await response.json()
// const randomIdx = Math.floor(Math.random() * allQuotes.length)
// const quoteText = allQuotes[randomIdx].text
// const auth = allQuotes[randomIdx].author

// if (!auth) { author = 'Anonymous' }
// document.getElementById('QuoteText').innerHTML = quoteText
// document.getElementById('author').innerHTML = `~ ${auth}`
// }

// const generateQuote = async (req, res) => {
//   try {
//     const url = 'https://api.quotable.io/random?tags=motivational|inspirational'
//     const allQuotes = await fetch(url)
//     return res.status(200).json(allQuotes)
//   } catch (err) {
//     return handleErrors(res, err)
//   }
// }

// const generateQuote = async () => {
//   const url = 'https://api.quotable.io/random?tags=motivational|inspirational'
//   try {
//     const res = await fetch(url)
//     const quote = await res.json()
//     return quote
//   } catch (err) {
//     return err
//   }
// }

const controllersApiMyPageShow = async (req, res) => {
  try {
    fetch('https://api.quotable.io/random?tags=motivational|inspirational')
      .then((response) => response.json())
      .then((data) => console.log(data))

    const { session: { user: { id: userId } } } = req
    const currentDate = moment().toDate()

    const foundEntry = await prisma.entry.findFirst({
      where: {
        userId: Number(userId),
        createdAt: {
          equals: currentDate
        }
      },
      include: {
        activities: {
          select: {
            activity: true
          }
        },
        post: {
          include: {
            tags: true
          }
        }
      },
      rejectOnNotFound: true
    })
    return res.status(200).json(foundEntry)
  } catch (err) {
    return handleErrors(res, err)
  }
}

export default [
  // generateQuote,
  controllersApiMyPageShow
]
