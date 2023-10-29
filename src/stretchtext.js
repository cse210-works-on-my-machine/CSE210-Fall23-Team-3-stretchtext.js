'use strict';
{
	const TITLE_WHEN_CLOSED = 'Expand';
	const TITLE_WHEN_OPEN = 'Collapse';

	// requestAnimationFrame shimming.
	var requestAnimationFrame =
		window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        (callback => {
        	window.setTimeout(callback, 1000 / 60);
        });

	/**
	 * Toggles the appearnce of the detail attached to a summary. Opens if closed and closes if open
	 * @function toggleSummary
	 * @param {Event} evt - The javascript event that triggered this function
	 */
	function toggleSummary(evt){
		// Prevent the text from being selected if rapidly clicked.
		evt.preventDefault();

		let summary = evt.target;
		let detail = findDetailFor(summary);
		if (!detail){ return; }

		// CSS Transitions don't work as expected on things set to 'display: none'. Make the
		// stretch details visible if needed, then use a timeout for the transition to take
		// effect.
		if (summary.classList.contains('stretchtext-open')){
			detail.style.display = 'none';
		} else {
			detail.style.display = isBlockLevelDetail(summary) ? 'block' : 'inline';
		}

		requestAnimationFrame(() => {
			summary.classList.toggle('stretchtext-open');
			detail.classList.toggle('stretchtext-open');

			summary.classList.contains('stretchtext-open') ? 
				setTitle(summary, TITLE_WHEN_OPEN):
				setTitle(summary, TITLE_WHEN_CLOSED);
		});
	}

	/**
	 * Checks if given summary is a block level detail
	 * @function isBlockLevelDetail
	 * @param {Element} summary - the summary to check
	 * @returns {boolean} Whether the summary is a block level detail or not.
	 */
	function isBlockLevelDetail(summary){
		return summary.nodeName.toLowerCase() === 'a';
	}

	/**
	 * Sets tittle of given summary. Does not overwrite the title if user has already set one
	 * @function setTitle
	 * @param {Element} summary - the summary to set title for. 
	 * @param {string}  title   - the title for the summary 
	 */
	function setTitle(summary, title){
		// If the user placed a manual title on the summary leave it alone.
		if (!summary.hasAttribute('title')){
			summary.setAttribute('title', title);
		}
	}

	/**
	 * Find a detail element for some summary element.
	 * @function findDetailFor
	 * @param {Element} summary - The summary element to find the correpsonding detail for.
	 * @returns {HTMLElement | null} The corresponding detail element or null if we can't find one.
	 */
	function findDetailFor(summary){
		if (isBlockLevelDetail(summary)){
			const id = summary.getAttribute('href').replace(/^#/, '');
			const detail = document.getElementById(id);
			if (!detail && window.console){
				console.error('No StretchText details element with ID: ' + id);
			}
			return detail;
		} else {
			const detail = summary.nextElementSibling;
			if (!detail && window.console){
				console.error('No StretchText details element found for: ', summary);
			}
			return detail;
		}
	}
	
	let loadedCalled = false;
	/**
	 * Adds events to the stretch elements in the HTML file. 
	 * @function loaded
	 * @pre The page's content has been loaded.
	*/
	function loaded(){
		if (loadedCalled){ return; }
		loadedCalled = true;
		// FIXME(slightlyoff): Add global handlers instead of one per item.
		for (const summary of document.getElementsByClassName('stretchsummary')) {
			summary.setAttribute('title', TITLE_WHEN_CLOSED);

			// Listen on mousedown instead of click so that we can prevent text
			// selection if mouse is clicked rapidly.
			summary.addEventListener('mousedown', toggleSummary);

			summary.addEventListener('touchstart', toggleSummary);

			// Link resolving can't be canceled in mousedown event, only in click
			// event.
			summary.addEventListener('click', e => e.preventDefault());
		}
	}

	window.addEventListener('DOMContentLoaded', loaded);
	if (document.readyState == "complete"){
		loaded();
	}
}