import 'dotenv/config';
import imaps from 'imap-simple';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function getOTP(): Promise<string | null> {
  const config = {
    imap: {
      user: process.env.GMAIL_USER!,
      password: process.env.GMAIL_PASS!,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 10000
    }
  };

  let connection;
  try {
    connection = await imaps.connect(config);
    await connection.openBox('INBOX');

    const searchCriteria = ['UNSEEN']; 
    const fetchOptions = {
      bodies: ['TEXT'],
      markSeen: false
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    if (!messages.length) return null;

    const latest = messages[messages.length - 1];
    const textPart = latest.parts.find((p: any) => p.which === 'TEXT');
    const body = textPart ? textPart.body : '';

    console.log('Nội dung Email nhận được:', body);

    const match = body.match(/\d{6}/);
    return match ? match[0] : null;

  } catch (err) {
    console.error('Lỗi IMAP:', err);
    return null;
  } finally {
    if (connection) connection.end();
  }
}