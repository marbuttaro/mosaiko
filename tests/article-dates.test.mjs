import assert from 'node:assert/strict'
import { test } from 'node:test'
import { articleDates } from '../src/lib/article-dates.js'
import { allNews } from '../src/data/tutte-le-news.js'

test('original WordPress articles retain their actual UTC timestamps', () => {
  const originals = allNews.filter(item => item.wpId)
  assert.equal(originals.length, 42)
  for (const item of originals) {
    const dates = articleDates(item)
    for (const timestamp of Object.values(dates)) {
      assert.match(timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/)
      assert(!Number.isNaN(Date.parse(timestamp)))
    }
    assert(dates.datePublished && dates.dateModified)
  }
  assert.deepEqual(articleDates(allNews.find(item => item.slug === '2-8')), {
    datePublished: '2026-04-01T06:01:26Z',
    dateModified: '2026-04-18T06:04:25Z',
  })
})

test('dates edited in the CMS and new articles never inherit invented or stale times', () => {
  const original = allNews.find(item => item.slug === '2-8')
  assert.deepEqual(articleDates({ ...original, isoDate: '2026-11-04', modified: '2026-11-04' }), {})
  assert.deepEqual(articleDates({ ...original, slug: 'a-different-article' }), {})
  for (const item of allNews.filter(item => !item.wpId)) assert.deepEqual(articleDates(item), {})
})
