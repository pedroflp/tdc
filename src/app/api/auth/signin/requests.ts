import { fetchApi } from "@/services/api/fetchApi";
import discordAuth from "@/services/discord";

export async function handleDiscordAuth() {
  const authUrl = discordAuth.generateAuthUrl({
    scope: ['identify', 'email', 'guilds'],
    responseType: 'code',
  });

  window.location.assign(authUrl);
};

export async function signIn(authCode: string) {
 try {
  const tokenRequestResponse = await discordAuth.tokenRequest({
    code: authCode,
    scope: ["identify", "guilds", "email"],
    grantType: "authorization_code",
  });
   
  const signInResponse = await fetchApi('auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      accessToken: tokenRequestResponse.access_token,
      refreshToken: tokenRequestResponse.refresh_token,
      expires: tokenRequestResponse.expires_in,
    })
  })
  
   return await signInResponse.json();
 } catch (error) {
  console.log(error)
 }
}