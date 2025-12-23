// Get site URL from environment variable, use default value if not set
// Note: Please set the correct PUBLIC_SITE_URL in .env file after first deployment
const SITE_URL = import.meta.env.PUBLIC_SITE_URL || "https://agrotastingchallenge.fr/";

export const siteConfig = {
	title: "Agro Tasting Challenge",
	author: "Agro Tasting Challenge",
	url: SITE_URL,
	mail: "contact@agrotastingchallenge.fr",
	utm: {
		source: `${SITE_URL}`,
		medium: "referral",
		campaign: "navigation",
	},
	meta:{
		title: "Agro Tasting Challenge",
		description: "L’Agro Tasting Challenge (ATC) est un événement autour de la dégustation et du partage.",
		keywords: "Agro Tasting Challenge, ATC, dégustation, vin, éditions",
		image: `${SITE_URL}/og.jpg`,
		twitterHandle: "",
	},
};

// Footer
export const socialLinks = [
	{
		name: "Email",
		url: "mailto:contact@agrotastingchallenge.fr",
		icon: `<svg class="ic-mail icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4.236-7.382 4.612a2 2 0 0 1-2.236 0L4 8.236V6l7.764 4.852a.5.5 0 0 0 .472 0L20 6v2.236Z"/></svg>`,
	},
];


