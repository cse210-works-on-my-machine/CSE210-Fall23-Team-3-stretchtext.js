'use strict';

const TITLE_WHEN_CLOSED = 'Expand';
const TITLE_WHEN_OPEN   = 'Collapse';

// requestAnimationFrame shimming, default to 60 fps callback invoking
const callbackInvoker = callback => window.setTimeout(callback, 1000 / 60);
const requestAnimationFrame =
	window.requestAnimationFrame       ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame    ||
	window.oRequestAnimationFrame      ||
	window.msRequestAnimationFrame     ||
	callbackInvoker;


const isBlockLevelDetail = summary => summary.nodeName.toLowerCase() === 'a';

function toggleSummaryAnimation(summary, detail){
	summary.classList.toggle('stretchtext-open');
	detail.classList.toggle('stretchtext-open');

	if (summary.classList.contains('stretchtext-open')){
		setTitle(summary, TITLE_WHEN_OPEN);
	} else {
		setTitle(summary, TITLE_WHEN_CLOSED);
	}
}

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

	requestAnimationFrame(toggleSummaryAnimation(summary, detail));
}

function setTitle(summary, title){
	// If the user placed a manual title on the summary leave it alone.
	if (summary.hasAttribute('title')){
		return;
	} else {
		summary.setAttribute('title', title);
	}
}

const findDetailFor = summary => isBlockLevelDetail(summary) ? 
								findDetailForBlockLevel(summary) : 
								findDetailForNonBlockLevel(summary);

function findDetailForBlockLevel(summary){
	let id = summary.getAttribute('href').replace(/^#/, '');
	let detail = document.getElementById(id);
	if (!detail && window.console){
		console.error('No StretchText details element with ID: ' + id);
	}
	return detail;
}

function findDetailForNonBlockLevel(summary){
	let detail = summary.nextElementSibling;
	if (!detail && window.console){
		console.error('No StretchText details element found for: ', summary);
	}
	return detail;
}

function getSummaries(){
	let results = [];
	let summaries;

	// epub-type
	summaries = document.querySelectorAll('[epub-type="stretchsummary"]');
	Array.prototype.forEach.call(summaries, (result) => {results.push(result)});

	// CSS class.
	summaries = document.getElementsByClassName('stretchsummary');
	Array.prototype.forEach.call(summaries, (result) => {results.push(result)});

	return results;
}

function setupSummary(summary){
	// FIXME(slightlyoff): Add global handlers instead of one per item.
	summary.setAttribute('title', TITLE_WHEN_CLOSED);
	// Listen on mousedown instead of click so that we can prevent text
	// selection if mouse is clicked rapidly.
	summary.addEventListener('mousedown', toggleSummary);

	summary.addEventListener('touchstart', toggleSummary);

	// Link resolving can't be canceled in mousedown event, only in click
	// event.
	summary.addEventListener('click', (e) => {e.preventDefault()});
}

function loaded(){
	// FIXME(slightlyoff): Add global handlers instead of one per item.
	getSummaries().forEach((summary) => {setupSummary(summary)});
}

window.addEventListener('load', loaded)

// TODO: 
// write comment documentation for each function
// unit testing
// look through CSS for possible improvements
// improve HTML demonstration
// look into ES6 modules more
// think about global handlers
// think about architectural changes such as changing <a> tags used to <div> etc, or a custom tag