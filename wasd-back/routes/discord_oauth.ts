import { Router } from 'express';

let Route = Router();

const DiscordConfig = {
    client_id: "888163448737906809",
    client_secret: "EQrX7RBNSmTf1A81XNejugmF7mGO6wFQ",
    oauth_redirect: "http://localhost:8080/api/v1/auth/discord/authorized"
}

Route.get("/login", (req, res, next) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${DiscordConfig.client_id}&redirect_uri=${DiscordConfig.oauth_redirect}`)
});

export default Route;