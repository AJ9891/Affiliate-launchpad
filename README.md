# Affiliate Launchpad

**Brand:** Affiliate Launchpad
**Deploy target:** GitHub Pages (https://aj9891.github.io/affiliate-launchpad/)

This repo is preconfigured for a Vite + React + Tailwind app and is integrated with **SendShark** for automation.
New leads will be added to your **Launchpad** list and can be routed into your follow-up series.

## Quickstart (run locally)
1. Copy `.env.example` to `.env` and fill values (do NOT commit `.env` to git)
2. `npm install`
3. `npm run dev`

## Build & Deploy to GitHub Pages
1. Create a GitHub repo named `affiliate-launchpad` under **aj9891**.
2. Push the project to GitHub.
3. `npm run build`
4. `npm run deploy`

## SendShark Setup
1. From your SendShark dashboard, create (or confirm) a list named **Launchpad**.
2. Get your **API URL**, **API Key**, and **List ID**.
3. Edit `.env` and set `VITE_SENDSHARK_API_URL`, `VITE_SENDSHARK_API_KEY`, and `VITE_SENDSHARK_LIST_ID`.
4. Set `VITE_LEAD_MAGNET_DOWNLOAD` to your lead magnet download link.
5. Run or deploy the app. When visitors submit the email form, they will be added to SendShark and tagged `affiliate-lead`.
6. Create a SendShark automation (workflow) that starts a 7-day email sequence for contacts with the `affiliate-lead` tag. Import the HTML files from the follow-up ZIP (provided separately).

## From / Reply-to (pre-filled)
- From Name: Abbigal
- From Email: abby004@gmail.com

## Security notes
- Never commit your real API key to a public repo. Use `.env` locally and keep secrets out of version control.
