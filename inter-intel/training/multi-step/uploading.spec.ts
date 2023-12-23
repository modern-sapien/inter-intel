import { test, expect } from '@playwright/test'

/*
To test any binary uploads, you need to provide a file object. 
Currently, Checkly does not have a dedicated storage layer where you could upload that file, 
so you need to host it yourself at a (publicly) accessible location like an AWS S3 bucket, 
Dropbox or any other file hosting service.

Having done that, you can “upload” files using a simple HTTP POST request with a (binary) body 
using Playwright’s built-in request object.
*/

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