import { test, expect } from '@playwright/test'

test('Upload a file using a POST request', async ({ request }) => {
  const fileBuffer = await test.step('Fetch file', async () => {
    const fileUrl  = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    return request.get(fileUrl)
  })

  await test.step('Upload file', async () => {
    const response = await request.post('https://filebin.net/pp9on3zvwv7zq6lm/dummy.pdf', {
      data: await fileBuffer.body(),
    })
    await expect(response).toBeOK()
  })
})