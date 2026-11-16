# Android app

Capacitor shell that loads the live site (`server.url` in `capacitor.config.json`)
and opens on `/login`. The WebView adds `AhmedEmadApp/<version>` to its user agent;
the middleware (`src/lib/auth/auth.config.ts`) uses it to hide marketing pages and
send signed-in users straight to their dashboard. Every website change ships to
the app with no new APK.

    cd mobile
    npm install
    npm run build:debug      # android/app/build/outputs/apk/debug/app-debug.apk
    npm run open             # open in Android Studio

Icons and splash: replace `assets/logo.png`, then
`npx @capacitor/assets generate --android --iconBackgroundColor "#050505" --splashBackgroundColor "#050505"`.
