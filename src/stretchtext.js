'use strict';
{
  const TITLE_WHEN_CLOSED = 'Expand';
  const TITLE_WHEN_OPEN = 'Collapse';
  // 1000ms / 60 = duration of 1 frame at 60fps
  const ENFORCED_FPS = 60;
  const TIMEOUT_MS = 1000 / ENFORCED_FPS;

  /**
   * RequestAnimationFrame shimming.
  */
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    (callback => window.setTimeout(callback, TIMEOUT_MS));

  /**
   * Opens or closes a stretchtext summary.
   * @param {PointerEvent} evt - the click event from clicking on the stretchtext
   */
  function toggleSummary (evt) {
    // Prevent the text from being selected if rapidly clicked.
    evt.preventDefault();

    const summary = evt.target;
    const detail = findDetailFor(summary);
    if (!detail) return;

    // CSS Transitions don't work as expected on things set to 'display: none'. Make the
    // stretch details visible if needed, then use a timeout for the transition to take
    // effect.
    if (summary.classList.contains('stretchtext-open')) {
      detail.style.display = 'none';
    } else {
      detail.style.display = isBlockLevelDetail(summary) ? 'block' : 'inline';
    }

    requestAnimationFrame(() => {
      summary.classList.toggle('stretchtext-open');
      detail.classList.toggle('stretchtext-open');

      if (summary.classList.contains('stretchtext-open')) {
        setTitle(summary, TITLE_WHEN_OPEN);
      } else {
        setTitle(summary, TITLE_WHEN_CLOSED);
      }
    });
  }

  /**
   * Check if the summary is an anchor tag.
   * @param {Element} summary - the DOM element containing a stretchtext summary
   * @returns {boolean} True if element is an anchor tag, False otherwise
   */
  // TODO: rename to isAnchorDetail
  function isBlockLevelDetail (summary) {
    return summary.nodeName.toLowerCase() === 'a';
  }

  /**
  * Sets the title attribute for a summary if it is not already present.
  * @function setTitle
  * @param {HTMLElement} summary - The summary element for which to set the title attribute.
  * @param {string} title - The title to set if the 'title' attribute is not present.
  * @returns {void}
  */
  function setTitle (summary, title) {
    if (!summary.hasAttribute('title')) {
      summary.setAttribute('title', title);
    }
  }

  /**
  * Finds the associated detail element for a given summary.
  * @function findDetailFor
  * @param {HTMLElement} summary - The summary element to find the associated detail for.
  * @returns {HTMLElement | null} The associated detail element, or null if not found.
  */
  function findDetailFor (summary) {
  // If the summary is an anchor tag, the href attribute contains the ID of the element.
    if (isBlockLevelDetail(summary)) {
      // Strip the leading '#' from the href attribute to get the ID.
      const id = summary.getAttribute('href').replace(/^#/, '');
      const detail = document.getElementById(id);
      if (!detail && window.console) {
        console.error('No StretchText details element with ID: ' + id);
      }
      return detail;
    } else {
      const detail = summary.nextElementSibling;
      if (!detail && window.console) {
        console.error('No StretchText details element found for: ', summary);
      }
      return detail;
    }
  }

  /**
  * Retrieves summaries based on 'epub-type' attribute and CSS class.
  * @function getSummaries
  * @description Retrieves summary elements using 'epub-type' attribute and CSS class.
  * @returns {Node[]} An array containing summary elements.
  */
  // TODO: add support for custom tags?
  function getSummaries () {
    const results = [];

    // epub-type
    let summaries = document.querySelectorAll('[epub-type="stretchsummary"]');
    Array.prototype.forEach.call(summaries, function (result) {
      results.push(result);
    });

    // CSS class.
    summaries = document.getElementsByClassName('stretchsummary');
    Array.prototype.forEach.call(summaries, function (result) {
      results.push(result);
    });

    return results;
  }

  /**
  * Function to initialize summaries with event listeners and attributes.
  * @function loaded
  * @description Initializes elements and adds event listeners for interaction.
  */
  function loaded () {
    // FIXME(slightlyoff): Add global handlers instead of one per item.
    getSummaries().forEach(summary => {
      summary.setAttribute('title', TITLE_WHEN_CLOSED);

      // Listen on mousedown instead of click so that we can prevent text
      // selection if mouse is clicked rapidly.
      summary.addEventListener('mousedown', toggleSummary);

      summary.addEventListener('touchstart', toggleSummary);

      // Link resolving can't be canceled in mousedown event, only in click
      // event.
      summary.addEventListener('click', e => { e.preventDefault(); });
    });
  }

  // NOTE: does not work on IE6-8, but neither does ES6 JS
  window.addEventListener('DOMContentLoaded', loaded);
}
