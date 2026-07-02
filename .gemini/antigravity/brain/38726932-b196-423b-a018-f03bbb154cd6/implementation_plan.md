# Add Cloudflare Turnstile to Authentication

We will integrate Cloudflare Turnstile to protect your login and signup forms from bots and abuse. Since you are using Supabase, we can use Supabase's native support for Turnstile, which securely validates the captcha token on the server automatically.

## User Review Required
> [!IMPORTANT]
> You will need to configure your Supabase project to enable Turnstile protection. You cannot complete this setup without adding the keys to both your `.env.local` file and your Supabase Dashboard.

## Open Questions
> [!WARNING]
> Do you already have your **Site Key** and **Secret Key** from the Cloudflare Dashboard? If so, we can proceed. We only need the Site Key for the code, but you will need the Secret Key for your Supabase settings.

## Proposed Changes

### Configuration
#### [MODIFY] .env.local
- Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY`

### Dependencies
- Install `@marsidev/react-turnstile` for an easy React component wrapper.

### UI Components
#### [MODIFY] src/app/login/page.js
- Import the Turnstile component.
- Add a Turnstile widget below the password input.
- Capture the `captchaToken` when the user solves it.
- Pass `captchaToken` inside `options` to `supabase.auth.signInWithPassword`.

#### [MODIFY] src/app/signup/page.js
- Import the Turnstile component.
- Add a Turnstile widget above the submit button.
- Capture the `captchaToken`.
- Pass `captchaToken` inside `options` to `supabase.auth.signUp`.

#### [MODIFY] src/app/auth/register/page.js
- Apply the same Turnstile logic as the signup page to protect the elite registration route.

## Verification Plan
### Manual Verification
1. Open the login page and verify the Turnstile widget loads successfully.
2. Try to log in without completing the captcha (it should be blocked).
3. Complete the captcha and log in successfully.
4. Repeat for the signup pages.
