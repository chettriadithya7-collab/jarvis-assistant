# JARVIS Voice Agent V3

A phone-friendly, local-first voice interface and starter app builder. It adds tap-to-talk speech recognition (where supported), spoken responses, a basic command router, research-search handoff, and safe educational guidance for cybersecurity and trading topics.

## Run on Android

1. Download and extract the ZIP.
2. For microphone features, host the files over HTTPS. GitHub Pages is one free option: create a repository, upload the extracted files, then enable Pages in Settings.
3. Open the deployed HTTPS URL in a current Chrome browser.
4. Allow microphone permission only if you want voice input.
5. Tap **Speak to JARVIS** and say a command. The browser may use a remote speech-recognition service; do not assume voice input is offline.
6. For an app-building request, review the filled command and tap **Build my app**.
7. Inspect the preview and run the basic checks; download the generated project ZIP.

## Free hosting

See GitHub Pages documentation: https://docs.github.com/pages

## Current limitations

- This is not an unrestricted autonomous AI or an always-listening wake-word assistant.
- Speech recognition support varies by browser and may send audio to a service for processing. Tap-to-talk is used rather than continuous background listening.
- Local template generation supports a small set of app types; other ideas get a general scaffold.
- Research links open a search page for the user to review; this prototype does not autonomously browse or verify claims.
- Trading help is educational only; no live market feed, order placement, or guaranteed forecasts.
- Cybersecurity help is limited to defensive learning and authorised practice.
- No API keys are required because no LLM is connected. A true general-purpose agent needs a model endpoint, secure backend, explicit tool permissions, and a test/sandbox environment.
- Never paste passwords, API keys, financial account credentials, or private data into client-side code.
