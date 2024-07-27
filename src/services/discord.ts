import DiscordOauth2 from 'discord-oauth2';

const discordAuth = new DiscordOauth2({
	clientId: process.env.NEXT_PUBLIC_discordAuthClientId,
	clientSecret: process.env.NEXT_PUBLIC_discordAuthClientSecret,
	redirectUri: process.env.NEXT_PUBLIC_apiBaseUrl,
});


export default discordAuth;