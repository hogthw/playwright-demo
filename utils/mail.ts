export async function waitForOTP() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return '123456';
}