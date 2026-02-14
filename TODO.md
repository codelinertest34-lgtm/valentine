# TODO: Remove Reels Viewer Feature from Page 3

## Task Summary
Undo the entire reels viewer feature from page 3 by removing all related code from page3.html, styles.css, and script.js.

## Files to Clean

### 1. page3.html
- [ ] Remove clickable GIF attributes (`role="button"`, `tabindex="0"`, `id="page3-gif"`)
- [ ] Remove the tip text "Tip: Tap the gif to watch your reels 🎬"
- [ ] Remove entire reels modal markup (lines ~93-485)
- [ ] Restore the top GIF to normal non-clickable state

### 2. styles.css
- [ ] Remove `.reels-modal` class
- [ ] Remove `.reels-container` class
- [ ] Remove `.reel` class
- [ ] Remove `.reel-video` class
- [ ] Remove `.reel-ui` class
- [ ] Remove `.reel-meta` class
- [ ] Remove `.reel-userline` class
- [ ] Remove `.reel-avatar` class
- [ ] Remove `.reel-username` class
- [ ] Remove `.reel-captionline` class
- [ ] Remove `.reel-caption-text` class
- [ ] Remove `.reel-more` class
- [ ] Remove `.reel-audio` class
- [ ] Remove `.reel-actions` class
- [ ] Remove `.reel-action` class
- [ ] Remove `.reel-end` class
- [ ] Remove `.end-placeholder` class
- [ ] Remove scroll-snap vertical rules related to reels
- [ ] Remove modal overlay styles if only used for reels
- [ ] Remove `.gif-tip` class
- [ ] Remove `#page3-gif` styles

### 3. script.js
- [ ] Remove `initPage3Reels()` function
- [ ] Remove the call to `initPage3Reels();`
- [ ] Ensure no leftover event listeners remain

## Verification
- [ ] Page 3 layout should remain unchanged (white box, gif, heading, tiles, footer)
- [ ] No horizontal scroll should be introduced
- [ ] Site should work normally after cleanup
- [ ] No console errors should appear
