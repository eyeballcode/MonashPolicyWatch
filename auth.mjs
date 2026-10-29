import path from 'path'
import fs from 'fs/promises'
import { authenticate } from '@google-cloud/local-auth'
import { google } from 'googleapis'

import credentials from './credentials.json' with { type: 'json' }

const SCOPES = [
  'https://mail.google.com',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send'
]

const CREDENTIALS_PATH = path.join(import.meta.dirname, 'credentials.json')

async function authenticateClient() {
  const auth = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });

  const gmail = google.gmail({version: 'v1', auth});
  const userData = (await gmail.users.getProfile({ userId: 'me' })).data

  return {
    ...auth.credentials,
    emailAddress: userData.emailAddress
  }
}

const auth = await authenticateClient()
await fs.writeFile(path.join(import.meta.dirname, 'oauth.json'), `
EMAIL_ADDRESS=${auth.emailAddress}
CLIENT_ID="${credentials.installed.client_id}"
CLIENT_SECRET="${credentials.installed.client_secret}"
REFRESH_TOKEN="${auth.refresh_token}"
`.trim())