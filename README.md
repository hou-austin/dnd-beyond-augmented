# How to Install an Unpacked Extension in Chrome

Follow these steps to load the D&D Beyond Enhanced Tooltips extension as an unpacked extension in Chrome:

1. **Download the Extension Files**

   - Download and unzip the extension files to a folder on your computer.

2. **Open Chrome Extensions Page**

   - Open Google Chrome and navigate to `chrome://extensions/`

3. **Enable Developer Mode**

   - Look for the "Developer mode" toggle in the top right corner of the extensions page.
   - Turn on Developer mode by clicking the toggle.

4. **Load Unpacked Extension**

   - Click the "Load unpacked" button that appears in the top left after enabling Developer mode.
   - Navigate to the folder containing the unzipped extension files.
   - Select the folder and click "Select Folder" (on Windows) or "Open" (on Mac).

5. **Verify Installation**

   - The extension should now appear in your list of installed extensions.
   - You should see the extension's icon in the Chrome toolbar.

6. **Use the Extension**
   - Navigate to D&D Beyond and refresh existing D&D Betyond tabs.

Note: You may need to refresh any open D&D Beyond tabs for the extension to take effect.

If you make any changes to the extension files, remember to click the "Reload" button on the extension's card in the `chrome://extensions/` page to update it.

This extension for D&D Beyond adds tooltips and modifies stat blocks to provide quick insights into Armor Class (AC) thresholds and potential damage outcomes based on the precision of attacks. The rules are based on an adaptation of the DC20 attack rules for D&D.

**Core rule: For every 5 over your target's AC that your attack rolls for, add your Proficiency Bonus modifier to your base attack damage.**

### Why?

Damage is no longer rolled to expedite combat and prevent thematically problematic situations where an exceptionally high attack roll results in minimal damage. This eliminates the possibility of rolling a 30 and dealing only 5 damage.
Increasing your AC through reactions like the Shield spell can mitigate damage even if the attack still hits (by removing a Proficiency Bonus modifier); Armor class will now effectively reduce the damage taken. Therefore, I recommend adjusting the Shield spell to provide a +2 bonus, with the option to upcast it to a maximum of +5, or consider an alternative adjustment of your choice.
Criticals will no longer exist, but the average damage dealt should increase overall. Brutal hits can substitute for criticals if you have a mechanic that triggers on critical hits. Accordingly, adjust any features that increase the chance of landing a critical.

### Features:

- AC Display: Hover over your AC value to see thresholds for more impactful hits.
- Damage Tooltips: Hover over damage rolls to view potential outcomes for different hit qualities.
- Monster Stat Block: Automatically updates monster AC and attack information with the calculations.

### Understanding the Values:

#### For Armor Class (AC):

When you hover over an AC value, you'll see two values separated by a "/".
These values represent thresholds for increasingly powerful hits:

**Light Hit:** Just meeting the AC.
**Heavy Hit:** Surpassing the AC by a significant margin (first value of the "/").
**Brutal Hit:** Greatly exceeding the AC (second value of the "/").

As attacks become more precise (i.e., roll higher), they deal increasingly devastating damage.

#### For Attack Damage:

When you hover over a damage roll, you'll see: Base Damage (a/b)
These values show potential damage based on hit quality:

Base Damage: Damage dealt by a Light Hit.
a: Increased damage from a Heavy Hit.
b: Maximum damage from a Brutal Hit.

Think of it as the difference between merely striking your target (Light Hit) and finding the perfect weak spot (Brutal Hit).
The extension calculates these thresholds and potential damages automatically, considering factors like proficiency bonus to give you a quick preview of possible outcomes.
These enhancements apply to both player characters and monster stat blocks (for players and DM's).
