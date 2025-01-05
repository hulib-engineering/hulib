import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { Env } from '@/libs/Env.mjs';
import { EmailRegistrationValidation } from '@/validations/EventRegistrationValidation';

const EventRegistrationValidation = EmailRegistrationValidation.extend({
  transferBill: z.string(),
});

export const POST = async (request: Request) => {
  const json = await request.json();
  const parse = EventRegistrationValidation.safeParse(json);

  if (!parse.success) {
    return NextResponse.json(parse.error.format(), { status: 422 });
  }

  const {
    fullname,
    birthday,
    email,
    socialMedia,
    career,
    hometown,
    firstChoice,
    secondChoice,
    question,
    transferBill,
    willingToBecomeAmbassador,
  } = parse.data;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: Env.CLIENT_EMAIL,
      client_id: Env.CLIENT_ID,
      private_key: Env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/drive',
      'https://www.googleapis.com/auth/drive.file',
      'https://www.googleapis.com/auth/spreadsheets',
    ],
  });

  const sheets = google.sheets({
    auth,
    version: 'v4',
  });

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: Env.SPREADSHEET_ID,
    range: 'Sheet1!A2:C',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [
        [
          fullname,
          birthday,
          email,
          socialMedia,
          career,
          hometown,
          firstChoice,
          secondChoice,
          question,
          transferBill,
          '',
          willingToBecomeAmbassador,
        ],
      ],
    },
  });

  return NextResponse.json({
    status: true,
    response,
  });
};
