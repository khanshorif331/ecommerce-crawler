import { Queue, Worker } from 'bullmq'
import Redis from 'ioredis'
// import 'dotenv/config'

const connection = new Redis(process.env.REDIS_PATH, {
	maxRetriesPerRequest: null,
})

const myQueue = new Queue('product', { connection })
new Worker(
	'product',
	async job => {
		console.log(job.data, job.id)
	},
	{ connection }
)

myQueue.add(
	'product 1',
	{ url: 'https://example.com/#1' },
	{ jobId: 'https://example.com/#1' }
)
// myQueue.add('product 1', { url: 'https://example.com/#1' })
