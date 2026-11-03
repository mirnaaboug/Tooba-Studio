# Tooba Studio Onboarding Flow

_Started 2026-11-02 10:31 UTC_

---

## User

create a high fidelity prototype build me an onboarding flow for tooba studio for clients that are just coming in to choose the service they need

## Assistant



## Assistant

_[tool: ask_user]_

Before I build, I need a few answers in the form: platform, which services to offer, how clients choose, which steps to include, pricing, and language. Skip any you like and I'll decide those myself.

## User

<artifact-content-authored-by-others/>
Answered — platform: Desktop web; services: Strategy, Naming, Identity, Typography, Color, Brand book, Packaging, Social, Rebrand; selection_model: Recommendation first, then customise; steps: Welcome, About your business, Stage (new brand / rebrand), Services, Timeline & budget, Language (Arabic / English / both), Contact details, Review & submit, Confirmation (48-hour brief promise); pricing: Yes, fixed prices; arabic: English only; variations: One polished flow

## Assistant

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: run_script]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: copy_files]_

_[tool: read_file]_

_[tool: dc_write]_

_[tool: dc_write]_

_[tool: ready_for_verification]_

I've built the onboarding flow as one prototype, with motion throughout. It's out for a final check now.

- **Start screen:** a wall of bricks lays itself in row by row while the headline fades in. Bricks lift toward your cursor, the brick you're over gets the apricot dot pair, and clicking sends a ripple across the wall. With no cursor on it, a slow spotlight keeps it moving.
- **Seven steps:** your business, stage, services, timeline & budget, language, contact details and review. A left rail shows progress and keeps a running total of the selection and price.
- **Services:** the recommended package and the three reasons behind it come first. Clients can then switch packages or add and remove individual services. Package pricing applies only when the selection exactly matches a package; otherwise each service is priced on its own.
- **Ending:** after a short "laying the first brick" moment, a confirmation screen gives a reference number, the 48-hour brief date and the next steps, with the brick wall again.
- **Smaller details:**
  - If the selection costs more than the chosen budget, the flow suggests a package that fits.
  - Progress is saved, so a returning client sees "Continue where you left off."

**You need to confirm the prices.** You didn't give any, so every price and package is a placeholder I made up:
- Foundation: EGP 52k
- Full identity: EGP 76k
- Launch ready: EGP 92k
- Rebrand: EGP 88k

**Tweaks:** one switch hides prices and another jumps straight to the services, review or confirmation screen with sample answers filled in.

## User

i dont like the split screen

## Assistant

_[tool: read_file]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I've removed the split screen from the start and confirmation screens. The brick wall now fills the whole screen, and the text sits on an Oat card over it that slides in once the bricks are laid. The wall still reacts to your cursor and clicks wherever the card doesn't cover it.

The seven steps still have a left sidebar showing progress. If that's the split you meant, I can swap it for a top bar.

## User

Found issues — fixing…

## Assistant

_[tool: run_script]_

_[tool: ready_for_verification]_

On laptop-height screens the start screen's card was cut off, hiding the start button. I've made it more compact: less padding and spacing, a smaller headline, and no icons in the three-point row. The confirmation card got the same treatment. I haven't re-checked it at small heights yet; that check is running now.

## User

no  i want it alot more intraactive and fun with things moving across the screen

## Assistant

_[tool: grep]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I've made the start screen a lot livelier. It's out for a check now.

- **On load:** dozens of bricks rush in from the left, then settle into a drifting stream across the whole screen. Bricks nearer the front move faster than those behind.
- **Grab and throw:** you can pick up any brick, drag it and fling it. It spins off and then rejoins the stream.
- **Cursor:** moving the mouse pushes nearby bricks out of the way and sets them spinning, even when the pointer is over the card.
- **Click:** clicking empty space bursts seven new bricks out from that point.
- **What's on the bricks:** some carry the Tooba service icons and some carry the apricot dots, so the stream reads as the studio's services.
- **Hint:** a small label in the bottom-right says "Grab a brick and throw it · Click to lay more".

The confirmation screen uses the same moving brick stream.

## User

Found issues — fixing…

## Assistant

Moving the chip to top-right avoids overlap at any width.

_[tool: str_replace_edit]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: ready_for_verification]_

The "Grab a brick and throw it" label no longer covers the card on narrower screens. It now only shows on windows at least 1,240px wide, where it fits beside the card.

One problem is still open: the page logs a single error with no message. I haven't found its cause yet, and a check is running now to trace it.

## User

no give me another option i want the landing page to be scrollable so on the top something fun and interactive and then when i scroll down i get the place to starting inputing as a client

## Assistant

_[tool: copy_files]_

_[tool: run_script]_

_[tool: ready_for_verification]_

I've added the scrolling landing page as a second option, **Tooba Onboarding v2**; the first version is unchanged. It's out for a check now.

- **Top of the page:** the moving brick stream fills the screen, with a header bar holding the logo and a "Start your project" button. The big headline sits on a solid green block, and a "Scroll to start" button bobs gently in the corner. Scrolling knocks the bricks upward and sets them spinning.
- **Scrolling down:** you reach "Let's start with you." The three promises are on the left, and on the right is a form for business name, city, industry and a one-line description. Continue takes the client straight to step 2 (Stage). Returning visitors get a "Continue where you left off" prompt above the form.
- **Bottom:** the page ends with a band of the Tooba brick pattern.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

The brick-pattern band at the bottom of the v2 landing page now shows at its full 160px. Before, it had no height, so the page ended in a stretch of empty space below the form. I skipped the full check for this small fix, but the page loads with no errors.

## User

fix the icons and text i dont like them really tall like that

## Assistant

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: ready_for_verification]_

I've made the Stage cards compact. Each now has a 32px icon on the left, then the title and a shorter description, with the selection circle on the right. I removed the forced tall height, so the cards are about half as tall. I skipped the full check for this small edit, but the page loads with no errors.

The Language step's cards still use the same tall layout. Want me to match them?

