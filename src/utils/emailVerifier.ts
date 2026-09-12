async function verifyEmail(email: string) {
  const apiKey = process.env.EMAIL_API_KEY; 
  if (!apiKey) {
      throw new Error("CRITICAL: EMAIL_API_KEY is missing from .env!");
  }
  const url = `http://apilayer.net/api/check?access_key=${apiKey}&email=${encodeURIComponent(email)}&smtp=1&format=1`;
  
  try {
    const res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.error("Email API failed:", error);
    return null;
  }
}
export { verifyEmail };