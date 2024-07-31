function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function createTooltip() {
  const tooltip = document.createElement('div');
  tooltip.className = 'ddb-tooltip';
  document.body.appendChild(tooltip);
  return tooltip;
}

function updateTooltipPosition(element, tooltip) {
  const rect = element.getBoundingClientRect();

  // Set display to 'block' and visibility to 'hidden' to calculate dimensions
  tooltip.style.display = 'block';
  tooltip.style.visibility = 'hidden';

  const tooltipRect = tooltip.getBoundingClientRect();

  const left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  const top = rect.bottom + 5;

  tooltip.style.left = `${left + window.scrollX}px`;
  tooltip.style.top = `${top + window.scrollY}px`;

  // Restore visibility
  tooltip.style.visibility = 'visible';
}

function updateACTooltip(element, tooltip) {
  const acValueElement = element.querySelector('.ddbc-armor-class-box__value');
  if (acValueElement) {
    const acValue = parseInt(acValueElement.textContent);
    tooltip.textContent = `${acValue + 5}/${acValue + 10}`;
    updateTooltipPosition(element, tooltip);
  } else {
    tooltip.style.display = 'none';
  }
}

function addACTooltip(acSummary) {
  const tooltip = createTooltip();
  let isHovering = false;

  const showTooltip = () => {
    isHovering = true;
    updateACTooltip(acSummary, tooltip);
  };

  const hideTooltip = () => {
    isHovering = false;
    tooltip.style.display = 'none';
  };

  const debouncedUpdateTooltip = debounce(() => {
    if (isHovering) {
      updateACTooltip(acSummary, tooltip);
    }
  }, 100);

  acSummary.addEventListener('mouseenter', showTooltip);
  acSummary.addEventListener('mouseleave', hideTooltip);

  window.addEventListener('resize', debouncedUpdateTooltip);
  document.addEventListener('scroll', debouncedUpdateTooltip);
}

function parseDiceNotation(notation) {
  const match = notation.match(/(\d+)d(\d+)([-+]\d+)?/);
  if (match) {
    const numDice = parseInt(match[1]);
    const diceType = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;
    const average = Math.floor((numDice * (diceType + 1)) / 2 + modifier);
    return average;
  }
  return null;
}

function getProficiencyBonus() {
  const profBonusElement = document.querySelector(
    '.ct-proficiency-bonus-box__value'
  );
  if (profBonusElement) {
    const profBonusSpan = profBonusElement.querySelector('span:not([class])');
    if (profBonusSpan) {
      return parseInt(profBonusSpan.textContent) || 0;
    }
  }
  return 0;
}

function updateDamageTooltip(element, tooltip) {
  const damageValueElement = element.querySelector('.ddbc-damage__value');
  if (damageValueElement) {
    const diceNotation = damageValueElement.textContent.trim();
    const averageDamage = parseDiceNotation(diceNotation);
    if (averageDamage !== null) {
      const profBonus = getProficiencyBonus();
      const withProfBonus = averageDamage + profBonus;
      const withDoubleProfBonus = averageDamage + 2 * profBonus;

      tooltip.textContent = `${averageDamage} (${withProfBonus}/${withDoubleProfBonus})`;
      updateTooltipPosition(element, tooltip);
    } else {
      tooltip.style.display = 'none';
    }
  } else {
    tooltip.style.display = 'none';
  }
}

function addDamageTooltip(damageButton) {
  const tooltip = createTooltip();
  let isHovering = false;

  const showTooltip = () => {
    isHovering = true;
    updateDamageTooltip(damageButton, tooltip);
  };

  const hideTooltip = () => {
    isHovering = false;
    tooltip.style.display = 'none';
  };

  const debouncedUpdateTooltip = debounce(() => {
    if (isHovering) {
      updateDamageTooltip(damageButton, tooltip);
    }
  }, 100);

  damageButton.addEventListener('mouseenter', showTooltip);
  damageButton.addEventListener('mouseleave', hideTooltip);

  window.addEventListener('resize', debouncedUpdateTooltip);
  document.addEventListener('scroll', debouncedUpdateTooltip);
}

function modifyMonsterAC(acDataSpan) {
  const originalAC = parseInt(acDataSpan.textContent);
  if (!isNaN(originalAC)) {
    const modifiedText = `${originalAC} (${originalAC + 5}/${originalAC + 10})`;
    if (acDataSpan.textContent !== modifiedText) {
      acDataSpan.textContent = modifiedText;
    }
  }
}

function observeMonsterAC(acDataSpan) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'characterData' || mutation.type === 'childList') {
        modifyMonsterAC(acDataSpan);
      }
    });
  });

  observer.observe(acDataSpan, {
    characterData: true,
    childList: true,
    subtree: true,
  });
}

function handleMonsterACLabel(acLabel) {
  const acValueSpan = acLabel.nextElementSibling;
  if (
    acValueSpan &&
    acValueSpan.classList.contains('mon-stat-block__attribute-value')
  ) {
    const acDataSpan = acValueSpan.querySelector(
      '.mon-stat-block__attribute-data-value'
    );
    if (acDataSpan) {
      modifyMonsterAC(acDataSpan);
      observeMonsterAC(acDataSpan);
    }
  }
}

