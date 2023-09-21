import puppeteer, { Page } from 'puppeteer'
import { setTimeout } from 'timers/promises'
const browser = await puppeteer.launch({
	headless: false,
	userDataDir: '/tmp/ecommerce-crawler',
})
const page = await browser.newPage()
await page.goto('https://www.studioneat.com')
await page.waitForSelector('.product-title a')
const productLinks = await page.evaluate(() => {
	return [...document.querySelectorAll('.product-title a')].map(e => e.href)
})
console.log(productLinks)
await page.close()
/**
 * @param {Page} page
 * @param {String} selector
 */

const extractText = (page, selector) => {
	return page.evaluate(selector => {
		return document.querySelector(selector)?.innerHTML
	}, selector)
}

for (let productLink of productLinks) {
	const page = await browser.newPage()
	await page.goto(productLink, { waitUntil: 'networkidle2', timeout: 60000 })
	await page.waitForSelector('.ecomm-container')
	const title = await extractText(page, '.ecomm-container h1')
	const tagline = await extractText(page, '.product-tagline')
	const price = await extractText(page, '#productPrice')
	const description = await extractText(page, '.product-desc')
	// await page.close()

	const variants = await page.evaluate(() => {
		return [...document.querySelectorAll('.single-option-selector')].map(
			e => e.value
		)
	})
	const variantData = []
	for (let variant of variants) {
		await page.select('.single-option-selector', variant)
		await setTimeout(100)
		variantData.push({
			variant,
			price: await page.$eval('#productPrice', e => e.innerHTML),
		})
		console.log({
			productLink,
			title,
			tagline,
			price,
			description,
			variantData,
		})
	}
}
await browser.close()
// await browser.close()
// for (let productLink of productLinks) {
// 	const page = await browser.newPage()
// 	await page.goto(productLink, { waitUntil: 'networkidle0' })
// 	await page.waitForSelector('.product-title')
// 	const title = await page.evaluate(() => {
// 		return document.querySelector('.product-title')?.innerHTML
// 	})
// 	const tagline = await page.evaluate(() => {
// 		return document.querySelector('.product-tagline')?.innerHTML
// 	})

// 	console.log(productLink, title, tagline)
// 	await page.close()
// }
