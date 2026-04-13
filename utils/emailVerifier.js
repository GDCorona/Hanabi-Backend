async function verifyEmail(email) {
  const apiKey = process.env.EMAIL_API_KEY; 
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