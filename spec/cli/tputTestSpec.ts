import { Driver, InteractionSpecHelper } from 'cli-driver';

describe('tputTest', () => {
  let client: Driver
  let helper: InteractionSpecHelper

  beforeAll(async done => {
    client = new Driver()
    helper = new InteractionSpecHelper(client)
    await client.start({
    })
    done()
  })

  afterAll(async done => {
    await client.destroy().catch()
    helper = null as any
    done()
  })

  it('nave use 11', async done => {
    await client.enter('npx nave use 11 && node -v')
    expect(await helper.waitForStrippedDataToInclude('11.'))
    await helper.expectLastExitCode(true)
    done()
  })

  it('npm run build', async done => {
    await client.enter('npm run build')
    expect(await helper.waitForStrippedDataToInclude('build successful'))
    await helper.expectLastExitCode(true)
    done()
  })

  it('node spec/assets/tputJsTest.js', async done => {
    await client.enter('node spec/assets/tputJsTest.js')
    expect(await helper.waitForStrippedDataToInclude('Normal text'))
    expect(await client.getStrippedDataFromLastWrite()).toContain('Underline text')
    expect(await client.getStrippedDataFromLastWrite()).toContain('Back to normal')
    await helper.expectLastExitCode(true)
    done()
  })

  it('ts-node -T spec/assets/tputTest.ts', async done => {
    await client.enter('ts-node -T spec/assets/tputTest.ts')
    expect(await helper.waitForStrippedDataToInclude('Normal text'))
    expect(await client.getStrippedDataFromLastWrite()).toContain('Underline text')
    expect(await client.getStrippedDataFromLastWrite()).toContain('Back to normal')
    await helper.expectLastExitCode(true)
    done()
  })
})