function getMonsterProficiencyBonus(statBlock) {
  const profBonusTidbits = statBlock.querySelectorAll(
    '.mon-stat-block__tidbit'
  );
  for (const tidbit of profBonusTidbits) {
    const label = tidbit.querySelector('.mon-stat-block__tidbit-label');
    if (label && label.textContent.trim() === 'Proficiency Bonus') {
      const data = tidbit.querySelector('.mon-stat-block__tidbit-data');
      if (data) {
        const bonusText = data.textContent.trim();
        const bonus = parseInt(bonusText.replace('+', ''));
        return isNaN(bonus) ? 0 : bonus;
      }
    }
  }
  return 0;
}

function updateHitValue(hitNode, profBonus) {
  const hitText = hitNode.textContent.trim();
  const match = hitText.match(/^(\d+)(\s*\([^)]+\))?(.*)$/);
  if (match) {
    const hitValue = parseInt(match[1]);
    const damageRoll = match[2] || '';
    const restOfText = match[3] || '';

    // Check if the hit value has already been updated
    if (hitText.includes('/')) {
      return; // Already updated, do nothing
    }

    const withProfBonus = hitValue + profBonus;
    const withDoubleProfBonus = hitValue + 2 * profBonus;

    const newText = `${hitValue} (${withProfBonus}/${withDoubleProfBonus})${damageRoll}${restOfText}`;
    hitNode.textContent = newText;
  }
}

function updateMonsterHitValues(descriptionBlock, profBonus) {
  const paragraphs = descriptionBlock.querySelectorAll('p');

  paragraphs.forEach((p) => {
    const hitElements = p.querySelectorAll('em');
    hitElements.forEach((em) => {
      if (em.textContent.trim().toLowerCase() === 'hit:') {
        let hitNode = em.nextSibling;
        while (
          hitNode &&
          hitNode.nodeType === Node.TEXT_NODE &&
          hitNode.textContent.trim() === ''
        ) {
          hitNode = hitNode.nextSibling;
        }
        if (hitNode && hitNode.nodeType === Node.TEXT_NODE) {
          updateHitValue(hitNode, profBonus);
        }
      }
    });
  });
}

function observeMonsterStatBlock(statBlock) {
  const profBonus = getMonsterProficiencyBonus(statBlock);
  const descriptionBlockContainer = statBlock.querySelector(
    '.mon-stat-block__description-blocks'
  );

  if (!descriptionBlockContainer) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const descriptionBlocks = statBlock.querySelectorAll(
          '.mon-stat-block__description-block-content'
        );
        descriptionBlocks.forEach((block) =>
          updateMonsterHitValues(block, profBonus)
        );
      }
    });
  });

  observer.observe(descriptionBlockContainer, {
    childList: true,
    subtree: false,
  });

  // Initial update
  const descriptionBlocks = statBlock.querySelectorAll(
    '.mon-stat-block__description-block-content'
  );
  descriptionBlocks.forEach((block) =>
    updateMonsterHitValues(block, profBonus)
  );
}

function handleMonsterStatBlock(statBlock) {
  observeMonsterStatBlock(statBlock);
}

// Remove the updateAllMonsterStatBlocks function and related code

function observeDOM() {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const acSummaries = node.querySelectorAll(
              '.ct-combat__summary-group.ct-combat__summary-group--ac'
            );
            acSummaries.forEach(addACTooltip);

            const damageButtons = node.querySelectorAll(
              'button.integrated-dice__container'
            );
            damageButtons.forEach((button) => {
              if (button.querySelector('.ddbc-damage__value')) {
                addDamageTooltip(button);
              }
            });

            // Check for monster stat block AC labels
            const acLabels = node.querySelectorAll(
              'span.mon-stat-block__attribute-label'
            );
            acLabels.forEach((label) => {
              if (label.textContent.trim().toLowerCase() === 'armor class') {
                handleMonsterACLabel(label);
              }
            });

            // Check for monster stat blocks
            const statBlocks = node.querySelectorAll('.mon-stat-block');
            statBlocks.forEach(handleMonsterStatBlock);
          }
        });
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
}

// Start observing the DOM for changes
observeDOM();

// Check for existing elements on page load
document
  .querySelectorAll('.ct-combat__summary-group.ct-combat__summary-group--ac')
  .forEach(addACTooltip);
document
  .querySelectorAll('button.integrated-dice__container')
  .forEach((button) => {
    if (button.querySelector('.ddbc-damage__value')) {
      addDamageTooltip(button);
    }
  });

// Check for existing monster stat block AC labels
document
  .querySelectorAll('span.mon-stat-block__attribute-label')
  .forEach((label) => {
    if (label.textContent.trim().toLowerCase() === 'armor class') {
      handleMonsterACLabel(label);
    }
  });

// Check for existing monster stat blocks
document.querySelectorAll('.mon-stat-block').forEach(handleMonsterStatBlock);
