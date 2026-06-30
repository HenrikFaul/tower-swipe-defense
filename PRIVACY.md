# Privacy Policy — Tower Swipe Defense

_Last updated: 2026-06-30_

Tower Swipe Defense (`com.towerswipe.defense`, the "Game") is an offline,
single-player tower-defense game. This policy explains exactly what the Game
does and does not do with your data.

## Summary

- **No account is required to play.**
- **No personal data is collected, sold, or shared.**
- **No advertising or analytics SDKs are bundled.**
- All gameplay data stays **on your device** unless you explicitly enable
  optional cloud sync.

## Data stored on your device

The Game saves the following locally (in the app's private storage) so your
progress persists between sessions:

- Game progress: best wave, best score, run history, earned coins and gems.
- Unlocked tower upgrades and relics.
- Settings: sound, haptics, auto-start, reduced motion.

This data never leaves your device unless you turn on cloud sync. You can erase
all of it at any time via **Android Settings → Apps → Tower Swipe Defense →
Storage → Clear data** (this is also your GDPR/CCPA "right to erasure").

## Optional cloud sync (leaderboards)

If a future build offers cloud sync / leaderboards, it uses an encrypted HTTPS
connection to a backend (Supabase). In that case only an anonymous run record
(score, wave reached, a random run seed) is transmitted — never contacts,
location, device identifiers, or any personally identifying information. Cloud
sync is **off by default** and only runs when you opt in.

## Permissions

- `INTERNET` — used only for optional cloud sync; the Game is fully playable
  with no network connection.
- `VIBRATE` — haptic feedback during gameplay (can be disabled in Settings).

The Game does **not** request location, camera, microphone, contacts, storage,
or any other sensitive permission.

## Network security

All network traffic is HTTPS. Cleartext (unencrypted `http://`) traffic is
disabled at the operating-system level via an Android Network Security Config.

## Children

The Game does not knowingly collect any data from anyone, including children
under 13, because it collects no personal data at all.

## Changes

If this policy changes, the "Last updated" date above will change and the new
version will ship with the corresponding app update.

## Contact

Questions about this policy: **henrikfaul.hf@gmail.com**
